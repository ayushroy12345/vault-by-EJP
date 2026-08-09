import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type VaultPurchase = {
  customer_name: string | null;
  access_token: string;
};

/**
 * Verifies a Vault access token against a PAID purchase. Returns the purchase
 * only when the token matches and payment_status is PAID — refunded/expired
 * purchases lose access. Fails closed (returns null) on any error.
 */
export async function verifyVaultToken(
  token: string | null
): Promise<VaultPurchase | null> {
  if (!token) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("purchases")
      .select("customer_name, payment_status, access_token")
      .eq("access_token", token)
      .maybeSingle();

    if (data && data.payment_status === "PAID" && data.access_token === token) {
      return {
        customer_name: data.customer_name,
        access_token: data.access_token,
      };
    }
  } catch (error) {
    // Fail closed: if we cannot verify the token, grant no access.
    console.error("Vault access lookup failed:", error);
  }
  return null;
}
