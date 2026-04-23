import { useEffect, useState } from "react";

const PHONE = "7353226655";
const WA_QUOTE_URL = `https://wa.me/917353226655?text=${encodeURIComponent("Hi ShiftingWizz! I need a moving quote. Please share the best price.")}`;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  excerpt: string;
  gradient: string;
  icon: string;
  iconColor: string;
}

// ── Blog Posts Data ───────────────────────────────────────────────────────────
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "10-things-before-packers-arrive",
    title: "10 Things You Must Do Before Your Packers Arrive",
    category: "Moving Tips",
    readTime: "6 min read",
    publishDate: "April 10, 2025",
    excerpt:
      "Preparing your home before the movers show up can save hours and prevent costly mistakes. Here's the definitive pre-move checklist every Indian household needs.",
    gradient: "from-[#0B2A1A] to-[#0B0F12]",
    icon: "✅",
    iconColor: "text-[#25D366]",
  },
  {
    slug: "how-to-avoid-moving-scams-india",
    title: "How to Avoid Moving Scams in India (Complete Guide 2025)",
    category: "Safety & Scams",
    readTime: "8 min read",
    publishDate: "March 28, 2025",
    excerpt:
      "Thousands of Indian families fall prey to fake movers every year. Learn the exact red flags, verification steps, and legal protections to keep your belongings safe.",
    gradient: "from-[#2A0B0B] to-[#0B0F12]",
    icon: "🛡️",
    iconColor: "text-red-400",
  },
  {
    slug: "ultimate-packing-checklist-stress-free-move",
    title: "The Ultimate Packing Checklist for a Stress-Free Move",
    category: "Packing Guides",
    readTime: "7 min read",
    publishDate: "March 15, 2025",
    excerpt:
      "From bubble wrap to box labeling strategies — everything you need to pack your entire home professionally without missing a single item.",
    gradient: "from-[#0B1A2A] to-[#0B0F12]",
    icon: "📦",
    iconColor: "text-blue-400",
  },
  {
    slug: "how-to-move-fragile-items-safely",
    title: "How to Move Fragile Items Safely: A Professional Guide",
    category: "Packing Guides",
    readTime: "5 min read",
    publishDate: "February 22, 2025",
    excerpt:
      "Glass, electronics, artwork, and antiques require special care. Learn the professional techniques used by expert packers to ensure zero damage during transit.",
    gradient: "from-[#2A1A0B] to-[#0B0F12]",
    icon: "💎",
    iconColor: "text-amber-400",
  },
  {
    slug: "why-professional-packers-save-money",
    title: "Why Hiring Professional Packers Actually Saves You Money",
    category: "Moving Tips",
    readTime: "4 min read",
    publishDate: "February 8, 2025",
    excerpt:
      "The math might surprise you. When you factor in packing supplies, vehicle rental, and broken items, DIY moves often cost more than hiring professionals.",
    gradient: "from-[#1A1A0B] to-[#0B0F12]",
    icon: "💰",
    iconColor: "text-yellow-400",
  },
  {
    slug: "settle-new-city-after-moving",
    title: "How to Settle Into a New City After Moving: 15 Practical Tips",
    category: "New City Guides",
    readTime: "9 min read",
    publishDate: "January 25, 2025",
    excerpt:
      "Moving cities is exciting and overwhelming at the same time. This guide covers everything from registering your new address to finding the best local services.",
    gradient: "from-[#0B0B2A] to-[#0B0F12]",
    icon: "🏙️",
    iconColor: "text-purple-400",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Moving Tips": "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25",
  "Safety & Scams": "bg-red-500/10 text-red-400 border-red-500/25",
  "Packing Guides": "bg-blue-500/10 text-blue-400 border-blue-500/25",
  "New City Guides": "bg-purple-500/10 text-purple-400 border-purple-500/25",
};

const CATEGORIES = [
  "All",
  "Moving Tips",
  "Packing Guides",
  "Safety & Scams",
  "New City Guides",
];

// ── Logo ──────────────────────────────────────────────────────────────────────
function ShiftingWizzLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="36"
        height="36"
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
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-bold text-[17px] tracking-tight font-display">
          <span className="text-white">Shifting</span>
          <span className="text-[#25D366]">Wizz</span>
        </span>
        <span className="text-[9px] text-[#6B7A84] font-medium tracking-wide mt-0.5 hidden sm:block">
          India's Most Trusted Movers
        </span>
      </div>
    </div>
  );
}

