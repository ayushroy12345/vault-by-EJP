"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, X } from "lucide-react";

type View = "checking" | "paid" | "pending" | "failed";

const TERMINAL_STATES = new Set([
  "FAILED",
  "EXPIRED",
  "TERMINATED",
  "CANCELLED",
  "REFUNDED",
  "AMOUNT_MISMATCH",
]);

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? searchParams.get("orderId");
  const [view, setView] = useState<View>("checking");
  const [token, setToken] = useState<string | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setView("failed");
      return;
    }
    let cancelled = false;

    const check = async () => {
      if (cancelled) return;
      attemptsRef.current += 1;
      try {
        const res = await fetch(
          `/api/payments/verify?orderId=${encodeURIComponent(orderId)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "PAID") {
          setToken(typeof data.access_token === "string" ? data.access_token : null);
          setView("paid");
          return;
        }
        if (TERMINAL_STATES.has(data.status)) {
          setView("failed");
          return;
        }
        setView("pending");
      } catch {
        // Transient network error — keep checking.
      }
      if (!cancelled && attemptsRef.current < 12) {
        setTimeout(check, 3000);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-canvas shadow-float">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.09] to-transparent"
          />
          <div className="relative flex flex-col items-center p-10 text-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium tracking-wide text-canvas/80 transition-colors hover:border-white/30"
            >
              <Image
                src="/brand/vault-logo.png"
                alt=""
                width={1024}
                height={1024}
                className="size-5 object-contain"
              />
              Founder Vault
            </Link>

            <div className="mt-10 flex flex-col items-center gap-4">
              {view === "checking" && (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-canvas">
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Payment processing…
                    </p>
                    <p className="mt-1.5 text-sm text-canvas/60">
                      Confirming your payment with the bank.
                    </p>
                  </div>
                </>
              )}

              {view === "paid" && (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-canvas">
                    <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Payment successful
                    </p>
                    <p className="mt-1.5 text-sm text-canvas/60">
                      Your one-time payment of ₹149 is confirmed. Welcome to Founder
                      Vault.
                    </p>
                  </div>
                  {token && (
                    <Link
                      href={`/vault?token=${encodeURIComponent(token)}`}
                      className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-canvas px-8 text-base font-medium text-ink transition-all duration-300 ease-premium hover:bg-white"
                    >
                      ACCESS FOUNDER VAULT
                      <ArrowRight
                        className="size-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                  <p className="text-xs text-canvas/50">
                    Your access link was also emailed to you.
                  </p>
                </>
              )}

              {view === "pending" && (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-canvas">
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Your payment is being confirmed.
                    </p>
                    <p className="mt-1.5 text-sm text-canvas/60">
                      We&apos;ll email you as soon as your access is ready.
                    </p>
                  </div>
                </>
              )}

              {view === "failed" && (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-canvas">
                    <X className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      Payment was not completed.
                    </p>
                    <p className="mt-1.5 text-sm text-canvas/60">
                      No charge was made. You can try again from the pricing section.
                    </p>
                  </div>
                  <Link
                    href="/#pricing"
                    className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-8 text-base font-medium text-canvas transition-colors duration-300 ease-premium hover:border-white/30"
                  >
                    Back to Founder Vault
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
