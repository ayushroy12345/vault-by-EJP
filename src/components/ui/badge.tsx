import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-surface/70 text-ink-muted backdrop-blur-xl",
        solid: "border-transparent bg-ink text-canvas",
        dot: "border-line bg-surface/70 text-ink-muted backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dotClassName?: string;
}

function Badge({ className, variant, dotClassName, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "dot" && (
        <span className="relative flex size-1.5" aria-hidden="true">
          <span
            className={cn(
              "absolute inline-flex size-full rounded-full bg-ink",
              dotClassName,
            )}
          />
          <span
            className={cn(
              "relative inline-flex size-1.5 rounded-full bg-ink",
              dotClassName,
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
