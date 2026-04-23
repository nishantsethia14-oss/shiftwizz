import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";
import { type Backend, type ExternalBlob, createActor } from "../backend";

const CANISTER_ID = (import.meta.env.VITE_CANISTER_ID_BACKEND as string) ?? "";

const noopDownload = async (_bytes: Uint8Array): Promise<ExternalBlob> => {
  return { directURL: "" } as ExternalBlob;
};

const noopUpload = async (): Promise<Uint8Array<ArrayBuffer>> => {
  return new Uint8Array(0) as Uint8Array<ArrayBuffer>;
};

export function useActor(): { actor: Backend | null; isFetching: boolean } {
  const { identity } = useInternetIdentity();

  const actor = useMemo(() => {
    if (!CANISTER_ID) return null;
    try {
      return createActor(CANISTER_ID, noopUpload, noopDownload, {
        agentOptions: identity ? { identity } : undefined,
      });
    } catch {
      return null;
    }
  }, [identity]);

  return { actor, isFetching: false };
}
