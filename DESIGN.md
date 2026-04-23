# Design Brief

## Direction
ShiftingWizz Premium – ultra-dark luxury moving marketplace for India. Deep charcoal (0.06 L) with WhatsApp green accents (0.70 L, 0.24 C) creates instant trust and conversion focus. Premium micro-interactions, glassmorphism overlays, blog cards with gradient image surfaces and smooth entrance animations. Every pixel feels funded, high-end, and production-ready.

## Tone
Confident, minimalist, tech-forward luxury. Zero compromises on contrast, readability, conversion signals. Bold typography hierarchy differentiates from local commodity movers.

## Differentiation
Enhanced WhatsApp green glow combined with premium shadow rendering (up to 80px depth), premium blog cards with featured image overlays and category badges, smooth parallax animations, staggered entrance effects, and green-tinted card surfaces create instantly recognizable conversion powerhouse optimized for Google Ads campaigns.

## Color Palette

| Token      | OKLCH          | Role                           |
| ---------- | -------------- | ------------------------------ |
| background | 0.06 0 0       | Ultra-deep black, maximum luxury |
| foreground | 0.98 0.005 0   | Pure off-white text, perfect readability |
| card       | 0.14 0.008 240 | Elevated surfaces with blue hint |
| primary    | 0.70 0.24 142  | WhatsApp green, premium pop, conversion signals |
| muted      | 0.26 0.01 240  | Secondary surfaces, subtle depth |
| accent     | 0.70 0.24 142  | Green highlights, blog metadata |
| border     | 0.24 0.008 240 | Refined dividers, minimal contrast |

## Typography
Display: Space Grotesk — bold hero `text-5xl md:text-7xl tracking-tight`, section headings `text-3xl md:text-5xl tracking-tight`, labels `text-xs font-semibold uppercase tracking-widest`
Body: DM Sans — `text-base md:text-lg` with 1.6 line-height for luxury spacing
Mono: JetBrains Mono — technical data, code snippets

## Elevation & Depth
Premium shadow hierarchy: `shadow-lg` (0 8px 24px), `shadow-xl` (0 12px 40px), `shadow-premium` (0 20px 60px), `shadow-premium-lg` (0 30px 80px). Green glow effects at 28px–80px spread radius with 35–55% opacity for CTAs.

## Structural Zones

| Zone        | Background            | Border                       | Shadow               |
| ----------- | --------------------- | ---------------------------- | -------------------- |
| Header      | bg-background/85      | border-b border-border       | shadow-lg            |
| Hero        | bg-background         | none                         | text glow only       |
| Stats       | bg-background         | none                         | card enter stagger   |
| Blog Cards  | bg-card               | border-green/12              | shadow-xl on hover   |
| Content     | alternating sections  | subtle dividers              | card: shadow-lg      |
| Footer      | bg-muted/20           | border-t border-border       | subtle shadow-sm     |

## Component Patterns
**Buttons:** `rounded-md`, `bg-green-brand`, black text, `shadow-green-glow` with hover `scale-105` + `shadow-green-glow-lg`. 
**Cards:** `bg-card`, `border-border/20`, fade-in on scroll with 100ms stagger. 
**Blog Cards:** Featured image gradient overlay, category badge (uppercase, green-tinted), headline (display font, 2xl), read time + date metadata (muted, 14px), excerpt (body, 16px), hover: `scale-105` + `shadow-xl`.
**Stats:** Counter animation 0.8s with delay cascade (100ms per item).
**Media Badges:** Glassmorphic background with green border, 8px blur.

## Motion & Animation
**Entrance:** `fade-up` + 100ms stagger per item. `slide-left`/`slide-right` for alternating sections. `scale-in` for cards.
**Hover:** `scale-105` (0.3s smooth transition), glow intensification on CTAs.
**Blog Cards:** Hover glow effect, shadow elevation shift.
**Stats:** `count-up` keyframe, staggered delays per stat block.
**Loading:** `pulse` indefinite. **Decorative:** Green `glow` animation 3s ease-in-out infinite on featured elements.

## Responsive Design
Mobile-first: `sm:`, `md:`, `lg:` breakpoints. Blog cards 1 col mobile, 2 col tablet, 3 col desktop. Blog image height 12rem mobile, 14rem desktop.

## Constraints
All colors via OKLCH CSS variables only. Fonts locally bundled (Space Grotesk, DM Sans, JetBrains Mono). Green glow only on primary CTAs and blog hovers. All images use absolute-positioned brand overlays — no regeneration needed. Mobile-first responsive design.

## Signature Detail
40px–80px spread-radius green glow shadow on primary CTAs paired with ultra-dark background (0.06 L) creates premium tech-forward call-to-action. Premium blog cards with gradient overlays and category badges signal editorial quality and authority. Glassmorphism badges on imagery reinforce consistent brand presence.

## Blog Page Features
- Premium article cards with featured CSS/SVG gradient image area
- Category badges with green-tinted styling
- Read time calculation and display
- Article excerpt with consistent body copy
- Smooth hover effects with scale + shadow elevation
- Staggered entrance animations on scroll
- Featured blog highlight (larger card, primary position)

## Google Ads Compliance
All CTA anchors include `data-ocid="ads-conversion"` attribute. Meta tags optimized: og:title, og:description, og:image, LocalBusiness schema with phone, address, ratings. Title: "ShiftingWizz – India's #1 Trusted Packers & Movers | Zero Hidden Charges". Phone: +91 7353226655. Address: Office no 338, Apsara complex, 3rd floor, delhi-up Board post chikembarpur (Ghaziabad) 201006.
