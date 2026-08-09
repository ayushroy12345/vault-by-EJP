import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Founder Vault and Entrepreneurs Janta Party — email us at entrepreneursjantaparty@mail.com.",
};

const contactEmail = "entrepreneursjantaparty@mail.com";

function IndiaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" rx="2" fill="#ffffff" />
      <rect width="30" height="6.7" fill="#ff9933" />
      <rect y="13.3" width="30" height="6.7" fill="#138808" />
      <circle cx="15" cy="10" r="3" fill="none" stroke="#000080" strokeWidth="1" />
      <circle cx="15" cy="10" r="0.55" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="15"
          y1="10"
          x2="15"
          y2="7.05"
          stroke="#000080"
          strokeWidth="0.32"
          transform={`rotate(${i * 15} 15 10)`}
        />
      ))}
    </svg>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section id="contact" className="relative overflow-hidden">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-36 pb-24 sm:px-6 sm:pt-44 sm:pb-32">
            <SectionHeading
              eyebrow="Contact"
              title="Let's talk."
              description="Questions about Founder Vault or Entrepreneurs Janta Party? Send us a message — we read every one."
            />

            <div className="mt-16 grid w-full gap-5 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <a
                  href={`mailto:${contactEmail}`}
                  className="group flex h-full flex-col items-start gap-6 rounded-[2rem] border border-line bg-white/50 p-8 backdrop-blur-xl transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-line-strong hover:bg-white/75 hover:shadow-lift"
                >
                  <span className="flex size-11 items-center justify-center rounded-[0.8rem] bg-ink text-canvas">
                    <Mail className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
                      Email us
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-ink">
                      {contactEmail}
                    </span>
                    <span className="text-sm text-ink-muted">
                      Write to us anytime — click to open your email app.
                    </span>
                  </span>
                </a>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex h-full flex-col items-start gap-6 rounded-[2rem] border border-line bg-white/50 p-8 backdrop-blur-xl">
                  <span className="flex size-11 items-center justify-center rounded-[0.8rem] bg-ink text-canvas">
                    <MapPin className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
                      Based in
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-ink">
                      Wherever the internet works
                    </span>
                    <span className="flex items-center gap-2 text-sm text-ink-muted">
                      <IndiaFlag className="size-5 rounded-[0.25rem] shadow-soft" />
                      Most probably India.
                    </span>
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="mt-8 w-full">
              <Stagger className="flex w-full">
                <StaggerItem className="flex w-full flex-col items-center justify-between gap-5 rounded-[2rem] border border-line bg-white/40 px-8 py-7 backdrop-blur-xl sm:flex-row">
                  <p className="text-pretty text-center text-lg font-medium text-ink sm:text-left">
                    Prefer to write directly? We&apos;d love to hear from you.
                  </p>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={`mailto:${contactEmail}`}>
                      Email us
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                </StaggerItem>
              </Stagger>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
