"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/dashboard-mockup";
import { Stagger, StaggerItem } from "@/components/motion";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-36 pb-16 sm:px-6 sm:pt-44 sm:pb-20">
        <Stagger className="flex flex-col items-center text-center" stagger={0.12}>
          <StaggerItem>
            <Badge variant="dot">
              The complete founder toolkit
              <Sparkles className="size-3 text-ink-muted" aria-hidden="true" />
            </Badge>
          </StaggerItem>

          <StaggerItem className="mt-7">
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Everything a Founder
              <br className="hidden sm:block" /> Needs to{" "}
              <span className="text-ink-muted">Raise Capital.</span>
            </h1>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <p className="text-sm font-medium tracking-[0.02em] text-ink-muted">
              A flagship product by Entrepreneurs Janta Party
            </p>
          </StaggerItem>

          <StaggerItem className="mt-7 max-w-2xl">
            <p className="text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
              Investor &amp; VC resources, pitch decks, business planning
              templates, financial projections, legal documents and founder
              resources — all in one premium toolkit.
            </p>
          </StaggerItem>

          <StaggerItem className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#pricing">
                Get Founder Vault
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href="#whats-included">
                See Everything Included
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </StaggerItem>
        </Stagger>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 w-full sm:mt-24"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
