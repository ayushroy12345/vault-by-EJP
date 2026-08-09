import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  /** Main wordmark text shown next to the logo mark. */
  wordmark?: string;
  /** Small muted subtitle under the wordmark (e.g. "by Entrepreneurs Janta Party"). */
  subtitle?: string;
  priority?: boolean;
  /** Size of the round logo mark (Tailwind size utility value). */
  sizeClass?: string;
}

export function Logo({
  className,
  href = "#",
  wordmark = "VAULT",
  subtitle = "by Entrepreneurs Janta Party",
  priority = false,
  sizeClass = "size-14",
}: LogoProps) {
  const ariaLabel = subtitle ? `${wordmark} — ${subtitle}` : wordmark;

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className,
      )}
      aria-label={ariaLabel}
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <Image
          src="/brand/vault-logo.png"
          alt=""
          width={1024}
          height={1024}
          priority={priority}
          className={cn(
            "size-full object-contain drop-shadow-[0_2px_8px_rgb(0_0_0/0.14)] transition-transform duration-500 ease-premium group-hover:scale-[1.05]",
            sizeClass,
          )}
        />
      </span>
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-semibold tracking-tight text-ink">
            {wordmark}
          </span>
          {subtitle && (
            <span className="mt-1 text-xs font-medium text-ink-muted">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
