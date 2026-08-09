import { NextRequest, NextResponse } from "next/server";
import { fulfillIfPaid } from "@/lib/fulfillment";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
  }

  try {
    // Re-verifies the order with Cashfree (server-to-server) and fulfils exactly
    // once if it is genuinely PAID. The browser never decides payment status.
    const result = await fulfillIfPaid(orderId);

    let accessToken: string | null = null;
    if (result.status === "PAID") {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("purchases")
        .select("access_token")
        .eq("order_id", orderId)
        .maybeSingle();
      accessToken = data?.access_token ?? null;
    }

    return NextResponse.json({ status: result.status, access_token: accessToken });
  } catch (error) {
    console.error("Cashfree fetch order failed:", error);
    return NextResponse.json(
      { error: "Unable to verify order. Please try again." },
      { status: 500 }
    );
  }
}
