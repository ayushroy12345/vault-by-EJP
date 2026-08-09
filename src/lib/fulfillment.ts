import crypto from "crypto";
import { getCashfree, ORDER_AMOUNT, ORDER_CURRENCY } from "@/lib/cashfree";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendFulfillmentEmail } from "@/lib/resend";

const PAID = "PAID";
const REFUNDED = "REFUNDED";

const TERMINAL_NON_PAID = new Set(["FAILED", "EXPIRED", "TERMINATED", "CANCELLED", "USER_DROPPED"]);

export type FulfillmentResult = {
  status: string;
  emailSent: boolean;
};

function nowIso() {
  return new Date().toISOString();
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://vault.entrepreneursjantaparty.com";
}

/**
 * Server-side source of truth for an order.
 *
 * Re-fetches the order from Cashfree, validates that it is genuinely PAID for
 * exactly ₹149 INR, persists/updates the purchase row, and — exactly once per
 * purchase — sends the fulfillment email.
 *
 * Called from both the webhook handler and the /api/payments/verify endpoint.
 * Idempotent: a second call for an already-fulfilled order sends nothing.
 */
export async function fulfillIfPaid(
  orderId: string,
  webhookDetails?: {
    customer_name?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
    payment_id?: string | null;
  } | null
): Promise<FulfillmentResult> {
  const cashfree = getCashfree();
  const supabase = getSupabaseAdmin();

  const { data: order } = await cashfree.PGFetchOrder(orderId);
  const orderStatus = order.order_status ?? "UNKNOWN";

  if (orderStatus !== PAID) {
    // No fulfillment for anything that is not confirmed PAID by Cashfree.
    // Persist the terminal status for bookkeeping only — never downgrade an
    // already-PAID row, never create new rows.
    if (TERMINAL_NON_PAID.has(orderStatus)) {
      await supabase
        .from("purchases")
        .update({ payment_status: orderStatus, updated_at: nowIso() })
        .eq("order_id", orderId)
        .eq("payment_status", "PENDING");
    }
    return { status: orderStatus, emailSent: false };
  }

  // Amount guard — never fulfill anything other than exactly ₹149 INR.
  if (
    Number(order.order_amount) !== ORDER_AMOUNT ||
    order.order_currency !== ORDER_CURRENCY
  ) {
    console.error("Cashfree fulfillment rejected: amount/currency mismatch", {
      order_id: orderId,
      order_amount: order.order_amount,
      order_currency: order.order_currency,
    });
    return { status: "AMOUNT_MISMATCH", emailSent: false };
  }

  // Ensure the purchase row exists / is current. Preserve the access token and
  // customer details captured at order creation when present.
  const { data: existing } = await supabase
    .from("purchases")
    .select("access_token, customer_name, customer_email, customer_phone, fulfilled_at")
    .eq("order_id", orderId)
    .maybeSingle();

  const accessToken = existing?.access_token ?? crypto.randomBytes(32).toString("hex");

  const { error: upsertError } = await supabase.from("purchases").upsert(
    {
      order_id: orderId,
      payment_id: webhookDetails?.payment_id ?? null,
      customer_name: existing?.customer_name ?? webhookDetails?.customer_name ?? null,
      customer_email:
        existing?.customer_email ?? webhookDetails?.customer_email ?? null,
      customer_phone:
        existing?.customer_phone ?? webhookDetails?.customer_phone ?? null,
      amount: ORDER_AMOUNT,
      currency: ORDER_CURRENCY,
      payment_status: PAID,
      product: "Founder Vault",
      access_token: accessToken,
      fulfilled_at: existing?.fulfilled_at ?? nowIso(),
      updated_at: nowIso(),
    },
    { onConflict: "order_id" }
  );
  if (upsertError) {
    throw new Error(`Supabase upsert failed: ${upsertError.message}`);
  }

  // Atomic claim — only one delivery (webhook retry or browser verify) wins the
  // email slot, so duplicate webhook deliveries can never send a second email.
  // If the send fails, the claim is released so a retry can take over.
  const { data: claimedRows, error: claimError } = await supabase
    .from("purchases")
    .update({ email_sent_at: nowIso() })
    .eq("order_id", orderId)
    .eq("payment_status", PAID)
    .is("email_sent_at", null)
    .select("customer_email, customer_name, access_token");

  if (claimError) {
    throw new Error(`Supabase claim failed: ${claimError.message}`);
  }

  const claimed = claimedRows?.[0];
  if (!claimed) {
    // Already fulfilled by another delivery.
    return { status: PAID, emailSent: false };
  }

  const customerEmail = claimed.customer_email ?? webhookDetails?.customer_email;
  if (!customerEmail) {
    await releaseEmailClaim(orderId);
    throw new Error("Cashfree fulfillment: no customer email available for delivery.");
  }

  const accessUrl = `${getSiteUrl()}/vault?token=${encodeURIComponent(
    claimed.access_token ?? accessToken
  )}`;

  try {
    await sendFulfillmentEmail({
      to: customerEmail,
      customerName: claimed.customer_name,
      accessUrl,
    });
  } catch (error) {
    await releaseEmailClaim(orderId);
    throw error;
  }

  return { status: PAID, emailSent: true };
}

async function releaseEmailClaim(orderId: string) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("purchases")
    .update({ email_sent_at: null })
    .eq("order_id", orderId)
    .eq("payment_status", PAID);
}

/**
 * Records a successful refund on a paid purchase so the access page stops
 * honoring that token. Never called on the fulfillment path.
 */
export async function markOrderRefunded(orderId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("purchases")
    .update({ payment_status: REFUNDED, updated_at: nowIso() })
    .eq("order_id", orderId)
    .eq("payment_status", PAID);
  if (error) {
    throw new Error(`Supabase refund update failed: ${error.message}`);
  }
}
