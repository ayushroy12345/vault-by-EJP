import { NextRequest, NextResponse } from "next/server";
import { getCashfree } from "@/lib/cashfree";
import { fulfillIfPaid, markOrderRefunded } from "@/lib/fulfillment";

const PAYMENT_EVENT_PREFIX = "PAYMENT";
const REFUND_EVENT = "REFUND_STATUS_WEBHOOK";

type WebhookPayload = {
  type?: string;
  data?: {
    order?: { order_id?: string };
    payment?: { cf_payment_id?: string };
    customer_details?: {
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
    };
    refund?: { refund_status?: string };
  };
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");
  if (!signature || !timestamp) {
    return new NextResponse("Missing signature headers", { status: 400 });
  }

  // Signature verification MUST run against the raw body, not parsed JSON.
  const rawBody = await request.text();

  let payload: WebhookPayload;
  try {
    const event = getCashfree().PGVerifyWebhookSignature(signature, rawBody, timestamp);
    payload =
      event.object && typeof event.object === "object"
        ? (event.object as WebhookPayload)
        : (JSON.parse(rawBody) as WebhookPayload);
  } catch (error) {
    console.error("Cashfree webhook signature verification failed", {
      message: error instanceof Error ? error.message : "invalid signature",
    });
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const type = payload?.type;
  const orderId = payload?.data?.order?.order_id;

  if (!orderId) {
    console.error("Cashfree webhook missing order_id", { type });
    return new NextResponse("OK", { status: 200 });
  }

  // Refunds never grant (or regrant) access — record the reversal only.
  if (type === REFUND_EVENT && payload?.data?.refund?.refund_status === "SUCCESS") {
    try {
      await markOrderRefunded(orderId);
    } catch (error) {
      console.error("Cashfree webhook refund update failed", {
        order_id: orderId,
        message: error instanceof Error ? error.message : "unknown error",
      });
      return new NextResponse("Retry", { status: 500 });
    }
    console.log("Cashfree webhook processed (refund)", { order_id: orderId });
    return new NextResponse("OK", { status: 200 });
  }

  if (typeof type === "string" && type.startsWith(PAYMENT_EVENT_PREFIX)) {
    try {
      const result = await fulfillIfPaid(orderId, {
        customer_name: payload?.data?.customer_details?.customer_name,
        customer_email: payload?.data?.customer_details?.customer_email,
        customer_phone: payload?.data?.customer_details?.customer_phone,
        payment_id: payload?.data?.payment?.cf_payment_id,
      });
      console.log("Cashfree webhook processed", {
        type,
        order_id: orderId,
        status: result.status,
        email_sent: result.emailSent,
        x_idempotency_key: request.headers.get("x-idempotency-key"),
      });
      return new NextResponse("OK", { status: 200 });
    } catch (error) {
      console.error("Cashfree webhook fulfillment failed", {
        type,
        order_id: orderId,
        message: error instanceof Error ? error.message : "unknown error",
      });
      return new NextResponse("Retry", { status: 500 });
    }
  }

  // Irrelevant event (settlement / instrument / dispute / unknown) — acknowledge
  // safely without delivering anything.
  console.log("Cashfree webhook acknowledged (unhandled type)", { type, order_id: orderId });
  return new NextResponse("OK", { status: 200 });
}
