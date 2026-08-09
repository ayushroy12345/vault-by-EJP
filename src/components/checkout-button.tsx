"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";

type CashfreeClientMode = "sandbox" | "production";
type Phase = "idle" | "form" | "creating" | "processing";

const buttonClasses =
  "group inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-canvas px-8 text-base font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_24px_rgb(0_0_0/0.3)] transition-all duration-300 ease-premium hover:-translate-y-px hover:bg-white active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-70";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-canvas placeholder:text-canvas/40 transition-colors focus:border-white/25 focus:bg-white/10 focus:outline-none";

type CashfreeGlobal = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget: string;
  }) => Promise<{
    error?: unknown;
    redirect?: boolean;
    paymentDetails?: unknown;
  }>;
};

export function CheckoutButton({ mode }: { mode: CashfreeClientMode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const cashfreeRef = useRef<CashfreeGlobal | null>(null);

  const getCashfree = useCallback(async () => {
    if (cashfreeRef.current) return cashfreeRef.current;
    if (typeof window === "undefined") {
      throw new Error("Checkout is only available in the browser.");
    }
    if (!(window as unknown as Record<string, unknown>).Cashfree) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Unable to load the secure checkout."));
        document.head.appendChild(script);
      });
    }
    const Ctor = (window as unknown as {
      Cashfree: (options: { mode: string }) => CashfreeGlobal;
    }).Cashfree;
    cashfreeRef.current = Ctor({ mode });
    return cashfreeRef.current;
  }, [mode]);

  const handlePay = async () => {
    if (name.trim().length < 2) {
      setNotice("Please enter your name.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice("Please enter a valid email.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setNotice("Please enter a valid 10-digit phone number.");
      return;
    }

    setNotice(null);
    setPhase("creating");
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to create order.");

      setPhase("processing");
      const cashfree = await getCashfree();
      const result = await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      if (result.error) {
        // SDK error OR the user closed the modal without paying.
        setNotice("Payment was not completed. You can try again.");
        setPhase("form");
        return;
      }
      if (result.redirect) {
        // In-app browser fallback — the /success return_url picks up the flow.
        router.push(`/success?order_id=${encodeURIComponent(data.order_id)}`);
        return;
      }
      if (result.paymentDetails) {
        // An attempt was submitted; /success re-verifies with our backend
        // before ever showing "Payment successful".
        router.push(`/success?order_id=${encodeURIComponent(data.order_id)}`);
      }
    } catch (error) {
      console.error(error);
      setNotice(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
      setPhase("form");
    }
  };

  if (phase === "idle") {
    return (
      <button
        type="button"
        onClick={() => setPhase("form")}
        className={buttonClasses}
      >
        Buy Now
        <ArrowRight
          className="size-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>
    );
  }

  const isBusy = phase === "creating" || phase === "processing";

  return (
    <div className="mt-9">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="checkout-name"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-canvas/50"
          >
            Your name
          </label>
          <input
            id="checkout-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last name"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="checkout-email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-canvas/50"
          >
            Email for your download
          </label>
          <input
            id="checkout-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="checkout-phone"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-canvas/50"
          >
            Phone number
          </label>
          <input
            id="checkout-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
            className={inputClasses}
          />
        </div>

        {notice && (
          <p className="text-center text-xs text-canvas/60" role="status">
            {notice}
          </p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={isBusy}
          className={buttonClasses}
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {phase === "processing" ? "Opening secure checkout…" : "Creating order…"}
            </>
          ) : (
            <>
              Pay ₹149
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        {!isBusy && (
          <button
            type="button"
            onClick={() => {
              setPhase("idle");
              setNotice(null);
            }}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-canvas/50 transition-colors hover:text-canvas"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
