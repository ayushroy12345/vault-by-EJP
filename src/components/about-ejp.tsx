"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function AboutEJP() {
  return (
    <section
      id="about-ejp"
      aria-label="About Entrepreneurs Janta Party"
      className="relative scroll-mt-24 py-24 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The parent brand"
          title="About Entrepreneurs Janta Party"
          description="Entrepreneurs Janta Party is building an ecosystem for founders, entrepreneurs, creators, and innovators — connecting them with the capital, tools, and knowledge they need to build, raise, and scale."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <div className="flex flex-col items-center gap-8 rounded-[2rem] border border-line bg-white/50 p-8 text-center backdrop-blur-xl sm:p-12">
            <p className="text-pretty text-lg leading-relaxed text-ink-muted">
              Founder Vault is EJP&apos;s flagship fundraising product — one
              premium toolkit that gives every founder the same investor
              databases, templates, and resources the best-funded startups
              start with.
            </p>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://entrepreneursjantaparty.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Entrepreneurs Janta Party
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
