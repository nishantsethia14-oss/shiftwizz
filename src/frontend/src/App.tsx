import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useCamera } from "./camera/useCamera";

// ── Constants ────────────────────────────────────────────────────────────────
const PHONE = "7353226655";
const WA_BASE = "https://wa.me/917353226655";
const WA_QUOTE_URL = `${WA_BASE}?text=${encodeURIComponent("Hi ShiftingWizz! I need a moving quote. Please share the best price.")}`;

function buildWAItemsUrl(items: string[]) {
  return `${WA_BASE}?text=${encodeURIComponent(
    `Hi ShiftingWizz! I scanned my items and need a moving quote.\n\nItems detected:\n${items.map((i) => `• ${i}`).join("\n")}\n\nPlease share the best price for shifting across India.`,
  )}`;
}

// ── Simulated items ──────────────────────────────────────────────────────────
const SIMULATED_ITEMS = [
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

const ITEM_EMOJIS: Record<string, string> = {
  "LED TV (55 inch)": "📺",
  "Refrigerator (Double Door)": "🧊",
  "Washing Machine": "🫧",
  "Sofa Set (3+2)": "🛋️",
  "Double Bed with Mattress": "🛏️",
  "Wardrobe (3-door)": "🚪",
  "Dining Table (6 seater)": "🍽️",
  "Microwave Oven": "📡",
  "Air Conditioner (Split)": "❄️",
  "Geyser / Water Heater": "🔥",
  "Mixer & Grinder": "🥣",
  "Laptop / Computer": "💻",
  "Desktop + Monitor": "🖥️",
  "Bookshelf (5-tier)": "📚",
  "Curtains & Rods": "🪟",
  "Mattress (King Size)": "🛌",
  "Ceiling Fan": "🌀",
  "Water Purifier (RO)": "💧",
  "Exercise Cycle / Treadmill": "🚴",
  "Study Table with Chair": "🪑",
  "Shoe Rack": "👟",
  "Kitchen Chimney": "🍳",
};

// ── Logo SVG Component ────────────────────────────────────────────────────────
function ShiftingWizzLogo({
  iconOnly = false,
  size = 38,
}: { iconOnly?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <rect width="38" height="38" rx="10" fill="#25D366" />
        <rect x="5" y="18" width="18" height="11" rx="2" fill="white" />
        <rect x="20" y="21" width="12" height="8" rx="2" fill="white" />
        <rect x="22" y="22.5" width="7" height="4" rx="1" fill="#25D366" />
        <circle cx="10" cy="30.5" r="2.5" fill="#0B0F12" />
        <circle cx="10" cy="30.5" r="1" fill="white" />
        <circle cx="25" cy="30.5" r="2.5" fill="#0B0F12" />
        <circle cx="25" cy="30.5" r="1" fill="white" />
        <ellipse
          cx="14"
          cy="18.5"
          rx="5.5"
          ry="1.5"
          fill="white"
          opacity="0.95"
        />
        <polygon points="14,7.5 9.5,18.5 18.5,18.5" fill="white" />
        <rect
          x="10.5"
          y="15.5"
          width="7"
          height="1.5"
          rx="0.5"
          fill="#25D366"
        />
        <path
          d="M21.5 11L22 9.5L22.5 11L24 11.5L22.5 12L22 13.5L21.5 12L20 11.5Z"
          fill="#FFD700"
        />
        <path
          d="M26 8L26.3 7.2L26.6 8L27.4 8.3L26.6 8.6L26.3 9.4L26 8.6L25.2 8.3Z"
          fill="#FFD700"
          opacity="0.8"
        />
      </svg>
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-[17px] tracking-tight font-display">
            <span className="text-white">Shifting</span>
            <span className="text-green-brand">Wizz</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ── Shared pill badge ────────────────────────────────────────────────────────
function PillBadge({
  children,
  variant = "green",
}: { children: React.ReactNode; variant?: "green" | "red" | "blue" }) {
  const styles = {
    green: "bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366]",
    red: "bg-red-500/10 border border-red-500/25 text-red-400",
    blue: "bg-blue-500/10 border border-blue-500/25 text-blue-400",
  };
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  center = true,
}: {
  badge?: React.ReactNode;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 reveal ${center ? "text-center" : ""}`}>
      {badge && <div className="mb-5">{badge}</div>}
      <h2
        className="text-3xl md:text-4xl font-bold text-white mb-4 font-display leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}{" "}
        {highlight && <span className="text-green-brand">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-[#8A96A0] text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.08 },
    );
    const els = document.querySelectorAll(".reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// ── Brand Overlay Badge ───────────────────────────────────────────────────────
function BrandBadge({
  position = "bottom-right",
}: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const posMap = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  };
  return (
    <div
      className={`absolute ${posMap[position]} glass-dark rounded-lg px-2.5 py-1.5 border border-[#25D366]/30 z-10`}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-[#25D366] text-xs font-bold tracking-wide">
          ShiftingWizz
        </span>
      </div>
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: [string, string][] = [
    ["Home", "#home"],
    ["Services", "#features"],
    ["How It Works", "#how-it-works"],
    ["Reviews", "#testimonials"],
    ["Book", "#lead-form"],
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B0F12]/96 border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        {/* Logo + company name + tagline */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <span className="hidden sm:flex">
            <ShiftingWizzLogo iconOnly={true} size={38} />
          </span>
          <span className="flex sm:hidden">
            <ShiftingWizzLogo iconOnly={true} size={34} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[17px] tracking-tight font-display">
              <span className="text-white">Shifting</span>
              <span className="text-[#25D366]">Wizz</span>
            </span>
            <span className="text-[10px] text-[#6B7A84] font-medium tracking-wide mt-0.5 hidden sm:block">
              India's Most Trusted Movers
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              data-ocid="nav.link"
              className="text-sm text-[#8A96A0] hover:text-white transition-colors duration-200 font-medium tracking-wide"
            >
              {label}
            </a>
          ))}
          <Link
            to="/blog"
            data-ocid="nav.link"
            className="text-sm text-[#8A96A0] hover:text-white transition-colors duration-200 font-medium tracking-wide"
          >
            Blog
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:+91${PHONE}`}
            data-ads-conversion="true"
            data-ocid="nav.primary_button"
            className="flex items-center gap-2 text-[#25D366] border border-[#25D366]/30 hover:border-[#25D366]/60 hover:bg-[#25D366]/8 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            {PHONE}
          </a>
          <a
            href={WA_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ads-conversion="true"
            data-ocid="nav.secondary_button"
            className="flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-green-glow"
          >
            💬 Get Quote
          </a>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B0F12]/98 backdrop-blur-xl border-t border-white/5 px-6 py-5 flex flex-col gap-4">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
              className={`transition-colors text-base font-medium ${href.startsWith("/") ? "text-[#25D366]" : "text-[#8A96A0] hover:text-white"}`}
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
            <a
              href={`tel:+91${PHONE}`}
              data-ads-conversion="true"
              data-ocid="nav.primary_button"
              className="flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] font-bold py-3 rounded-full text-sm"
            >
              📞 Call {PHONE}
            </a>
            <a
              href={WA_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ads-conversion="true"
              data-ocid="nav.secondary_button"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-full text-sm shadow-green-glow"
            >
              💬 WhatsApp Quote
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const badges = [
    { icon: "⭐", label: "4.9 / 5 Rating" },
    { icon: "😊", label: "500+ Happy Clients" },
    { icon: "✅", label: "Zero Hidden Charges" },
    { icon: "🛡️", label: "Damage Protected" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0F12] pt-[68px]"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 65% 45%, rgba(37,211,102,0.07) 0%, transparent 65%)",
          }}
          className="absolute inset-0"
        />
        <div
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 15% 80%, rgba(37,211,102,0.04) 0%, transparent 60%)",
          }}
          className="absolute inset-0"
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 w-full grid md:grid-cols-2 gap-14 items-center relative z-10">
        {/* Left content */}
        <div>
          <div className="mb-6">
            <PillBadge variant="green">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse inline-block" />
              ShiftingWizz — India's Most Trusted Movers
            </PillBadge>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white leading-[1.08] mb-5 font-display"
            style={{ letterSpacing: "-0.03em" }}
          >
            Safe, Damage-Free{" "}
            <span className="text-gradient-green">Shifting</span> Across India
          </h1>

          <p className="text-lg sm:text-xl text-[#8A96A0] mb-3 leading-relaxed">
            Tired of fake, overcharging local movers?
          </p>
          <p className="text-base text-[#8A96A0] mb-9 leading-relaxed">
            <strong className="text-white font-semibold">ShiftingWizz</strong>{" "}
            delivers{" "}
            <strong className="text-white font-semibold">
              zero hidden charges
            </strong>
            ,{" "}
            <strong className="text-white font-semibold">
              damage-free guarantee
            </strong>{" "}
            and real-time WhatsApp updates. Fixed price. No surprises.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href={`tel:+91${PHONE}`}
              data-ads-conversion="true"
              data-ocid="hero.primary_button"
              className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:opacity-90 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-green-glow hover:shadow-green-glow-lg"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Call Now — {PHONE}
            </a>
            <a
              href={WA_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ads-conversion="true"
              data-ocid="hero.secondary_button"
              className="flex items-center justify-center gap-2.5 glass border-white/10 hover:border-[#25D366]/30 text-white font-bold px-7 py-4 rounded-full text-base transition-all duration-200"
            >
              💬 WhatsApp Instant Quote
            </a>
          </div>

          {/* Quick quote prompt */}
          <div className="glass-green rounded-2xl px-5 py-4 flex items-center gap-4 mb-7">
            <div className="text-2xl flex-shrink-0">🎯</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">
                Free Quote in 2 Minutes — No Obligations
              </p>
              <p className="text-[#8A96A0] text-xs mt-0.5">
                Fixed price guaranteed · Respond within 1 hour
              </p>
            </div>
            <a
              href="#lead-form"
              data-ocid="hero.cta_button"
              data-ads-conversion="true"
              className="flex-shrink-0 bg-[#25D366] hover:opacity-90 text-white font-bold px-4 py-2 rounded-full text-sm transition-opacity shadow-green-glow"
            >
              Get Quote →
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 glass rounded-xl px-3 py-3.5 text-center"
              >
                <span className="text-xl">{b.icon}</span>
                <span className="text-xs text-[#8A96A0] font-medium leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero image */}
        <div className="relative hidden md:block">
          <div
            className="rounded-3xl overflow-hidden shadow-premium-lg relative"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <img
              src="/assets/generated/shiftingwizz-hero-team.dim_900x700.jpg"
              alt="ShiftingWizz professional movers team — uniformed, trained, trusted"
              className="w-full h-[480px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F12]/50 via-transparent to-transparent" />
            <BrandBadge position="top-left" />
          </div>
          {/* Floating stats */}
          <div className="absolute -bottom-5 -left-5 glass-dark rounded-2xl px-4 py-3.5 shadow-premium">
            <div className="text-[10px] text-[#8A96A0] uppercase tracking-widest mb-1">
              Customer Rating
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
              <span className="text-white font-bold text-sm">4.9 / 5</span>
            </div>
            <div className="text-[10px] text-[#8A96A0] mt-0.5">
              500+ verified reviews
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-[#25D366] rounded-2xl px-4 py-3 shadow-green-glow-lg">
            <div className="text-white text-xs font-bold">✅ Zero Damage</div>
            <div className="text-white/80 text-xs">Guarantee on all moves</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TRUST PILLARS ─────────────────────────────────────────────────────────────
function TrustSection() {
  const pillars = [
    {
      icon: "📦",
      title: "Safe Packing",
      desc: "Industrial-grade bubble wrap, foam padding, and custom crates. Every item wrapped with the care it deserves — no shortcuts.",
      color: "border-blue-500/15 hover:border-blue-500/35",
      bg: "bg-blue-500/8",
    },
    {
      icon: "💰",
      title: "Fixed Pricing",
      desc: "The price we quote is the price you pay. No delivery-day surprises, no last-minute extras. 100% transparent billing.",
      color: "border-[#25D366]/15 hover:border-[#25D366]/35",
      bg: "bg-[#25D366]/8",
    },
    {
      icon: "👷",
      title: "Expert Team",
      desc: "Background-verified, uniformed, trained professionals on every move — not random day workers. Name-tagged and accountable.",
      color: "border-purple-500/15 hover:border-purple-500/35",
      bg: "bg-purple-500/8",
    },
  ];

  return (
    <section className="py-20 px-5 sm:px-8 bg-[#0F1419] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              data-ocid={`trust.item.${i + 1}`}
              className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-7 border ${p.color} transition-all duration-300 group cursor-default`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${p.bg} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {p.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-3 font-display">
                {p.title}
              </h3>
              <p className="text-[#8A96A0] text-[15px] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SCAN SECTION ──────────────────────────────────────────────────────────────
type ScanState = "idle" | "starting" | "live" | "done";
type ItemDecision = "pending" | "confirmed" | "skipped";

interface DetectedItemCard {
  name: string;
  decision: ItemDecision;
  visible: boolean;
}

function ItemCard({
  item,
  onConfirm,
  onSkip,
  index,
}: {
  item: DetectedItemCard;
  onConfirm: () => void;
  onSkip: () => void;
  index: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);
  if (item.decision !== "pending") return null;
  return (
    <div
      className={`transition-all duration-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
      data-ocid={`scan.item.${index + 1}`}
    >
      <div className="glass rounded-xl p-3.5 mb-2.5 flex items-center gap-3">
        <span className="text-2xl">{ITEM_EMOJIS[item.name] ?? "📦"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {item.name}
          </p>
          <p className="text-[#8A96A0] text-xs">Detected in frame</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onConfirm}
            data-ocid={`scan.confirm_button.${index + 1}`}
            className="bg-[#25D366] text-white rounded-full px-4 py-1.5 text-sm font-bold hover:opacity-90 transition-opacity"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={onSkip}
            data-ocid={`scan.delete_button.${index + 1}`}
            className="glass border-white/10 hover:border-red-400/40 hover:text-red-400 text-[#8A96A0] rounded-full px-4 py-1.5 text-sm transition-all"
          >
            ✗
          </button>
        </div>
      </div>
    </div>
  );
}

function ScanSection() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [cards, setCards] = useState<DetectedItemCard[]>([]);
  const [cameraFailed, setCameraFailed] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [noMotionHint, setNoMotionHint] = useState(false);
  const [manualItems, setManualItems] = useState<
    { id: number; name: string }[]
  >([]);
  const manualIdRef = useRef(0);
  const [manualInput, setManualInput] = useState("");
  const manualInputRef = useRef<HTMLInputElement>(null);
  // Simulation fallback state
  const simIdxRef = useRef(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    isActive,
    isLoading,
    startCamera,
    stopCamera,
    startDetection,
    stopDetection,
    resetDetectedItems,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", quality: 0.9 });

  const confirmedItems = cards
    .filter((c) => c.decision === "confirmed")
    .map((c) => c.name);
  const allItems = [...confirmedItems, ...manualItems.map((m) => m.name)];

  function triggerItemDetected(name: string) {
    setCards((prev) => {
      if (prev.some((c) => c.name === name)) return prev;
      return [...prev, { name, decision: "pending", visible: true }];
    });
    setFlashActive(true);
    setNoMotionHint(false);
    setTimeout(() => setFlashActive(false), 600);
  }

  function startSimulationFallback() {
    // Silent simulation mode when camera is denied
    simIdxRef.current = 0;
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    simIntervalRef.current = setInterval(() => {
      const items = SIMULATED_ITEMS;
      if (simIdxRef.current >= items.length) {
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        return;
      }
      triggerItemDetected(items[simIdxRef.current]);
      simIdxRef.current++;
    }, 2200);
  }

  async function handleStartScan() {
    setScanState("starting");
    setCameraFailed(false);
    setCards([]);
    setNoMotionHint(false);
    setManualItems([]);
    setManualInput("");
    setFlashActive(false);
    simIdxRef.current = 0;
    resetDetectedItems();

    const ok = await startCamera();
    setScanState("live");

    if (!ok) {
      // Camera denied — silent simulation fallback
      setCameraFailed(true);
      startSimulationFallback();
    } else {
      // Real camera available — start canvas frame analysis
      startDetection(
        (item) => triggerItemDetected(item),
        () => {
          // No motion for 10s — show hint
          setNoMotionHint(true);
        },
        10000,
      );
    }
  }

  function handleDecision(idx: number, decision: "confirmed" | "skipped") {
    setCards((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, decision } : c)),
    );
  }

  function handleDone() {
    stopCamera();
    stopDetection();
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setScanState("done");
  }

  function handleReset() {
    stopCamera();
    stopDetection();
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setScanState("idle");
    setCards([]);
    setCameraFailed(false);
    setNoMotionHint(false);
    setManualItems([]);
    setManualInput("");
    setFlashActive(false);
    simIdxRef.current = 0;
    resetDetectedItems();
  }

  // Auto-complete after 15s when in live state
  const confirmedCountRef = useRef(confirmedItems.length);
  confirmedCountRef.current = confirmedItems.length;
  const scanStateRef = useRef(scanState);
  scanStateRef.current = scanState;

  useEffect(() => {
    if (scanState !== "live") return;
    const timer = setTimeout(() => {
      if (scanStateRef.current === "live" && confirmedCountRef.current > 0) {
        stopCamera();
        stopDetection();
        if (simIntervalRef.current) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
        }
        setScanState("done");
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [scanState, stopCamera, stopDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  function handleAddManualItem() {
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    setManualItems((prev) => [
      ...prev,
      { id: ++manualIdRef.current, name: trimmed },
    ]);
    setManualInput("");
    manualInputRef.current?.focus();
  }
  function handleManualKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddManualItem();
    }
  }
  function handleRemoveManualItem(itemId: number) {
    setManualItems((prev) => prev.filter((m) => m.id !== itemId));
  }

  const pendingCards = cards.filter((c) => c.decision === "pending");

  return (
    <section id="scan" className="py-24 px-5 sm:px-8 bg-[#0B0F12]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">✨ AI-Powered Inventory Scan</PillBadge>
          }
          title="Scan Your Items"
          highlight="Live — 30 Seconds"
          subtitle="Point your camera at any room. ShiftingWizz AI detects your household items in real-time. Confirm or skip each one, then get an instant WhatsApp quote."
        />

        <div
          className="glass rounded-3xl p-6 md:p-8 reveal reveal-delay-1"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* IDLE */}
          {scanState === "idle" && (
            <div className="text-center py-10">
              <div
                className="w-20 h-20 rounded-full glass-green flex items-center justify-center mx-auto mb-6"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <span className="text-4xl">📷</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                AI Item Detector Ready
              </h3>
              <p className="text-[#8A96A0] mb-6 text-[15px] max-w-sm mx-auto">
                Live camera detects items as you scan your home. Confirm each
                item to build your moving list.
              </p>
              <button
                type="button"
                onClick={handleStartScan}
                data-ocid="scan.primary_button"
                className="inline-flex items-center gap-2.5 bg-[#25D366] hover:opacity-90 text-white font-bold px-8 py-3.5 rounded-full transition-opacity shadow-green-glow text-base"
              >
                🎥 Start Live Scan
              </button>
            </div>
          )}

          {/* STARTING */}
          {scanState === "starting" && (
            <div className="text-center py-14" data-ocid="scan.loading_state">
              <div className="w-12 h-12 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#8A96A0] text-sm">
                Starting ShiftingWizz scanner…
              </p>
            </div>
          )}

          {/* LIVE */}
          {scanState === "live" && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Camera panel */}
              <div className="lg:w-1/2 flex flex-col">
                <div
                  className={`relative rounded-2xl overflow-hidden bg-[#080C0E] flex-1 transition-all duration-300 ${
                    flashActive
                      ? "ring-4 ring-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.5)]"
                      : "ring-1 ring-white/5"
                  }`}
                  style={{ minHeight: "320px", height: "420px" }}
                >
                  {cameraFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="relative flex items-center justify-center mb-6">
                        <div
                          className="w-24 h-24 rounded-full border border-[#25D366]/20 absolute animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                        <div
                          className="w-16 h-16 rounded-full border border-[#25D366]/30 absolute animate-ping"
                          style={{
                            animationDuration: "2s",
                            animationDelay: "0.5s",
                          }}
                        />
                        <div className="w-5 h-5 rounded-full bg-[#25D366]/60 animate-pulse" />
                      </div>
                      <p className="text-[#8A96A0] text-sm tracking-widest uppercase mb-4">
                        ShiftingWizz Scanning…
                      </p>
                      <label
                        className="cursor-pointer text-[#8A96A0] hover:text-white text-xs border border-white/10 hover:border-white/25 px-4 py-2 rounded-full inline-block transition-colors"
                        data-ocid="scan.upload_button"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {}}
                        />
                        📁 Upload Photo Instead
                      </label>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                        autoPlay
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-10 h-10 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {isActive && (
                        <>
                          <div className="absolute top-3 left-3">
                            <div className="flex items-center gap-2 glass-dark rounded-full px-3 py-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                              <span className="text-[#25D366] text-xs font-semibold">
                                Scanning for items…
                              </span>
                            </div>
                          </div>
                          <div
                            className="absolute left-2 right-2 h-0.5 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent 0%, #25D366 30%, #25D366 70%, transparent 100%)",
                              boxShadow: "0 0 12px 3px rgba(37,211,102,0.5)",
                              animation: "scanLine 2s ease-in-out infinite",
                            }}
                          />
                          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#25D366] rounded-tl-md opacity-80" />
                          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#25D366] rounded-tr-md opacity-80" />
                          <div className="absolute bottom-14 left-2 w-6 h-6 border-b-2 border-l-2 border-[#25D366] rounded-bl-md opacity-80" />
                          <div className="absolute bottom-14 right-2 w-6 h-6 border-b-2 border-r-2 border-[#25D366] rounded-br-md opacity-80" />
                          {confirmedItems.length > 0 && (
                            <div className="absolute top-3 right-3 bg-[#25D366] rounded-full w-7 h-7 flex items-center justify-center text-white text-xs font-bold shadow-green-glow">
                              {confirmedItems.length}
                            </div>
                          )}
                          {noMotionHint && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap glass-dark rounded-full px-4 py-2 text-xs text-[#8A96A0] border border-white/10">
                              👋 Move an item closer to the camera
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleDone}
                  data-ocid="scan.secondary_button"
                  className="mt-4 glass border-white/10 hover:border-white/20 text-[#8A96A0] hover:text-white px-6 py-2.5 rounded-full text-sm transition-all self-center"
                >
                  ✅ Done Scanning
                </button>
              </div>

              {/* Items panel */}
              <div
                className="lg:w-1/2 flex flex-col"
                style={{ height: "420px" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-sm">
                    Detected Items
                  </h4>
                  {confirmedItems.length > 0 && (
                    <span className="glass-green text-[#25D366] rounded-full px-3 py-0.5 text-xs font-bold">
                      {confirmedItems.length} confirmed
                    </span>
                  )}
                </div>
                <div
                  className="flex-1 overflow-y-auto pr-1"
                  style={{ maxHeight: "300px" }}
                >
                  {pendingCards.length === 0 && cards.length === 0 && (
                    <div
                      className="flex flex-col items-center justify-center h-32 text-center"
                      data-ocid="scan.empty_state"
                    >
                      <div className="w-10 h-10 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-[#8A96A0] text-sm">
                        Scanning your room…
                      </p>
                    </div>
                  )}
                  {cards.map((card, idx) => (
                    <ItemCard
                      key={card.name}
                      item={card}
                      index={idx}
                      onConfirm={() => handleDecision(idx, "confirmed")}
                      onSkip={() => handleDecision(idx, "skipped")}
                    />
                  ))}
                </div>
                {confirmedItems.length > 0 && (
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <p className="text-[#8A96A0] text-xs mb-2 font-medium uppercase tracking-wider">
                      Added to list
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {confirmedItems.map((name) => (
                        <span
                          key={name}
                          className="glass-green text-[#25D366] rounded-full px-2.5 py-0.5 text-xs flex items-center gap-1"
                        >
                          {ITEM_EMOJIS[name] ?? "📦"} {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DONE */}
          {scanState === "done" && (
            <div data-ocid="scan.success_state">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full glass-green flex items-center justify-center">
                  <span className="text-[#25D366] text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Your ShiftingWizz Moving List
                  </h3>
                  <p className="text-[#8A96A0] text-sm">
                    {allItems.length} item{allItems.length !== 1 ? "s" : ""}{" "}
                    confirmed
                  </p>
                </div>
              </div>
              {confirmedItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {confirmedItems.map((name) => (
                    <span
                      key={name}
                      className="glass rounded-xl px-4 py-2 text-sm flex items-center gap-2 text-white border-white/5"
                    >
                      <span>{ITEM_EMOJIS[name] ?? "📦"}</span>
                      <span>{name}</span>
                    </span>
                  ))}
                </div>
              )}
              {manualItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {manualItems.map(({ id, name }, idx) => (
                    <span
                      key={id}
                      className="glass-green text-[#25D366] rounded-xl px-4 py-2 text-sm flex items-center gap-2"
                    >
                      <span>📦</span>
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveManualItem(id)}
                        className="text-[#8A96A0] hover:text-red-400 transition-colors ml-1"
                        aria-label={`Remove ${name}`}
                        data-ocid={`scan.delete_button.${confirmedItems.length + idx + 1}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {allItems.length === 0 && (
                <div
                  className="text-center py-6 mb-4"
                  data-ocid="scan.empty_state"
                >
                  <p className="text-[#8A96A0] text-sm">
                    No items confirmed. Add items below or scan again.
                  </p>
                </div>
              )}
              <div
                className="glass rounded-xl p-4 mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[#8A96A0] text-xs font-medium uppercase tracking-wider mb-3">
                  ➕ Add items the camera missed
                </p>
                <div className="flex gap-2">
                  <input
                    ref={manualInputRef}
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={handleManualKeyDown}
                    placeholder="e.g. Piano, Study Table, AC…"
                    className="flex-1 bg-transparent border border-white/10 focus:border-[#25D366]/50 focus:outline-none text-white placeholder-[#4A5568] text-sm rounded-lg px-4 py-2.5 transition-colors"
                    data-ocid="scan.input"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualItem}
                    disabled={!manualInput.trim()}
                    className="bg-[#25D366] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-opacity shrink-0"
                    data-ocid="scan.primary_button"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    window.open(buildWAItemsUrl(allItems), "_blank")
                  }
                  disabled={allItems.length === 0}
                  className="flex-1 bg-[#25D366] hover:opacity-90 disabled:opacity-40 text-white font-bold py-3.5 rounded-full transition-opacity shadow-green-glow"
                  data-ocid="scan.submit_button"
                  data-ads-conversion="true"
                >
                  💬 Get Instant Quote on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="glass border-white/10 hover:border-white/20 text-[#8A96A0] hover:text-white px-6 py-3 rounded-full transition-all text-sm"
                  data-ocid="scan.secondary_button"
                >
                  🔄 Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── PROOF SECTION ─────────────────────────────────────────────────────────────
function ProofSection() {
  const proofs = [
    {
      img: "/assets/generated/shiftingwizz-proof-packing.dim_800x600.jpg",
      caption: "Professional Packing",
      detail: "Premium bubble wrap & custom crates",
    },
    {
      img: "/assets/generated/shiftingwizz-proof-loading.dim_800x600.jpg",
      caption: "Safe Loading Process",
      detail: "Padded handling for all furniture",
    },
    {
      img: "/assets/generated/shiftingwizz-fleet-branded.dim_900x600.jpg",
      caption: "Branded Fleet Truck",
      detail: "GPS-tracked, insured fleet vehicles",
    },
    {
      img: "/assets/generated/shiftingwizz-team-branded.dim_900x700.jpg",
      caption: "Uniformed Expert Team",
      detail: "Background-verified professionals",
    },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0F1419]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">📸 Real Work, Real Proof</PillBadge>
          }
          title="See Our Work"
          highlight="in Action"
          subtitle="No staging, no filters. Real photos from real ShiftingWizz moves across India."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {proofs.map((p, i) => (
            <div
              key={p.caption}
              data-ocid={`proof.item.${i + 1}`}
              className={`reveal reveal-delay-${i + 1} rounded-2xl overflow-hidden group cursor-default`}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.img}
                  alt={`ShiftingWizz – ${p.caption}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <BrandBadge position="bottom-right" />
              </div>
              <div className="glass px-4 py-4">
                <h3 className="text-white font-semibold text-sm">
                  {p.caption}
                </h3>
                <p className="text-[#8A96A0] text-xs mt-1">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TEAM SECTION ──────────────────────────────────────────────────────────────
function TeamSection() {
  const team = [
    {
      name: "Ravi Kumar",
      role: "Lead Packer",
      years: "8 yrs experience",
      initials: "RK",
      gradient: "from-[#25D366] to-[#1da84f]",
      ring: "ring-[#25D366]/30",
    },
    {
      name: "Priya Sharma",
      role: "Customer Relations",
      years: "5 yrs experience",
      initials: "PS",
      gradient: "from-[#22d3ee] to-[#1da84f]",
      ring: "ring-[#22d3ee]/30",
    },
    {
      name: "Arjun Singh",
      role: "Logistics Head",
      years: "10 yrs experience",
      initials: "AS",
      gradient: "from-[#2dd4bf] to-[#0891b2]",
      ring: "ring-[#2dd4bf]/30",
    },
    {
      name: "Deepa Nair",
      role: "Quality Manager",
      years: "6 yrs experience",
      initials: "DN",
      gradient: "from-[#34d399] to-[#059669]",
      ring: "ring-[#34d399]/30",
    },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0B0F12]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">👥 Your ShiftingWizz Team</PillBadge>
          }
          title="Meet Our"
          highlight="Expert Team"
          subtitle="Uniformed, background-verified professionals who handle your home with the care it deserves."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              data-ocid={`team.item.${i + 1}`}
              className={`reveal reveal-delay-${i + 1} glass rounded-2xl overflow-hidden group hover:border-[#25D366]/25 transition-all duration-300`}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Premium initials avatar */}
              <div className="relative h-52 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1419] to-[#0B0F12] overflow-hidden">
                {/* Subtle radial glow behind avatar */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-10`}
                />
                <div
                  className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-premium ring-4 ${member.ring} mb-3`}
                >
                  <span className="text-white font-bold text-3xl tracking-tight font-display">
                    {member.initials}
                  </span>
                </div>
                {/* ShiftingWizz brand badge */}
                <div className="relative flex items-center gap-1.5 glass-dark rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                  <span className="text-[10px] text-[#25D366] font-semibold tracking-wide uppercase">
                    ShiftingWizz
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-base">
                  {member.name}
                </h3>
                <p className="text-[#25D366] text-sm font-medium mt-0.5">
                  {member.role}
                </p>
                <p className="text-[#8A96A0] text-xs mt-1.5">{member.years}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FLEET SECTION ─────────────────────────────────────────────────────────────
function FleetSection() {
  const fleet = [
    {
      img: "/assets/generated/shiftingwizz-mini-truck.dim_800x560.jpg",
      name: "Mini Truck",
      capacity: "1 BHK / Studio",
      desc: "Fast, agile city-ready van perfect for studio and small 1BHK moves. Same-day availability.",
      tag: "1BHK / Studio",
      badges: ["GPS Tracked", "Insured", "Sanitised"],
    },
    {
      img: "/assets/generated/shiftingwizz-large-truck.dim_800x560.jpg",
      name: "Large Truck",
      capacity: "2 – 3 BHK",
      desc: "Our most popular vehicle. Handles full 2-3BHK homes with ease. Padded interior.",
      tag: "2–3 BHK",
      badges: ["GPS Tracked", "Insured", "Padded Interior"],
    },
    {
      img: "/assets/generated/shiftingwizz-container-truck.dim_800x560.jpg",
      name: "26ft Container",
      capacity: "4BHK & Offices",
      desc: "For large homes, villas, and office relocations. Sealed container for maximum protection.",
      tag: "4BHK / Office",
      badges: ["GPS Tracked", "Insured", "Sealed Container"],
    },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0F1419]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">🚛 ShiftingWizz Branded Fleet</PillBadge>
          }
          title="Our"
          highlight="ShiftingWizz Fleet"
          subtitle="GPS-tracked, clean, purpose-built vehicles for safe shifting across India."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleet.map((vehicle, i) => (
            <div
              key={vehicle.name}
              data-ocid={`fleet.item.${i + 1}`}
              className={`reveal reveal-delay-${i + 1} glass rounded-2xl overflow-hidden group hover:border-[#25D366]/25 transition-all duration-300`}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.img}
                  alt={`ShiftingWizz ${vehicle.name} – ${vehicle.capacity}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-green-glow">
                  {vehicle.tag}
                </div>
                <BrandBadge position="bottom-left" />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-1 font-display">
                  {vehicle.name}
                </h3>
                <p className="text-[#25D366] text-sm font-semibold mb-3">
                  {vehicle.capacity}
                </p>
                <p className="text-[#8A96A0] text-sm leading-relaxed mb-4">
                  {vehicle.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.badges.map((badge) => (
                    <span
                      key={badge}
                      className="glass text-[#8A96A0] border-white/5 text-xs rounded-full px-2.5 py-1"
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SCAM SECTION ──────────────────────────────────────────────────────────────
function ScamSection() {
  const scams = [
    {
      problem:
        "Hidden charges added at delivery — after your items are already loaded",
      solution:
        "ShiftingWizz locks in the price upfront. What you see is exactly what you pay.",
    },
    {
      problem:
        "No proper packing — clothes used as padding, zero bubble wrap or protection",
      solution:
        "We use industrial-grade bubble wrap, foam pads, and custom crates for every item.",
    },
    {
      problem:
        "Untrained day-workers damaging furniture with zero care or accountability",
      solution:
        "Every ShiftingWizz packer is trained, verified, and accountable by name.",
    },
    {
      problem:
        "No accountability for breakage — 'broke in transit, not our fault'",
      solution:
        "Full damage protection coverage on every move. If it breaks, we make it right.",
    },
  ];

  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0B0F12]">
      <div className="max-w-5xl mx-auto">
        <div
          className="glass rounded-3xl p-8 md:p-12 reveal"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="mb-7">
            <PillBadge variant="red">⚠️ Industry Warning — Read This</PillBadge>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-display"
            style={{ letterSpacing: "-0.02em" }}
          >
            Why 70% of India Moves{" "}
            <span className="text-red-400">Go Wrong</span>
          </h2>
          <p className="text-[#8A96A0] mb-10 max-w-2xl text-[15px] leading-relaxed">
            Fly-by-night operators plague India's moving industry. Here's what
            they do — and exactly how ShiftingWizz fixes every single issue.
          </p>
          <div className="space-y-4 mb-10">
            {scams.map((s, i) => (
              <div
                key={s.problem}
                className="grid md:grid-cols-2 gap-3"
                data-ocid={`scam.item.${i + 1}`}
              >
                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-5 py-4">
                  <span className="text-red-400 text-lg flex-shrink-0 mt-0.5">
                    ❌
                  </span>
                  <p className="text-[#8A96A0] text-sm leading-relaxed">
                    {s.problem}
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-[#25D366]/5 border border-[#25D366]/15 rounded-xl px-5 py-4">
                  <span className="text-[#25D366] text-lg flex-shrink-0 mt-0.5">
                    ✅
                  </span>
                  <p className="text-[#8A96A0] text-sm leading-relaxed">
                    {s.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p
                className="text-2xl font-bold text-white font-display"
                style={{ letterSpacing: "-0.02em" }}
              >
                ShiftingWizz was built to{" "}
                <span className="text-[#25D366]">fix all of this.</span>
              </p>
              <p className="text-[#8A96A0] mt-1.5 text-sm">
                Tech-enabled. GST-billed. Damage-protected. Always.
              </p>
            </div>
            <a
              href={WA_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ads-conversion="true"
              data-ocid="scam.primary_button"
              className="flex-shrink-0 bg-[#25D366] hover:opacity-90 text-white font-bold px-6 py-3 rounded-full transition-all shadow-green-glow whitespace-nowrap"
            >
              💬 Get a Safe Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FEATURES SECTION ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: "📦",
      title: "Safe Packing",
      desc: "Industrial bubble wrap, foam padding, custom crates. Not a single scratch on any item.",
    },
    {
      icon: "🔒",
      title: "Fixed Pricing",
      desc: "The quote we give is the final bill. No hidden add-ons, no delivery-day surprises.",
    },
    {
      icon: "👷",
      title: "Expert Team",
      desc: "Trained, certified, background-checked packers. We never hire random day labour.",
    },
    {
      icon: "⚡",
      title: "On-Time Delivery",
      desc: "Scheduled, punctual service. We respect your time and stick to the agreed moving date.",
    },
    {
      icon: "💬",
      title: "WhatsApp Updates",
      desc: "Live status updates via WhatsApp at every stage — packing, loading, delivery.",
    },
    {
      icon: "🛡️",
      title: "Damage Insurance",
      desc: "Full coverage on all valuables. If it breaks, we replace it. Transparent, fair, simple.",
    },
  ];

  return (
    <section id="features" className="py-24 px-5 sm:px-8 bg-[#0F1419]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">🏆 Why ShiftingWizz Wins</PillBadge>
          }
          title="Why Choose"
          highlight="ShiftingWizz?"
          subtitle="Built on trust, backed by technology. The way moving should always have been done."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-ocid={`features.item.${i + 1}`}
              className={`reveal reveal-delay-${(i % 3) + 1} glass rounded-2xl p-6 hover:border-[#25D366]/25 transition-all duration-300 group`}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-12 h-12 rounded-2xl glass-green flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 font-display">
                {f.title}
              </h3>
              <p className="text-[#8A96A0] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── STATS SECTION ─────────────────────────────────────────────────────────────
function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Happy Customers",
      icon: "😊",
      color: "text-[#25D366]",
    },
    {
      value: 50,
      suffix: "+",
      label: "Cities Served",
      icon: "🏙️",
      color: "text-blue-400",
    },
    {
      value: 8,
      suffix: "",
      label: "Years Experience",
      icon: "🏆",
      color: "text-yellow-400",
    },
    {
      value: 4.9,
      suffix: "★",
      label: "Average Rating",
      icon: "⭐",
      color: "text-[#25D366]",
      decimal: true,
    },
  ];

  return (
    <section ref={ref} className="py-16 px-5 sm:px-8 bg-[#0B0F12]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-ocid={`stats.item.${i + 1}`}
              className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-[#25D366]/20 transition-all duration-300 group"
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <div
                className={`stat-counter delay-${i + 1} text-3xl md:text-4xl font-extrabold font-display ${s.color} mb-1`}
              >
                {visible
                  ? (s.decimal
                      ? s.value.toFixed(1)
                      : s.value.toLocaleString("en-IN")) + s.suffix
                  : `0${s.suffix}`}
              </div>
              <div className="text-[#8A96A0] text-sm font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FEATURED IN SECTION ───────────────────────────────────────────────────────
function FeaturedInSection() {
  const media = [
    "NDTV",
    "Times of India",
    "Hindustan Times",
    "Economic Times",
    "India Today",
    "MoneyControl",
  ];

  return (
    <section className="py-14 px-5 sm:px-8 bg-[#0F1419] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-[#5A6470] text-xs font-semibold uppercase tracking-widest mb-8">
          Trusted &amp; Featured In
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {media.map((name, i) => (
            <div
              key={name}
              data-ocid={`media.item.${i + 1}`}
              className="media-badge group cursor-default"
            >
              <span className="text-[#8A96A0] group-hover:text-white transition-colors duration-200 font-semibold text-sm tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS CAROUSEL ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Meera Sharma",
      location: "Delhi, NCR",
      initials: "MS",
      color: "bg-purple-500",
      text: "Best movers I've ever used across India. Not a single item damaged — they packed my glass crockery like it was going to space. ShiftingWizz is absolutely the real deal. Completely transparent pricing.",
    },
    {
      name: "Rahul Tiwari",
      location: "Mumbai",
      initials: "RT",
      color: "bg-blue-500",
      text: "Zero damage, on time, and the price quoted was the price charged. No extra bills whatsoever. This is how all movers should operate. Will use ShiftingWizz every single time I move.",
    },
    {
      name: "Ananya Kumar",
      location: "Pune",
      initials: "AK",
      color: "bg-teal-500",
      text: "Transparent pricing is rare in this industry. ShiftingWizz gave me a fixed quote and stuck to it perfectly. The WhatsApp updates throughout the move were an incredibly reassuring touch.",
    },
    {
      name: "Vikram Bhat",
      location: "Hyderabad",
      initials: "VB",
      color: "bg-orange-500",
      text: "Professional from start to finish. The team wore branded uniforms, handled my furniture with extreme care, and finished the entire 3BHK move in under 4 hours. Jaw-dropping service.",
    },
    {
      name: "Sneha Patel",
      location: "Chennai",
      initials: "SP",
      color: "bg-pink-500",
      text: "Moving from Chennai to Hyderabad with ShiftingWizz was seamless. GPS tracking let me know exactly where my stuff was at all times. The team unpacked too — incredible service.",
    },
    {
      name: "Karthik Menon",
      location: "Bangalore",
      initials: "KM",
      color: "bg-indigo-500",
      text: "I was skeptical at first but ShiftingWizz delivered everything promised. Fixed quote, zero damage, certified team. My 2BHK office move was done in one day. Outstanding!",
    },
    {
      name: "Divya Rao",
      location: "Noida",
      initials: "DR",
      color: "bg-emerald-500",
      text: "After being cheated by another company last time, I chose ShiftingWizz carefully. What a difference. Proper packing materials, uniformed staff, and a GST bill at the end. 10/10.",
    },
    {
      name: "Aryan Gupta",
      location: "Kolkata",
      initials: "AG",
      color: "bg-yellow-600",
      text: "ShiftingWizz handled my cross-country move from Kolkata to Delhi flawlessly. Live tracking updates on WhatsApp throughout, and everything arrived perfectly intact. Truly trustworthy.",
    },
  ];

  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
    timerRef.current = interval;
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx: number) => {
    setActive(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };
  const prev = () =>
    goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  const t = testimonials[active];

  return (
    <section id="testimonials" className="py-24 px-5 sm:px-8 bg-[#0B0F12]">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          badge={
            <PillBadge variant="green">⭐ 10,000+ Happy Customers</PillBadge>
          }
          title="What Our Customers"
          highlight="Say"
          subtitle="Real moves, real reviews from across India. No fake testimonials, no filters."
        />

        <div
          className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ border: "1px solid rgba(37,211,102,0.12)" }}
          data-ocid="testimonials.panel"
        >
          {/* Green glow bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(37,211,102,0.05) 0%, transparent 70%)",
            }}
          />

          {/* Stars */}
          <div className="flex items-center gap-1 text-yellow-400 mb-5 relative z-10">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className="w-5 h-5 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 1l2.39 4.84L18 6.72l-4 3.9.94 5.5L10 13.6l-4.94 2.52.94-5.5-4-3.9 5.61-.88L10 1z" />
              </svg>
            ))}
            <span className="text-yellow-400 text-sm ml-1 font-semibold">
              5.0
            </span>
          </div>

          {/* Quote */}
          <blockquote className="text-[#D0D8E0] text-lg md:text-xl leading-relaxed italic mb-8 relative z-10 transition-all duration-500">
            &ldquo;{t.text}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-base flex-shrink-0 ring-2 ring-white/10`}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-[#8A96A0] text-sm flex items-center gap-1 mt-0.5">
                  <svg
                    className="w-3 h-3 fill-current text-[#25D366]"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M10 2C6.69 2 4 4.69 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.31-2.69-6-6-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {t.location}
                </div>
              </div>
              <div className="glass-green text-[#25D366] text-xs font-bold px-3 py-1 rounded-full ml-2">
                Verified ✓
              </div>
            </div>

            {/* Arrow controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                data-ocid="testimonials.pagination_prev"
                aria-label="Previous review"
                className="w-10 h-10 rounded-full glass border-white/10 hover:border-[#25D366]/40 flex items-center justify-center text-[#8A96A0] hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                data-ocid="testimonials.pagination_next"
                aria-label="Next review"
                className="w-10 h-10 rounded-full glass border-white/10 hover:border-[#25D366]/40 flex items-center justify-center text-[#8A96A0] hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-8 relative z-10">
            {testimonials.map((rev, i) => (
              <button
                key={rev.name}
                type="button"
                onClick={() => goTo(i)}
                data-ocid={`testimonials.tab.${i + 1}`}
                aria-label={`Go to review ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2 bg-[#25D366]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mini review grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {testimonials.slice(0, 4).map((rev, i) => (
            <button
              key={rev.name}
              type="button"
              onClick={() => goTo(i)}
              data-ocid={`testimonials.item.${i + 1}`}
              className={`glass rounded-xl p-3 text-left transition-all duration-200 ${i === active ? "border border-[#25D366]/30" : "border border-white/5 hover:border-white/15"}`}
            >
              <div
                className={`w-7 h-7 rounded-full ${rev.color} flex items-center justify-center text-white text-xs font-bold mb-2`}
              >
                {rev.initials}
              </div>
              <div className="text-white text-xs font-semibold truncate">
                {rev.name}
              </div>
              <div className="text-[#8A96A0] text-[10px]">{rev.location}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: "📷",
      title: "Scan Items",
      desc: "AI camera scan or WhatsApp list — takes under 60 seconds.",
    },
    {
      step: "02",
      icon: "💬",
      title: "Instant Estimate",
      desc: "Fixed, all-inclusive WhatsApp quote within minutes. No hidden add-ons.",
    },
    {
      step: "03",
      icon: "📅",
      title: "Book a Date",
      desc: "Choose your preferred moving date. Real-time confirmation.",
    },
    {
      step: "04",
      icon: "📦",
      title: "Expert Packing",
      desc: "Certified team arrives on time with premium materials.",
    },
    {
      step: "05",
      icon: "🚛",
      title: "Safe Transport",
      desc: "GPS-tracked, insured ShiftingWizz vehicle carries your belongings.",
    },
    {
      step: "06",
      icon: "🏠",
      title: "Happy Delivery",
      desc: "Everything arrives undamaged. We unpack and set up too — just ask!",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-5 sm:px-8 bg-[#0F1419]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge={<PillBadge variant="green">🗺️ Simple Process</PillBadge>}
          title="How It"
          highlight="Works"
          subtitle="6 simple steps to a completely stress-free ShiftingWizz move from start to finish."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.step}
              data-ocid={`howitworks.item.${i + 1}`}
              className={`reveal reveal-delay-${(i % 3) + 1} glass rounded-2xl p-6 flex gap-4 hover:border-[#25D366]/20 transition-all duration-300`}
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex-shrink-0">
                <div className="relative w-14 h-14 rounded-2xl glass-green flex items-center justify-center text-2xl">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shadow-green-glow">
                    {i + 1}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2 font-display">
                  {s.title}
                </h3>
                <p className="text-[#8A96A0] text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LEAD CAPTURE FORM ─────────────────────────────────────────────────────────
function LeadCaptureSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fromAddress: "",
    toAddress: "",
    movingDate: "",
    rooms: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi ShiftingWizz! I'd like a free moving survey.\n\nName: ${form.name}\nPhone: ${form.phone}\nFrom: ${form.fromAddress}\nTo: ${form.toAddress || "To be confirmed"}\nMoving Date: ${form.movingDate || "Flexible"}\nRooms: ${form.rooms || "To be confirmed"}\nSpecial Requirements: ${form.message || "None"}\n\nPlease share an exact quote. Thank you!`,
    );
    window.open(`https://wa.me/917353226655?text=${text}`, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        phone: "",
        fromAddress: "",
        toAddress: "",
        movingDate: "",
        rooms: "",
        message: "",
      });
    }, 4000);
  }

  const inputClass =
    "w-full bg-transparent border border-white/8 focus:border-[#25D366]/50 focus:outline-none text-white placeholder-[#3A4555] text-sm rounded-xl px-4 py-3.5 transition-colors";
  const labelClass = "text-[#8A96A0] text-sm font-medium mb-1.5 block";

  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0B0F12]" id="lead-form">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 reveal">
          <PillBadge variant="green">🎯 Free, No-Obligation Quote</PillBadge>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-3 font-display"
            style={{ letterSpacing: "-0.03em" }}
          >
            Book Your <span className="text-gradient-green">Free Survey</span>
          </h2>
          <p className="text-[#8A96A0] text-lg">
            Get an exact quote in 24 hours. No spam, no cold calls, no hidden
            fees.
          </p>
        </div>

        <div
          className="glass rounded-3xl p-8 shadow-premium reveal reveal-delay-1"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {submitted ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-5"
              data-ocid="leadform.success_state"
            >
              <div
                className="w-16 h-16 rounded-full glass-green flex items-center justify-center text-3xl"
                style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }}
              >
                ✅
              </div>
              <p className="text-white font-bold text-xl font-display">
                Request Sent!
              </p>
              <p className="text-[#8A96A0] text-sm text-center">
                Opening WhatsApp to connect you with the ShiftingWizz team…
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="leadform.panel"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lf-name" className={labelClass}>
                    Full Name *
                  </label>
                  <input
                    id="lf-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Rahul Sharma"
                    className={inputClass}
                    data-ocid="leadform.input"
                  />
                </div>
                <div>
                  <label htmlFor="lf-phone" className={labelClass}>
                    Phone Number *
                  </label>
                  <input
                    id="lf-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="9876543210"
                    className={inputClass}
                    data-ocid="leadform.input"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lf-from" className={labelClass}>
                  From Address *
                </label>
                <input
                  id="lf-from"
                  name="fromAddress"
                  value={form.fromAddress}
                  onChange={handleChange}
                  required
                  placeholder="Your City, India"
                  className={inputClass}
                  data-ocid="leadform.input"
                />
              </div>
              <div>
                <label htmlFor="lf-to" className={labelClass}>
                  To Address
                </label>
                <input
                  id="lf-to"
                  name="toAddress"
                  value={form.toAddress}
                  onChange={handleChange}
                  placeholder="Destination City, India"
                  className={inputClass}
                  data-ocid="leadform.input"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lf-date" className={labelClass}>
                    Preferred Moving Date
                  </label>
                  <input
                    id="lf-date"
                    name="movingDate"
                    value={form.movingDate}
                    onChange={handleChange}
                    type="date"
                    className={inputClass}
                    data-ocid="leadform.input"
                  />
                </div>
                <div>
                  <label htmlFor="lf-rooms" className={labelClass}>
                    Number of Rooms
                  </label>
                  <select
                    id="lf-rooms"
                    name="rooms"
                    value={form.rooms}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                    data-ocid="leadform.select"
                  >
                    <option value="" className="bg-[#0B0F12]">
                      Select rooms
                    </option>
                    {[
                      "Studio / 1RK",
                      "1 BHK",
                      "2 BHK",
                      "3 BHK",
                      "4+ BHK",
                      "Office",
                    ].map((r) => (
                      <option key={r} value={r} className="bg-[#0B0F12]">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="lf-message" className={labelClass}>
                  Special Requirements
                </label>
                <textarea
                  id="lf-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Fragile items, narrow stairs, heavy furniture, specific requirements…"
                  className={`${inputClass} resize-none`}
                  data-ocid="leadform.textarea"
                />
              </div>
              <button
                type="submit"
                data-ads-conversion="true"
                data-ocid="leadform.submit_button"
                className="w-full bg-[#25D366] hover:opacity-90 text-white font-bold py-4 rounded-xl text-base transition-all duration-200 shadow-green-glow hover:shadow-green-glow-lg mt-2"
              >
                💬 Get My Free Quote on WhatsApp
              </button>
              <p className="text-center text-[#8A96A0] text-xs">
                🔒 Your info is safe. No spam, no cold calls. WhatsApp reply
                only.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-5 sm:px-8 bg-[#0F1419] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(37,211,102,0.09) 0%, transparent 65%)",
          }}
          className="absolute inset-0"
        />
      </div>
      <div className="max-w-3xl mx-auto text-center relative z-10 reveal">
        <PillBadge variant="green">⚡ Limited Slots This Week</PillBadge>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white my-6 font-display"
          style={{ letterSpacing: "-0.03em" }}
        >
          Book Your ShiftingWizz Slot{" "}
          <span className="text-gradient-green">Today</span>
        </h2>
        <p className="text-[#8A96A0] text-lg mb-10 leading-relaxed">
          Don't wait until you're desperate. Lock in your preferred date before
          it's gone. India's most trusted movers are one call away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:+91${PHONE}`}
            data-ads-conversion="true"
            data-ocid="cta.primary_button"
            className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:opacity-90 text-white font-bold px-10 py-4.5 py-4 rounded-full text-lg transition-all shadow-green-glow hover:shadow-green-glow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            Call Now — {PHONE}
          </a>
          <a
            href={WA_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ads-conversion="true"
            data-ocid="cta.secondary_button"
            className="flex items-center justify-center gap-2.5 border-2 border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200"
          >
            💬 WhatsApp Now
          </a>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#080C0F] border-t border-white/5 py-14 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <ShiftingWizzLogo iconOnly={false} size={40} />
            </div>
            <p className="text-[#8A96A0] text-sm leading-relaxed max-w-xs mb-4">
              India's most trusted, transparent packers & movers. Fixed price.
              Zero hidden charges. Damage protection guaranteed on every move.
            </p>
            <div className="glass-green inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#25D366] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse inline-block" />
              Serving Pan-India
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                ["Services", "#features"],
                ["How It Works", "#how-it-works"],
                ["Reviews", "#testimonials"],
                ["Book Free Survey", "#lead-form"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-[#8A96A0] hover:text-white text-sm transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:+91${PHONE}`}
                  data-ads-conversion="true"
                  data-ocid="footer.primary_button"
                  className="text-[#8A96A0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  📞 +91-{PHONE}
                </a>
              </li>
              <li>
                <a
                  href={WA_QUOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ads-conversion="true"
                  data-ocid="footer.secondary_button"
                  className="text-[#8A96A0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  💬 WhatsApp Us
                </a>
              </li>
              <li className="text-[#8A96A0] text-xs leading-relaxed">
                📍 Office no 338, Apsara complex,
                <br />
                3rd floor, Delhi-UP Board post
                <br />
                Chikembarpur, Ghaziabad 201006
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#5A6470] text-sm">
            © {year} ShiftingWizz. All rights reserved.
          </p>
          <p className="text-[#5A6470] text-sm">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "shiftingwizz.com")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── STICKY BOTTOM BAR ─────────────────────────────────────────────────────────
function StickyBottomBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 shadow-premium"
      aria-label="Quick contact"
    >
      <div className="bg-[#0B0F12]/96 backdrop-blur-xl border-t border-white/5 py-1.5 text-center">
        <p className="text-[#5A6470] text-xs tracking-wide">
          ✅ <strong className="text-[#8A96A0]">ShiftingWizz</strong> · Free
          quote · Fixed price · Damage protected
        </p>
      </div>
      <div className="flex">
        <a
          href={`tel:+91${PHONE}`}
          data-ads-conversion="true"
          data-ocid="sticky.primary_button"
          className="flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-bold py-4 text-sm hover:opacity-90 transition-opacity"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          Call Now
        </a>
        <div className="w-px bg-white/5" />
        <a
          href={WA_QUOTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-ads-conversion="true"
          data-ocid="sticky.secondary_button"
          className="flex-1 flex items-center justify-center gap-2.5 bg-[#075E54] text-white font-bold py-4 text-sm hover:opacity-90 transition-opacity"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

// ── HOME PAGE (default export) ────────────────────────────────────────────────
export default function Home() {
  useScrollReveal();

  return (
    <div className="pb-24">
      <Nav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedInSection />
        <TrustSection />
        <ScanSection />
        <ProofSection />
        <TeamSection />
        <FleetSection />
        <ScamSection />
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <LeadCaptureSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyBottomBar />
    </div>
  );
}
