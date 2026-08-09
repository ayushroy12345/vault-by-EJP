"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion";

const faqs = [
  {
    question: "How will I receive access?",
    answer:
      "Instantly, after purchase. You'll receive a confirmation email with a secure download link and unlock instructions for everything inside the Vault — no waiting, no accounts to set up.",
  },
  {
    question: "Can I download everything?",
    answer:
      "Yes. Everything is downloadable — investor data, pitch decks, business and legal templates, projections and founder resources. Nothing is locked behind a web app or paywalled feature.",
  },
  {
    question: "Is it lifetime?",
    answer:
      "Yes. Pay once and Founder Vault is yours forever — no renewals, no subscriptions, no surprises.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "None at all. Everything is ready to use — financial projections are pre-built, decks are fully editable, and documents have clear placeholders to personalise.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative scroll-mt-24 py-24 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered."
          description="Everything you need to know before you press buy. Anything else — just ask."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <Accordion type="single" collapsible defaultValue="access">
            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  className="overflow-hidden rounded-[1.5rem] border border-line bg-white/50 backdrop-blur-xl transition-colors duration-300 data-[state=open]:border-line-strong data-[state=open]:bg-white/70"
                >
                  <AccordionTrigger className="px-6 py-5 text-[1.0625rem] font-semibold tracking-tight text-ink hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="px-6 pb-6 max-w-2xl text-pretty leading-relaxed text-ink-muted">
                      {faq.answer}
                    </p>
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
