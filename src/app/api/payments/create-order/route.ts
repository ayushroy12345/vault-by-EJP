import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCashfree, ORDER_AMOUNT, ORDER_CURRENCY } from "@/lib/cashfree";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

export async function POST(request: NextRequest) {
  let name = "";
  let email = "";
  let phone = "";
  try {
    const body = await request.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
    email = typeof body.email === "string" ? body.email.trim() : "";
    phone = typeof body.phone === "string" ? body.phone.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Your name, email and phone number are required." },
      { status: 400 }
    );
  }

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit phone number." },
      { status: 400 }
    );
  }

  const orderId = `FV_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
  const accessToken = crypto.randomBytes(32).toString("hex");

  // Persist a PENDING purchase BEFORE creating the Cashfree order so the webhook
  // always has a row to update. Never fulfilled unless Cashfree confirms PAID.
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("purchases").insert({
      order_id: orderId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      amount: ORDER_AMOUNT,
      currency: ORDER_CURRENCY,
      payment_status: "PENDING",
      product: "Founder Vault",
      access_token: accessToken,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Supabase insert purchase failed:", error);
    return NextResponse.json(
      { error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }

  try {
    const cashfree = getCashfree();
    const response = await cashfree.PGCreateOrder({
      order_id: orderId,
      order_amount: ORDER_AMOUNT,
      order_currency: ORDER_CURRENCY,
      customer_details: {
        customer_id: orderId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${request.nextUrl.origin}/success`,
        notify_url: `${request.nextUrl.origin}/api/webhooks/cashfree`,
      },
    });

    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });
  } catch (error) {
    console.error("Cashfree create order failed:", error);
    return NextResponse.json(
      { error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
}
