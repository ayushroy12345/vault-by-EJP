import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
          <span className="mr-2 inline-block size-1.5 rounded-full bg-ink align-middle" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3.25rem] sm:leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </Reveal>
  );
}
