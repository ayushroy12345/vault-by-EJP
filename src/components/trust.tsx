"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const wordmarks = [
  { name: "Investor Data", className: "font-semibold tracking-tight" },
  { name: "PITCH DECKS", className: "font-medium tracking-[0.28em] text-[0.8rem]" },
  { name: "business plans", className: "font-medium lowercase tracking-tight" },
  { name: "Financial Projections.", className: "font-semibold italic tracking-tight" },
  { name: "LEGAL DOCS", className: "font-medium tracking-[0.18em] text-[0.8rem]" },
  { name: "Founder Resources", className: "font-mono font-medium tracking-tight" },
];

function CountUp({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      if (ref.current) ref.current.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("en-US")}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}

const stats = [
  { value: 1000, suffix: "+", label: "Verified investors" },
  { value: 300, suffix: "+", label: "Pitch decks" },
  { value: 1000, suffix: "+", label: "Business templates" },
  { value: 620, suffix: "+", label: "AI angel investors" },
];

export function Trust() {
  return (
    <section aria-label="What's inside Founder Vault" className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-[2rem] border border-line bg-white/40 py-12 backdrop-blur-xl sm:py-14">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-faint">
              Inside Founder Vault
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 px-6">
              {wordmarks.map((mark) => (
                <li
                  key={mark.name}
                  className={`text-lg text-ink-faint opacity-70 transition-all duration-300 hover:opacity-100 hover:text-ink-muted ${mark.className}`}
                >
                  {mark.name}
                </li>
              ))}
            </ul>

            <div className="h-px w-full max-w-2xl bg-line" aria-hidden="true" />

            <Stagger className="grid w-full grid-cols-2 gap-y-10 px-6 sm:px-10 lg:grid-cols-4">
              {stats.map((stat) => (
                <StaggerItem key={stat.label} className="flex flex-col items-center gap-2">
                  <span className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-sm text-ink-muted">{stat.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
