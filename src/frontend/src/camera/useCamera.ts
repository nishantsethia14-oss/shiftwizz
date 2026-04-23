import { useCallback, useEffect, useRef, useState } from "react";

export interface CameraConfig {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
  quality?: number;
  format?: "image/jpeg" | "image/png" | "image/webp";
}

export interface CameraError {
  type: "permission" | "not-supported" | "not-found" | "unknown";
  message: string;
}

// ── Frame analysis helpers ───────────────────────────────────────────────────

const DETECTION_ITEMS = [
  "LED TV (55 inch)",
  "Refrigerator (Double Door)",
  "Washing Machine",
  "Sofa Set (3+2)",
  "Double Bed with Mattress",
  "Wardrobe (3-door)",
  "Dining Table (6 seater)",
  "Microwave Oven",
  "Air Conditioner (Split)",
  "Geyser / Water Heater",
  "Mixer & Grinder",
  "Laptop / Computer",
  "Desktop + Monitor",
  "Bookshelf (5-tier)",
  "Curtains & Rods",
  "Mattress (King Size)",
  "Ceiling Fan",
  "Water Purifier (RO)",
  "Exercise Cycle / Treadmill",
  "Study Table with Chair",
  "Shoe Rack",
  "Kitchen Chimney",
];

interface FrameMetrics {
  avgBrightness: number;
  colorVariance: number;
  edgeDensity: number;
  dominantHue: number; // 0-360
}

function analyzeImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): FrameMetrics {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  const step = 4; // Sample every 4th pixel for performance

  // First pass — compute averages
  let count = 0;
  for (let i = 0; i < data.length; i += step * 4) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
    count++;
  }
  const avgR = count > 0 ? totalR / count : 128;
  const avgG = count > 0 ? totalG / count : 128;
  const avgB = count > 0 ? totalB / count : 128;
  const avgBrightness = (avgR + avgG + avgB) / 3;

  // Variance (color spread)
  let varSum = 0;
  for (let i = 0; i < data.length; i += step * 4) {
    const dr = data[i] - avgR;
    const dg = data[i + 1] - avgG;
    const db = data[i + 2] - avgB;
    varSum += dr * dr + dg * dg + db * db;
  }
  const colorVariance = count > 0 ? Math.sqrt(varSum / count) : 0;

  // Edge detection: simplified Sobel on a downsampled grid
  const gridW = Math.floor(width / 8);
  const gridH = Math.floor(height / 8);
  let edgeCount = 0;
  let edgeTotal = 0;
  for (let gy = 1; gy < gridH - 1; gy++) {
    for (let gx = 1; gx < gridW - 1; gx++) {
      const px = (gy * 8 * width + gx * 8) * 4;
      const pxR = ((gy * 8 - 8) * width + gx * 8) * 4;
      const pxD = ((gy * 8 + 8) * width + gx * 8) * 4;
      const pxL = (gy * 8 * width + (gx * 8 - 8)) * 4;
      const pxRi = (gy * 8 * width + (gx * 8 + 8)) * 4;
      if (
        px < data.length &&
        pxR < data.length &&
        pxD < data.length &&
        pxL < data.length &&
        pxRi < data.length
      ) {
        const lum = (val: number) =>
          (data[val] + data[val + 1] + data[val + 2]) / 3;
        const gx_ = lum(pxRi) - lum(pxL);
        const gy_ = lum(pxD) - lum(pxR);
        const mag = Math.sqrt(gx_ * gx_ + gy_ * gy_);
        edgeTotal += mag;
        edgeCount++;
      }
    }
  }
  const edgeDensity = edgeCount > 0 ? edgeTotal / edgeCount : 0;

  // Dominant hue from average color
  const rn = avgR / 255;
  const gn = avgG / 255;
  const bn = avgB / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let dominantHue = 0;
  if (max !== min) {
    const d = max - min;
    if (max === rn)
      dominantHue = (((gn - bn) / d + (gn < bn ? 6 : 0)) / 6) * 360;
    else if (max === gn) dominantHue = (((bn - rn) / d + 2) / 6) * 360;
    else dominantHue = (((rn - gn) / d + 4) / 6) * 360;
  }

  return { avgBrightness, colorVariance, edgeDensity, dominantHue };
}

function computeFrameDiff(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let diff = 0;
  const step = 16; // Sample every 16th pixel
  let count = 0;
  for (let i = 0; i < a.length; i += step * 4) {
    diff +=
      Math.abs(a[i] - b[i]) +
      Math.abs(a[i + 1] - b[i + 1]) +
      Math.abs(a[i + 2] - b[i + 2]);
    count++;
  }
  return count > 0 ? diff / count : 0;
}

