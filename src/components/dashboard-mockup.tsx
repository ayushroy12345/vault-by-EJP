"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Database,
  FileText,
  FolderOpen,
  LayoutGrid,
  Lock,
  Presentation,
  ScrollText,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_PREMIUM } from "@/components/motion";

const resources = [
  {
    name: "Verified Data of 1,000+ Investors",
    collection: "Investor & VC",
    type: "List",
    icon: Database,
    tone: "bg-[#16a34a]",
  },
  {
    name: "300 Pitch Decks (Uber, Airbnb & Postmates)",
    collection: "Pitch Decks",
    type: "Decks",
    icon: Presentation,
    tone: "bg-[#16a34a]",
  },
  {
    name: "Top 620+ AI Angel Investors 2025",
    collection: "Investor & VC",
    type: "List",
    icon: Database,
    tone: "bg-[#d97706]",
  },
  {
    name: "Business Docs Pro Collection (1,000+ Templates)",
    collection: "Business",
    type: "Collection",
    icon: FolderOpen,
    tone: "bg-[#16a34a]",
  },
  {
    name: "Startup Fundraising Ebook",
    collection: "Founder",
    type: "Ebook",
    icon: BookOpen,
    tone: "bg-[#d97706]",
  },
  {
    name: "YC W25 Application Form Template",
    collection: "Founder",
    type: "Template",
    icon: FileText,
    tone: "bg-[#16a34a]",
  },
];

const sidebarItems = [
  { label: "Investor & VC", active: true },
  { label: "Pitch Decks" },
  { label: "Business Planning" },
  { label: "Financial" },
  { label: "Legal" },
  { label: "Founder Resources" },
];

function FloatingCard({
  icon: Icon,
  title,
  subtitle,
  className,
  delay = 0,
  drift = 7,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  className?: string;
  delay?: number;
  drift?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("absolute z-20", className)}
      initial={reduced ? false : { opacity: 0, scale: 0.92 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -drift, 0] }
      }
      transition={{
        opacity: { duration: 0.9, delay, ease: EASE_PREMIUM },
        scale: { duration: 0.9, delay, ease: EASE_PREMIUM },
        y: { duration: 6.5, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div className="glass-strong flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-5 shadow-lift">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-ink text-canvas">
          <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-[0.8125rem] font-semibold text-ink">
            {title}
          </span>
          <span className="block text-[0.6875rem] text-ink-muted">{subtitle}</span>
        </span>
      </div>
    </motion.div>
  );
}

export function DashboardMockup() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Ambient glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-6 -z-10 h-[120%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(17_17_17/0.08),transparent_65%)] blur-2xl"
      />

      {/* Floating cards */}
      <FloatingCard
        icon={Database}
        title="Investor & VC Resources"
        subtitle="1,000+ verified investors"
        className="-left-2 top-24 sm:left-2 lg:-left-14"
        delay={0.35}
      />
      <FloatingCard
        icon={Presentation}
        title="Pitch Deck Resources"
        subtitle="300+ decks from funded startups"
        className="-right-2 top-44 sm:right-2 lg:-right-14"
        delay={0.7}
      />
      <FloatingCard
        icon={Calculator}
        title="Financial Projections"
        subtitle="Numbers ready before you pitch"
        className="-left-1 bottom-28 sm:left-4 xl:-left-20"
        delay={1.05}
      />
      <FloatingCard
        icon={ScrollText}
        title="Legal Documents"
        subtitle="Agreements & articles of association"
        className="-right-1 bottom-16 sm:right-4 xl:-right-16"
        delay={1.4}
      />
      <FloatingCard
        icon={FileText}
        title="Business Templates"
        subtitle="1,000+ docs pro templates"
        className="left-1/2 -top-8 hidden -translate-x-1/2 lg:block"
        delay={0.5}
        drift={5}
      />

      {/* Main panel */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 48, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: EASE_PREMIUM, delay: 0.15 }}
        className="glass-strong rounded-[1.75rem] p-2 shadow-float sm:rounded-[2.25rem] sm:p-3"
      >
        <div className="overflow-hidden rounded-[1.35rem] bg-white/60 sm:rounded-[1.7rem]">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6 sm:py-3.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="size-2.5 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-[0.6875rem] text-ink-muted">
              <Lock className="size-3" aria-hidden="true" />
              vault.entrepreneursjantaparty.com
            </div>
            <div className="flex items-center gap-2 text-ink-faint" aria-hidden="true">
              <SlidersHorizontal className="size-3.5" />
              <LayoutGrid className="size-3.5" />
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <aside
              className="hidden w-44 shrink-0 flex-col gap-1 border-r border-line p-4 md:flex"
              aria-hidden="true"
            >
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.8125rem] font-medium",
                    item.active
                      ? "bg-ink text-canvas shadow-soft"
                      : "text-ink-muted",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      item.active ? "bg-canvas" : "bg-ink-faint",
                    )}
                  />
                  {item.label}
                </div>
              ))}
              <div className="mt-4 rounded-xl border border-dashed border-line-strong px-3 py-2.5 text-[0.6875rem] text-ink-faint">
                Lifetime access · One-time payment
              </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[0.9375rem] font-semibold text-ink">
                    Founder Vault
                  </p>
                  <p className="text-[0.6875rem] text-ink-muted">
                    7 collections · 30+ curated resources
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[0.6875rem] text-ink-faint">
                    <Search className="size-3" aria-hidden="true" />
                    Search
                  </div>
                  <div className="rounded-full bg-ink px-3 py-1.5 text-[0.6875rem] font-medium text-canvas">
                    Download
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface/60">
                <div
                  className="hidden grid-cols-[1.8fr_0.9fr_0.6fr_0.4fr] gap-3 border-b border-line px-4 py-2.5 text-[0.625rem] font-medium uppercase tracking-wider text-ink-faint sm:grid"
                  aria-hidden="true"
                >
                  <span>Resource</span>
                  <span>Collection</span>
                  <span className="text-right">Type</span>
                  <span className="text-right">Included</span>
                </div>
                {resources.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[1.8fr_0.9fr_0.6fr_0.4fr] items-center gap-3 border-b border-line px-4 py-2.5 last:border-b-0"
                    aria-hidden="true"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-black/[0.05] text-ink-faint">
                        <row.icon className="size-3" strokeWidth={1.75} />
                      </span>
                      <span className="truncate text-[0.8125rem] font-medium text-ink">
                        {row.name}
                      </span>
                    </span>
                    <span className="hidden text-[0.75rem] text-ink-muted sm:block">
                      {row.collection}
                    </span>
                    <span className="text-right text-[0.75rem] font-medium tabular-nums text-ink">
                      {row.type}
                    </span>
                    <span className="flex justify-end">
                      <span
                        className={cn("size-1.5 rounded-full", row.tone)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
