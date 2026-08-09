import { NextRequest, NextResponse } from "next/server";
import { verifyVaultToken } from "@/lib/vault-access";
import { getVaultSignedUrl, isVaultPathAllowed } from "@/lib/storage";

/**
 * Secure per-file download. Verifies the access token against a PAID purchase,
 * mints a fresh short-lived signed URL for the requested storage path, then
 * redirects the browser to it. Never exposes a public Storage URL.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const path = request.nextUrl.searchParams.get("path");

  if (!path || !isVaultPathAllowed(path)) {
    return NextResponse.json({ error: "Missing or invalid parameters." }, { status: 400 });
  }

  const purchase = await verifyVaultToken(token);
  if (!purchase) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const signedUrl = await getVaultSignedUrl(path);
  if (!signedUrl) {
    return NextResponse.json(
      { error: "This file isn't available yet. Please try again later." },
      { status: 404 }
    );
  }

  return NextResponse.redirect(signedUrl);
}
