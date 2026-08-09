"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  label: string;
  manual: string;
  vault: string;
}

const rows: ComparisonRow[] = [
  {
    label: "Investor data",
    manual: "Scattered, outdated lists",
    vault: "Verified data of 1,000+ investors",
  },
  {
    label: "Pitch decks",
    manual: "Generic, unattached templates",
    vault: "300 decks used by Uber, Airbnb & Postmates",
  },
  {
    label: "Financial projections",
    manual: "DIY spreadsheets",
    vault: "Ready-to-use projections",
  },
  {
    label: "Legal documents",
    manual: "Expensive lawyers, slow",
    vault: "Agreements & articles of association",
  },
  {
    label: "Fundraising knowledge",
    manual: "Guesswork and hope",
    vault: "Ebook + YC, a16z & NFX resources",
  },
  {
    label: "Business templates",
    manual: "Fragmented documents",
    vault: "Business Docs Pro — 1,000+ templates",
  },
  {
    label: "Cost",
    manual: "₹50,000+ in scattered tools",
    vault: "₹149 — once",
  },
];

function ResultCell({
  children,
  positive,
}: {
  children: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full",
          positive ? "bg-ink text-canvas" : "bg-black/[0.05] text-ink-faint",
        )}
      >
        {positive ? (
          <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
        )}
      </span>
      <span
        className={cn(
          "text-[0.8125rem] leading-snug sm:text-sm",
          positive ? "font-medium text-ink" : "text-ink-muted",
        )}
      >
        {children}
      </span>
    </div>
  );
}

export function WhyChoose() {
  return (
    <section aria-label="Why choose Founder Vault" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Founder Vault"
          title="Stop searching. Start closing."
          description="Founders waste months assembling scattered tools, templates and lists. Founder Vault puts everything in one place — for the price of a single dinner."
        />

        <Stagger className="mt-16" stagger={0.06}>
          <StaggerItem>
            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white/50 shadow-card backdrop-blur-xl">
              {/* Header */}
              <div className="hidden grid-cols-[1.5fr_1fr_1fr] border-b border-line sm:grid">
                <div className="px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Capability
                </div>
                <div className="border-l border-line px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Manual search
                </div>
                <div className="flex items-center justify-between border-l border-line bg-black/[0.03] px-6 py-4">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink">
                    Founder Vault
                  </span>
                  <Image
                    src="/brand/vault-logo.png"
                    alt=""
                    width={1024}
                    height={1024}
                    className="size-8 object-contain drop-shadow-[0_2px_6px_rgb(0_0_0/0.12)]"
                  />
                </div>
              </div>

              {/* Mobile header */}
              <div className="grid grid-cols-2 border-b border-line sm:hidden">
                <div className="px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Manual search
                </div>
                <div className="border-l border-line bg-black/[0.03] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink">
                  Founder Vault
                </div>
              </div>

              {/* Rows */}
              <div className="grid grid-cols-[1.1fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr]">
                <div className="flex flex-col border-r border-line">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex min-h-[4.25rem] items-center border-b border-line px-5 py-4 text-[0.8125rem] font-medium text-ink last:border-b-0 sm:px-6 sm:text-sm"
                    >
                      {row.label}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex min-h-[4.25rem] items-center border-b border-line px-4 py-4 last:border-b-0 sm:px-6"
                    >
                      <ResultCell positive={false}>{row.manual}</ResultCell>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col bg-black/[0.03]">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex min-h-[4.25rem] items-center border-b border-line px-4 py-4 last:border-b-0 sm:px-6"
                    >
                      <ResultCell positive>{row.vault}</ResultCell>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