// ── Blog Nav ──────────────────────────────────────────────────────────────────
function BlogNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0B0F12]/96 border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl" : "bg-[#0B0F12]/80 backdrop-blur-xl border-b border-white/5"}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <a
          href="/"
          data-ocid="blog-nav.link"
          className="hover:opacity-80 transition-opacity"
        >
          <ShiftingWizzLogo />
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/"
            data-ocid="blog-nav.link"
            className="text-[#8A96A0] hover:text-white text-sm font-medium transition-colors duration-200"
          >
            ← Back to Home
          </a>
          <a
            href={WA_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ads-conversion="true"
            data-ocid="blog-nav.primary_button"
            className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-green-glow"
          >
            💬 Get Quote
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const categoryClass =
    CATEGORY_COLORS[post.category] ??
    "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25";

  return (
    <a
      href={`/blog/${post.slug}`}
      data-ocid={`blog.item.${index + 1}`}
      className="group glass rounded-2xl overflow-hidden hover:border-[#25D366]/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(37,211,102,0.12)] block"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className={`relative h-52 bg-gradient-to-br ${post.gradient} overflow-hidden flex items-center justify-center`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(37,211,102,0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="text-5xl" role="img" aria-label={post.category}>
            {post.icon}
          </span>
          <span className="text-white/30 text-xs font-mono tracking-widest uppercase">
            shiftingwizz.in
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0B0F12]/90 to-transparent" />
        <div className="absolute top-4 left-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${categoryClass}`}
          >
            {post.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 glass-dark rounded-full px-2.5 py-1 text-[10px] text-[#8A96A0] font-medium">
          {post.readTime}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-white font-bold text-[17px] leading-snug mb-3 font-display group-hover:text-[#25D366] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-[#8A96A0] text-sm leading-relaxed mb-5 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              SW
            </div>
            <div>
              <p className="text-white text-xs font-semibold">
                ShiftingWizz Expert
              </p>
              <p className="text-[#8A96A0] text-[10px]">{post.publishDate}</p>
            </div>
          </div>
          <span className="text-[#25D366] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">
            Read More →
          </span>
        </div>
      </div>
    </a>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function BlogFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#080C0F] border-t border-white/5 py-10 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <ShiftingWizzLogo />
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#8A96A0]">
            <a
              href={`tel:+91${PHONE}`}
              className="hover:text-white transition-colors"
            >
              📞 +91-{PHONE}
            </a>
            <a
              href={WA_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              💬 WhatsApp Us
            </a>
            <a href="/" className="hover:text-white transition-colors">
              🏠 Home
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#5A6470] text-xs">
            📍 Office no 338, Apsara Complex, 3rd Floor, Ghaziabad 201006
          </p>
          <p className="text-[#5A6470] text-sm">
            © {year} ShiftingWizz. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "shiftingwizz.in")}`}
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

// ── Sticky Bottom Bar ─────────────────────────────────────────────────────────
function StickyBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      aria-label="Quick contact"
    >
      <div className="bg-[#0B0F12]/96 backdrop-blur-xl border-t border-white/5 py-1 text-center">
        <p className="text-[#5A6470] text-xs">
          ✅ <strong className="text-[#8A96A0]">ShiftingWizz</strong> · Free
          quote · Fixed price · Damage protected
        </p>
      </div>
      <div className="flex">
        <a
          href={`tel:+91${PHONE}`}
          data-ads-conversion="true"
          data-ocid="sticky.primary_button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 text-sm hover:opacity-90 transition-opacity"
        >
          📞 Call Now
        </a>
        <div className="w-px bg-white/5" />
        <a
          href={WA_QUOTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-ads-conversion="true"
          data-ocid="sticky.secondary_button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#075E54] text-white font-bold py-3.5 text-sm hover:opacity-90 transition-opacity"
        >
          💬 WhatsApp
        </a>
      </div>
    </nav>
  );
}

// ── Blog Page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Moving Tips & Guides | ShiftingWizz Blog";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Expert moving tips, packing guides, and relocation advice from India's most trusted packers and movers.",
    );
    setMeta("og:title", "Moving Tips & Guides | ShiftingWizz Blog", true);
    setMeta(
      "og:description",
      "Expert moving tips, packing guides, and relocation advice from India's most trusted packers and movers.",
      true,
    );
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    return () => {
      document.title = "ShiftingWizz — India's Most Trusted Movers";
    };
  }, []);

  const filtered =
    activeCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B0F12] pb-24">
      <BlogNav />

      {/* Hero */}
      <section className="relative pt-[68px] pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,211,102,0.09) 0%, transparent 70%)",
            }}
            className="absolute inset-0"
          />
        </div>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] rounded-full px-4 py-1.5 text-sm font-medium mb-7">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse inline-block" />
            ShiftingWizz Expert Knowledge Base
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.06] mb-5 font-display"
            style={{ letterSpacing: "-0.03em" }}
          >
            Moving Tips &{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #25d366 0%, #1da84f 60%, #2ecc71 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expert Guides
            </span>
          </h1>
          <p className="text-xl text-[#8A96A0] leading-relaxed max-w-2xl mx-auto mb-10">
            Professional advice from India's #1 packers and movers team.
            Stress-free moving starts here.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-2.5"
            data-ocid="blog.filter.tab"
            role="tablist"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="blog.tab"
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#25D366] text-white border-[#25D366] shadow-green-glow"
                    : "glass border-white/10 text-[#8A96A0] hover:border-[#25D366]/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section
        className="max-w-7xl mx-auto px-5 sm:px-8 pb-16"
        data-ocid="blog.list"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" data-ocid="blog.empty_state">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-[#8A96A0] text-lg">
              No articles in this category yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-12">
        <div
          className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ border: "1px solid rgba(37,211,102,0.15)" }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-display">
                Ready to Move?{" "}
                <span className="text-[#25D366]">Get a Free Quote</span>
              </h2>
              <p className="text-[#8A96A0] text-[15px]">
                India's most trusted movers are just one WhatsApp away. Fixed
                price, zero hidden fees.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={`tel:+91${PHONE}`}
                data-ads-conversion="true"
                data-ocid="blog.primary_button"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-bold px-6 py-3.5 rounded-full text-sm transition-all shadow-green-glow"
              >
                📞 Call {PHONE}
              </a>
              <a
                href={WA_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ads-conversion="true"
                data-ocid="blog.secondary_button"
                className="flex items-center justify-center gap-2 glass border-white/10 hover:border-[#25D366]/40 text-white font-bold px-6 py-3.5 rounded-full text-sm transition-all"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <BlogFooter />
      <StickyBar />
    </div>
  );
}
