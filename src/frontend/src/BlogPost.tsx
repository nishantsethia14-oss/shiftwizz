import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { BLOG_POSTS } from "./Blog";
import type { BlogPost } from "./Blog";

const PHONE = "7353226655";
const WA_QUOTE_URL = `https://wa.me/917353226655?text=${encodeURIComponent("Hi ShiftingWizz! I need a moving quote. Please share the best price.")}`;

interface ArticleSection {
  heading?: string;
  body: string;
}

interface ArticleContent {
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
}

const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  "10-things-before-packers-arrive": {
    intro:
      "The difference between a chaotic moving day and a smooth one often comes down to preparation.",
    sections: [
      {
        heading: "1. Declutter and Donate",
        body: "Go room by room and create three piles: keep, donate, and discard. Every box you eliminate saves you real money on the final bill.",
      },
      {
        heading: "2. Make a Complete Inventory",
        body: "Walk through every room with your phone and photograph everything of value. This serves as both quote documentation and insurance proof.",
      },
      {
        heading: "3. Sort Items by Room",
        body: "Group your belongings by destination room. This allows our packers to work in organized zones, cutting packing time by 20-30%.",
      },
    ],
    conclusion:
      "With these steps done before your ShiftingWizz team arrives, your moving day will be smooth and professional. Contact ShiftingWizz today for a free, fixed-price quote.",
  },
  "how-to-avoid-moving-scams-india": {
    intro:
      "India's moving industry is worth thousands of crores, and a significant portion of it is built on deception.",
    sections: [
      {
        heading: "5 Red Flags to Watch For",
        body: "No physical office address. Quote given without visiting your inventory. Payment demanded entirely upfront. No written contract. No company vehicles.",
      },
      {
        heading: "How to Verify a Moving Company",
        body: "Ask for their GST registration number and verify it. Visit their physical office. Check Google and JustDial reviews. Ask for references from recent customers.",
      },
    ],
    conclusion:
      "Protect yourself, verify before you book, and never let urgency pressure you into skipping due diligence. Your home deserves better than a scammer.",
  },
  "ultimate-packing-checklist-stress-free-move": {
    intro:
      "Packing is the most time-consuming part of any move and the most often underestimated.",
    sections: [
      {
        heading: "What You'll Need",
        body: "40-50 medium cardboard boxes, bubble wrap (10 metres per room), foam sheets for electronics, packing tape, permanent markers, and specialty boxes for kitchen crockery.",
      },
      {
        heading: "The Right Order to Pack",
        body: "Pack least-used rooms first, most-used rooms last. Storage rooms first (1-2 weeks before), kitchen last (1 day before).",
      },
    ],
    conclusion:
      "A great packing job separates an easy move from a stressful one. Ask ShiftingWizz about our full-service packing option.",
  },
  "how-to-move-fragile-items-safely": {
    intro:
      "Fragile items represent the greatest risk in any move. ShiftingWizz has developed a comprehensive protocol for fragile items.",
    sections: [
      {
        heading: "Glassware: The Double-Wrap Method",
        body: "Every glass item requires individual wrapping. First wrap in packing paper, then add bubble wrap. Always pack glasses vertically, never lying flat.",
      },
      {
        heading: "Electronics: The OEM Box Rule",
        body: "Original boxes are always the best solution for electronics. If unavailable, wrap in anti-static bubble wrap and fill gaps completely with foam.",
      },
    ],
    conclusion:
      "Fragile items demand respect, patience, and the right materials. ShiftingWizz handles everything from crystal to flat-screen TVs.",
  },
  "why-professional-packers-save-money": {
    intro:
      "The most common reason people attempt DIY moves is to save money — but when you do the full accounting, the math rarely works out.",
    sections: [
      {
        heading: "The True Cost of a DIY Move",
        body: "Truck rental + fuel + packing materials + time off work + average item damage = Total ₹34,000+. ShiftingWizz 2BHK Move starts from ₹15,000-25,000 including materials, labor, and insurance.",
      },
    ],
    conclusion:
      "Professional packers save time, reduce stress, eliminate damage risk, and often cost less than the true all-in cost of doing it yourself.",
  },
  "settle-new-city-after-moving": {
    intro:
      "The move is done, the boxes are (somewhat) unpacked, and you're standing in your new home in a new city.",
    sections: [
      {
        heading: "The Essential First 30 Days",
        body: "Register your new address with local authorities. Update your Aadhaar card and voter ID address. Find your nearest hospital and pharmacy. Explore your neighborhood on foot.",
      },
      {
        heading: "Give Yourself 3 Months",
        body: "The first month is survival mode. The second month is navigation mode. By the third month, the city starts to feel familiar. Missing your old city is normal and expected.",
      },
    ],
    conclusion:
      "Every new city eventually becomes home. ShiftingWizz has helped thousands of families complete this transition across India.",
  },
};

function ShiftingWizzLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="34"
        height="34"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
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
        <span className="font-bold text-[16px] tracking-tight font-display">
          <span className="text-white">Shifting</span>
          <span className="text-[#25D366]">Wizz</span>
        </span>
        <span className="text-[9px] text-[#6B7A84] font-medium tracking-wide hidden sm:block">
          India's Most Trusted Movers
        </span>
      </div>
    </div>
  );
}

function StickyBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      aria-label="Quick contact"
    >
      <div className="bg-[#0B0F12]/96 backdrop-blur-xl border-t border-white/5 py-1 text-center">
        <p className="text-[#5A6470] text-xs">
          ShiftingWizz · Free quote · Fixed price · Damage protected
        </p>
      </div>
      <div className="flex">
        <a
          href={`tel:+91${PHONE}`}
          data-ads-conversion="true"
          data-ocid="sticky.primary_button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 text-sm hover:opacity-90 transition-opacity"
        >
          Call Now
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
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

function ArticleBody({ content }: { content: ArticleContent }) {
  return (
    <div>
      <p className="text-[#AAB4BC] text-lg leading-relaxed mb-8">
        {content.intro}
      </p>
      {content.sections.map((section) => (
        <div
          key={section.heading ?? section.body.slice(0, 30)}
          className="mb-8"
        >
          {section.heading && (
            <h2 className="text-xl font-bold text-white mb-3 font-display">
              {section.heading}
            </h2>
          )}
          <p className="text-[#AAB4BC] text-base leading-relaxed">
            {section.body}
          </p>
        </div>
      ))}
      <div
        className="glass-green rounded-2xl p-6 mt-8"
        style={{ border: "1px solid rgba(37,211,102,0.2)" }}
      >
        <p className="text-[#25D366] font-semibold text-sm mb-2">Conclusion</p>
        <p className="text-[#AAB4BC] text-base leading-relaxed">
          {content.conclusion}
        </p>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);
  const content = slug ? ARTICLE_CONTENT[slug] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (post) document.title = `${post.title} | ShiftingWizz Blog`;
    return () => {
      document.title = "ShiftingWizz — India's Most Trusted Movers";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex flex-col items-center justify-center text-center px-5 pb-24">
        <h1 className="text-3xl font-bold text-white mb-4 font-display">
          Article Not Found
        </h1>
        <a
          href="/blog"
          className="bg-[#25D366] hover:opacity-90 text-white font-bold px-8 py-3 rounded-full shadow-green-glow"
          data-ocid="blogpost.primary_button"
        >
          ← Back to Blog
        </a>
      </div>
    );
  }

  const categoryBgMap: Record<string, string> = {
    "Moving Tips": "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25",
    "Safety & Scams": "bg-red-500/10 text-red-400 border-red-500/25",
    "Packing Guides": "bg-blue-500/10 text-blue-400 border-blue-500/25",
    "New City Guides": "bg-purple-500/10 text-purple-400 border-purple-500/25",
  };
  const catClass =
    categoryBgMap[post.category] ??
    "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/25";
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0B0F12] pb-24">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F12]/96 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <a
            href="/"
            data-ocid="blogpost-nav.link"
            className="hover:opacity-80 transition-opacity"
          >
            <ShiftingWizzLogo />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              data-ocid="blogpost-nav.link"
              className="text-[#8A96A0] hover:text-white text-sm font-medium transition-colors"
            >
              ← Back to Blog
            </a>
            <a
              href={WA_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ads-conversion="true"
              data-ocid="blogpost-nav.primary_button"
              className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-green-glow"
            >
              💬 Get Quote
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-[68px]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 mt-10">
          <div
            className={`relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
          >
            <span className="text-7xl sm:text-8xl relative z-10">
              {post.icon}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0F12] to-transparent" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 mt-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${catClass}`}
            >
              {post.category}
            </span>
            <span className="text-[#8A96A0] text-xs">{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.08] mb-6 font-display">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
            <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm">
              SW
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                ShiftingWizz Expert Team
              </p>
              <p className="text-[#8A96A0] text-xs mt-0.5">
                Published {post.publishDate}
              </p>
            </div>
          </div>

          <div className="mb-12">
            {content ? (
              <ArticleBody content={content} />
            ) : (
              <p className="text-[#AAB4BC] text-lg leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          <div
            className="glass rounded-2xl p-7 mb-10"
            style={{ border: "1px solid rgba(37,211,102,0.15)" }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  Planning a Move?
                </h3>
                <p className="text-[#8A96A0] text-sm">
                  Free, fixed-price quote from ShiftingWizz. No hidden fees.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`tel:+91${PHONE}`}
                  data-ads-conversion="true"
                  data-ocid="blogpost.primary_button"
                  className="bg-[#25D366] hover:opacity-90 text-white font-bold px-6 py-3 rounded-full text-sm shadow-green-glow"
                >
                  Call {PHONE}
                </a>
                <a
                  href={WA_QUOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="blogpost.secondary_button"
                  className="glass border-white/10 text-white font-bold px-6 py-3 rounded-full text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <section className="mt-12 pt-10 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 font-display">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rpost, i) => (
                <a
                  key={rpost.slug}
                  href={`/blog/${rpost.slug}`}
                  data-ocid={`related.item.${i + 1}`}
                  className="text-left glass rounded-xl overflow-hidden hover:border-[#25D366]/30 transition-all group block"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className={`h-28 bg-gradient-to-br ${rpost.gradient} flex items-center justify-center`}
                  >
                    <span className="text-3xl">{rpost.icon}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#25D366] font-semibold uppercase tracking-wider mb-2">
                      {rpost.category}
                    </p>
                    <h4 className="text-white text-sm font-semibold group-hover:text-[#25D366] transition-colors line-clamp-2">
                      {rpost.title}
                    </h4>
                    <p className="text-[#25D366] text-xs mt-2 font-medium">
                      Read More →
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <StickyBar />
    </div>
  );
}
