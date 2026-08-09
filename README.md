# Founder Vault

A premium, Apple-inspired marketing site for **Founder Vault** — the complete toolkit founders need to raise capital.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, TypeScript)
- React 19
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- shadcn/ui-style primitives (Radix-based)
- Geist font (bundled locally, no network required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the dev server           |
| `npm run build`  | Production build               |
| `npm run start`  | Serve the production build     |
| `npm run lint`   | Run ESLint                     |

## Structure

```
src/
  app/                 # Layout, metadata, page assembly, global styles
  components/
    ui/                # Reusable primitives (button, badge, accordion)
    navbar.tsx         # Floating glass navigation
    hero.tsx           # Headline + CTAs
    dashboard-mockup.tsx  # Glass dashboard mockup with floating cards
    trust.tsx          # Logo placeholders + animated stats
    features.tsx       # Feature glass-card grid
    whats-included.tsx # Expandable collections accordion
    why-choose.tsx     # Comparison table
    pricing.tsx        # Single premium pricing card
    faq.tsx            # FAQ accordion
    about-ejp.tsx      # About Entrepreneurs Janta Party section
    footer.tsx         # Minimal footer with Products column
    motion.tsx         # Reveal / Stagger animation primitives
```

## Branding

- **Logo:** `public/brand/vault-logo.png` (1024×1024). Used across the navbar, footer, pricing card, comparison table, and favicon via `next/image`.
- Founder Vault is a flagship product of [Entrepreneurs Janta Party](https://entrepreneursjantaparty.com) (EJP). The relationship is surfaced in the navbar ("VAULT by Entrepreneurs Janta Party", "EJP →"), hero, About section, footer, and metadata.

## Design Notes

- Palette: off-white `#F8F8F7`, ink `#111111`, muted `#666666`, hairline borders `rgba(0,0,0,0.08)`.
- Glass system: `glass`, `glass-strong`, `glass-subtle`, `glass-dark` utilities.
- All animations respect `prefers-reduced-motion`.
- No raster images — the hero mockup is rendered in CSS for a 90+ Lighthouse target.
