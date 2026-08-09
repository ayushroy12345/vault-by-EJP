import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-canvas hover:bg-ink/90 hover:-translate-y-px shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_24px_rgb(0_0_0/0.18)] active:translate-y-0 active:scale-[0.985]",
        outline:
          "border border-line-strong bg-surface/60 text-ink backdrop-blur-xl hover:bg-surface hover:-translate-y-px shadow-soft active:translate-y-0",
        ghost:
          "text-ink-muted hover:text-ink hover:bg-black/[0.04] active:scale-[0.985]",
        light:
          "bg-canvas text-ink hover:bg-white hover:-translate-y-px shadow-soft active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 text-[0.9375rem]",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
