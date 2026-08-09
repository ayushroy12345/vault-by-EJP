"use client";

import {
  Briefcase,
  Calculator,
  Database,
  FolderOpen,
  Presentation,
  Rocket,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/motion";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Database,
    title: "Investor & VC Resources",
    description:
      "Verified data on 1,000+ investors — Indian angels, VC funds, AI angel investors, family offices and cold-outreach lists for UAE and US markets.",
  },
  {
    icon: Presentation,
    title: "Pitch Deck Resources",
    description:
      "200+ pitch decks plus 300 decks used by startups like Uber, Airbnb and Postmates — alongside funded-startup decks and ready-to-edit templates.",
  },
  {
    icon: Briefcase,
    title: "Business Planning",
    description:
      "Business plan templates and a startup seed funding template to structure your plan and shape your ask.",
  },
  {
    icon: Calculator,
    title: "Financial Resources",
    description:
      "Financial projections you can use to back your numbers before you pitch.",
  },
  {
    icon: ScrollText,
    title: "Legal Resources",
    description:
      "Agreement templates and articles of association — the core legal documents startups need.",
  },
  {
    icon: FolderOpen,
    title: "Business Resources",
    description:
      "The Business Docs Pro Collection — 1,000+ business templates in one place.",
  },
  {
    icon: Rocket,
    title: "Founder Resources",
    description:
      "A startup fundraising ebook, YC & WTFund founder lists, the YC W25 application template and fundraising resources from YC, a16z and NFX.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-label="What's included"
      className="relative py-24 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="One toolkit"
          title={
            <>
              Everything you need, <br className="hidden sm:block" />
              nothing you don&apos;t.
            </>
          }
          description="Seven curated collections. One download. Every resource ready to use the moment you need it."
        />

        <Stagger
          className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          stagger={0.07}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <article className="group relative h-full overflow-hidden rounded-[1.5rem] border border-line bg-white/50 p-6 backdrop-blur-xl transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-line-strong hover:bg-white/75 hover:shadow-lift">
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-6 flex size-11 items-center justify-center rounded-[0.8rem] bg-black/[0.05] text-ink transition-all duration-500 ease-premium group-hover:bg-ink group-hover:text-canvas group-hover:shadow-soft">
                  <feature.icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
