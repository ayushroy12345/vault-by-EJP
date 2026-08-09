"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Calculator,
  Check,
  Database,
  FolderOpen,
  Presentation,
  Rocket,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion";

interface Collection {
  icon: LucideIcon;
  title: string;
  count: string;
  description: string;
  items: string[];
}

const collections: Collection[] = [
  {
    icon: Database,
    title: "Investor & VC Resources",
    count: "15 lists",
    description:
      "Verified investor data and curated lists spanning Indian angels, VC funds, family offices and international investors.",
    items: [
      "Verified data of 1,000+ investors",
      "Full Indian angel investors list",
      "250+ VCs & angels accepting cold outreach",
      "620+ AI angel investors (2025)",
      "UAE, family office & US VC lists",
    ],
  },
  {
    icon: Presentation,
    title: "Pitch Deck Resources",
    count: "4 resources",
    description:
      "Pitch decks from startups that raised, plus ready-to-use deck templates.",
    items: [
      "200+ pitch decks",
      "300 decks used by Uber, Airbnb & Postmates",
      "Funded startups pitch decks",
      "Pitch deck templates",
    ],
  },
  {
    icon: Briefcase,
    title: "Business Planning",
    count: "2 templates",
    description:
      "Templates to structure your business plan and prepare your seed round.",
    items: [
      "Business plan templates",
      "Startup seed funding template",
    ],
  },
  {
    icon: Calculator,
    title: "Financial Resources",
    count: "1 resource",
    description:
      "Financial projections to back your numbers with a clear model.",
    items: [
      "Financial projections",
    ],
  },
  {
    icon: ScrollText,
    title: "Legal Resources",
    count: "2 documents",
    description:
      "The core legal documents startups need to operate and raise.",
    items: [
      "Agreements templates",
      "Articles of association",
    ],
  },
  {
    icon: FolderOpen,
    title: "Business Resources",
    count: "1,000+ templates",
    description:
      "The Business Docs Pro Collection — 1,000+ templates for running your company.",
    items: [
      "Business Docs Pro Collection (1,000+ templates)",
    ],
  },
  {
    icon: Rocket,
    title: "Founder Resources",
    count: "7 resources",
    description:
      "Fundraising knowledge, founder lists and accelerator references to raise efficiently.",
    items: [
      "Startup fundraising ebook",
      "Fundraising resources (YC, a16z, NFX & more)",
      "YC W25 application form template",
      "YC founders list & WTFund founders",
      "Accelerator list for Samridh scheme",
    ],
  },
];

export function WhatsIncluded() {
  return (
    <section
      id="whats-included"
      aria-label="What's included"
      className="relative py-24 sm:py-36"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal className="flex flex-col items-start gap-6">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-ink align-middle" />
              What&apos;s inside
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3.25rem] sm:leading-[1.05]">
              Seven collections.
              <br />
              Every resource.
            </h2>
            <p className="max-w-md text-pretty text-lg leading-relaxed text-ink-muted">
              More than 30 curated resources, organised into seven collections —
              everything a founder needs to plan, pitch and raise.
            </p>
            <p className="rounded-2xl border border-line bg-white/50 px-5 py-4 text-sm text-ink-muted backdrop-blur-xl">
              <span className="font-semibold text-ink">7 collections</span> ·
              30+ resources · 1 lifetime purchase
            </p>
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-ink-muted"
            >
              Get Founder Vault
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible defaultValue="investor-database">
            <div className="flex flex-col gap-3">
              {collections.map((collection) => (
                <AccordionItem
                  key={collection.title}
                  value={collection.title.toLowerCase().replace(/[^a-z]+/g, "-")}
                  className="overflow-hidden rounded-[1.5rem] border border-line bg-white/50 backdrop-blur-xl transition-colors duration-300 data-[state=open]:border-line-strong data-[state=open]:bg-white/70"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline">
                    <span className="flex items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[0.8rem] bg-black/[0.05] text-ink">
                        <collection.icon
                          className="size-5"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-left">
                        <span className="block text-[1.0625rem] font-semibold tracking-tight text-ink">
                          {collection.title}
                        </span>
                        <span className="block text-sm text-ink-muted">
                          {collection.count}
                        </span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6">
                      <p className="max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-ink-muted">
                        {collection.description}
                      </p>
                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {collection.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2.5 text-sm text-ink-soft"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-canvas">
                              <Check
                                className="size-3"
                                strokeWidth={2.5}
                                aria-hidden="true"
                              />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
