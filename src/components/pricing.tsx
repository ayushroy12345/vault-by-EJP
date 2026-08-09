"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion";
import { CheckoutButton } from "@/components/checkout-button";

const inclusions = [
  "Everything included — all seven collections",
  "Lifetime access, one payment",
  "Instant download after purchase",
  "No subscription, no renewal",
];

type CashfreeClientMode = "sandbox" | "production";

export function Pricing({
  cashfreeMode = "sandbox",
}: {
  cashfreeMode?: CashfreeClientMode;
}) {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative scroll-mt-24 py-24 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="One price. Everything included."
          description="No tiers, no subscriptions, no upsells. A single purchase that pays for itself the day you close your first round."
        />

        <Reveal className="mt-16 flex justify-center" delay={0.1}>
          <div className="relative w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -top-10 -z-10 h-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(17_17_17/0.1),transparent_65%)] blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] bg-ink text-canvas shadow-float">
              {/* Top sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/[0.09] to-transparent"
              />

              <div className="relative p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium tracking-wide text-canvas/80">
                    Launch offer
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-canvas/50">
                    Lifetime
                  </span>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/brand/vault-logo.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="size-10 object-contain drop-shadow-[0_2px_8px_rgb(0_0_0/0.25)]"
                    />
                    <h3 className="text-xl font-semibold tracking-tight">
                      Founder Vault
                    </h3>
                  </div>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-6xl font-semibold leading-none tracking-[-0.04em]">
                      ₹149
                    </span>
                    <span className="pb-1 text-lg text-canvas/40 line-through decoration-canvas/30">
                      ₹999
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-canvas/60">
                    One-time payment. Yours forever.
                  </p>
                </div>

                <div className="my-8 h-px bg-white/10" aria-hidden="true" />

                <ul className="flex flex-col gap-3.5">
                  {inclusions.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-canvas">
                        <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span className="text-canvas/85">{item}</span>
                    </li>
                  ))}
                </ul>

                <CheckoutButton mode={cashfreeMode} />

                <p className="mt-4 text-center text-xs text-canvas/50">
                  Secure checkout · Instant delivery · No subscription
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