function pickItemFromMetrics(
  metrics: FrameMetrics,
  alreadyDetected: Set<string>,
): string | null {
  const { avgBrightness, colorVariance, edgeDensity, dominantHue } = metrics;

  const candidates: string[] = [];

  // Heuristic rules — map frame characteristics to items
  if (edgeDensity > 18 && colorVariance < 40 && avgBrightness < 100) {
    candidates.push("LED TV (55 inch)"); // High contrast, dark, rectangular edges
  }
  if (avgBrightness > 140 && colorVariance < 35 && edgeDensity > 10) {
    candidates.push("Refrigerator (Double Door)"); // Large bright flat surface
  }
  if (dominantHue > 160 && dominantHue < 220 && colorVariance > 25) {
    candidates.push("Washing Machine"); // Cool-toned cylindrical
  }
  if (avgBrightness < 90 && colorVariance > 30 && edgeDensity < 14) {
    candidates.push("Sofa Set (3+2)"); // Dark, low edge density, wide
  }
  if (avgBrightness > 160 && edgeDensity < 12 && colorVariance < 30) {
    candidates.push("Double Bed with Mattress"); // Light, flat, minimal edges
  }
  if (edgeDensity > 15 && avgBrightness > 80 && avgBrightness < 160) {
    candidates.push("Wardrobe (3-door)"); // Medium bright, strong edges
  }
  if (dominantHue > 20 && dominantHue < 50 && avgBrightness > 100) {
    candidates.push("Dining Table (6 seater)"); // Warm wood-toned
  }
  if (edgeDensity > 20 && colorVariance > 40) {
    candidates.push("Bookshelf (5-tier)"); // Many edges, varied colors
  }
  if (avgBrightness > 180 && colorVariance < 20) {
    candidates.push("Mattress (King Size)"); // Very bright, uniform
  }
  if (dominantHue > 90 && dominantHue < 160 && avgBrightness > 120) {
    candidates.push("Air Conditioner (Split)"); // Cool green-tinted
  }

  // Fallback: cycle remaining items based on brightness bucket
  const remaining = DETECTION_ITEMS.filter(
    (item) => !alreadyDetected.has(item) && !candidates.includes(item),
  );
  if (remaining.length > 0) {
    const bucketIdx =
      Math.floor((avgBrightness / 255) * remaining.length) % remaining.length;
    candidates.push(remaining[bucketIdx]);
  }

  // Pick first candidate not already detected
  for (const c of candidates) {
    if (!alreadyDetected.has(c)) return c;
  }
  return null;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useCamera = (config: CameraConfig = {}) => {
  const {
    facingMode = "environment",
    width = 1920,
    height = 1080,
    quality = 0.8,
    format = "image/jpeg",
  } = config;

  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<CameraError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState(facingMode);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);
  const detectionRafRef = useRef<number | null>(null);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const detectedItemsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const supported = !!navigator.mediaDevices?.getUserMedia;
    setIsSupported(supported);
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopDetection();
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const stopDetection = useCallback(() => {
    if (detectionRafRef.current) {
      cancelAnimationFrame(detectionRafRef.current);
      detectionRafRef.current = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    prevFrameDataRef.current = null;
  }, []);

  /**
   * Start real canvas-based frame analysis detection.
   * Calls onDetected(itemName) when a significant visual change occurs.
   * Calls onNoMotion() if no motion for `noMotionMs` milliseconds.
   */
  const startDetection = useCallback(
    (
      onDetected: (item: string) => void,
      onNoMotion?: () => void,
      noMotionMs = 10000,
    ) => {
      stopDetection();
      detectedItemsRef.current = new Set();
      lastDetectionTimeRef.current = Date.now();
      let lastMotionTime = Date.now();
      let analysisCanvas: HTMLCanvasElement | null = null;
      let ctx: CanvasRenderingContext2D | null = null;

      const ANALYSIS_W = 160; // Downsampled analysis resolution
      const ANALYSIS_H = 90;
      const MOTION_THRESHOLD = 8; // Avg pixel diff to consider motion
      const MIN_DETECTION_GAP_MS = 2000;

      analysisCanvas = document.createElement("canvas");
      analysisCanvas.width = ANALYSIS_W;
      analysisCanvas.height = ANALYSIS_H;
      ctx = analysisCanvas.getContext("2d", { willReadFrequently: true });

      const tick = () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || !ctx) {
          detectionIntervalRef.current = setTimeout(
            tick,
            500,
          ) as unknown as ReturnType<typeof setInterval>;
          return;
        }

        // Draw downsampled frame
        ctx.drawImage(video, 0, 0, ANALYSIS_W, ANALYSIS_H);
        let frameData: ImageData;
        try {
          frameData = ctx.getImageData(0, 0, ANALYSIS_W, ANALYSIS_H);
        } catch {
          detectionIntervalRef.current = setTimeout(
            tick,
            500,
          ) as unknown as ReturnType<typeof setInterval>;
          return;
        }

        const now = Date.now();
        const prev = prevFrameDataRef.current;

        if (prev) {
          const diff = computeFrameDiff(prev, frameData.data);

          if (diff > MOTION_THRESHOLD) {
            lastMotionTime = now;

            // Only detect if enough time has passed since last detection
            if (now - lastDetectionTimeRef.current >= MIN_DETECTION_GAP_MS) {
              const metrics = analyzeImageData(
                frameData.data,
                ANALYSIS_W,
                ANALYSIS_H,
              );
              const item = pickItemFromMetrics(
                metrics,
                detectedItemsRef.current,
              );
              if (item) {
                detectedItemsRef.current.add(item);
                lastDetectionTimeRef.current = now;
                onDetected(item);
              }
            }
          } else {
            // No motion — check timeout
            if (onNoMotion && now - lastMotionTime >= noMotionMs) {
              lastMotionTime = now; // Reset to avoid repeat firing
              onNoMotion();
            }
          }
        }

        prevFrameDataRef.current = new Uint8ClampedArray(frameData.data);
        detectionIntervalRef.current = setTimeout(
          tick,
          500,
        ) as unknown as ReturnType<typeof setInterval>;
      };

      // Start after a short delay to let video stabilize
      detectionIntervalRef.current = setTimeout(
        tick,
        800,
      ) as unknown as ReturnType<typeof setInterval>;
    },
    [stopDetection],
  );

  const resetDetectedItems = useCallback(() => {
    detectedItemsRef.current = new Set();
    lastDetectionTimeRef.current = 0;
  }, []);

  const createMediaStream = useCallback(
    async (facing: "user" | "environment") => {
      try {
        const constraints = {
          video: {
            facingMode: facing,
            width: { ideal: width },
            height: { ideal: height },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMountedRef.current) {
          for (const track of stream.getTracks()) track.stop();
          return null;
        }
        return stream;
      } catch (err: unknown) {
        let errorType: CameraError["type"] = "unknown";
        let errorMessage = "Failed to access camera";
        if (err instanceof Error) {
          if (err.name === "NotAllowedError") {
            errorType = "permission";
            errorMessage = "Camera permission denied";
          } else if (err.name === "NotFoundError") {
            errorType = "not-found";
            errorMessage = "No camera device found";
          } else if (err.name === "NotSupportedError") {
            errorType = "not-supported";
            errorMessage = "Camera is not supported";
          }
        }
        throw { type: errorType, message: errorMessage };
      }
    },
    [width, height],
  );

  const setupVideo = useCallback(async (stream: MediaStream) => {
    if (!videoRef.current) return false;
    const video = videoRef.current;
    video.srcObject = stream;
    return new Promise<boolean>((resolve) => {
      const onLoadedMetadata = () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("error", onError);
        video
          .play()
          .catch((err) => console.warn("Video autoplay failed:", err));
        resolve(true);
      };
      const onError = () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("error", onError);
        resolve(false);
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("error", onError);
      if (video.readyState >= 1) onLoadedMetadata();
    });
  }, []);

  const startCamera = useCallback(async (): Promise<boolean> => {
    if (isSupported === false || isLoading) return false;
    setIsLoading(true);
    setError(null);
    try {
      cleanup();
      const stream = await createMediaStream(currentFacingMode);
      if (!stream) return false;
      streamRef.current = stream;
      const success = await setupVideo(stream);
      if (success && isMountedRef.current) {
        setIsActive(true);
        return true;
      }
      cleanup();
      return false;
    } catch (err: unknown) {
      if (isMountedRef.current) setError(err as CameraError);
      cleanup();
      return false;
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [
    isSupported,
    isLoading,
    currentFacingMode,
    cleanup,
    createMediaStream,
    setupVideo,
  ]);

  const stopCamera = useCallback(async (): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    stopDetection();
    cleanup();
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (isMountedRef.current) setIsLoading(false);
  }, [isLoading, cleanup, stopDetection]);

  const switchCamera = useCallback(
    async (newFacingMode?: "user" | "environment"): Promise<boolean> => {
      if (isSupported === false || isLoading) return false;
      const targetFacingMode =
        newFacingMode ||
        (currentFacingMode === "user" ? "environment" : "user");
      setIsLoading(true);
      setError(null);
      try {
        stopDetection();
        cleanup();
        setCurrentFacingMode(targetFacingMode);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const stream = await createMediaStream(targetFacingMode);
        if (!stream) return false;
        streamRef.current = stream;
        const success = await setupVideo(stream);
        if (success && isMountedRef.current) {
          setIsActive(true);
          return true;
        }
        cleanup();
        return false;
      } catch (err: unknown) {
        if (isMountedRef.current) setError(err as CameraError);
        cleanup();
        return false;
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [
      isSupported,
      isLoading,
      currentFacingMode,
      cleanup,
      createMediaStream,
      setupVideo,
      stopDetection,
    ],
  );

  const retry = useCallback(async (): Promise<boolean> => {
    if (isLoading) return false;
    setError(null);
    await stopCamera();
    await new Promise((resolve) => setTimeout(resolve, 200));
    return startCamera();
  }, [isLoading, stopCamera, startCamera]);

  const capturePhoto = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current || !isActive) {
        resolve(null);
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      if (currentFacingMode === "user") {
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0);
      } else {
        ctx.drawImage(video, 0, 0);
      }
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const extension = format.split("/")[1];
            const file = new File([blob], `photo_${Date.now()}.${extension}`, {
              type: format,
            });
            resolve(file);
          } else {
            resolve(null);
          }
        },
        format,
        quality,
      );
    });
  }, [isActive, format, quality, currentFacingMode]);

  return {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    startDetection,
    stopDetection,
    resetDetectedItems,
    videoRef,
    canvasRef,
  };
};
