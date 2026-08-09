# Cashfree Payment Webhooks — Founder Vault

Production webhook + fulfillment system for Founder Vault (₹149, INR).

## Flow

1. Customer clicks **Buy Now**, enters name/email/phone.
2. Server creates a **PENDING** purchase row in Supabase (with a private access token) and a Cashfree order via `POST /pg/orders`.
3. Customer pays in the Cashfree.js v3 modal.
4. Cashfree POSTs a signed webhook to `/api/webhooks/cashfree`.
5. Server verifies the webhook signature (raw body), then **re-verifies the order with Cashfree's API** — it never trusts the webhook's own amount/status.
6. If Cashfree confirms `order_status === "PAID"` for exactly **₹149 INR**, the row is marked PAID and the fulfillment email is sent via **Resend** — **exactly once**.
7. The email's **ACCESS FOUNDER VAULT →** button links to the private `/vault?token=…` page, which only renders the Vault for a PAID purchase. It lists the seven product categories, each showing its files and folders. Clicking a file hits `/api/vault/download`, which verifies the token + PAID status, mints a **short-lived signed URL** for that exact storage path in the private `founder-vault` bucket, and redirects to it. Clicking a folder opens the `/vault/browse` drill-down (unlimited nesting). No file is ever publicly accessible.
8. `/success?order_id=…` shows status fetched from our backend, never from the browser.

## Files

| Path | Purpose |
|---|---|
| `src/app/api/webhooks/cashfree/route.ts` | Webhook endpoint (signature verify + fulfillment) |
| `src/app/api/payments/create-order/route.ts` | Creates PENDING purchase + Cashfree order |
| `src/app/api/payments/verify/route.ts` | Backend verification (used by `/success`) |
| `src/lib/cashfree.ts` | Cashfree SDK client (server-only) |
| `src/lib/fulfillment.ts` | Idempotent fulfill logic (webhook + verify share it) |
| `src/lib/supabase-admin.ts` | Supabase service-role client (server-only) |
| `src/lib/storage.ts` | Category → file/folder mapping + listing + signed-URL helpers for the private `founder-vault` bucket |
| `src/lib/vault-access.ts` | Shared token + PAID verification for `/vault`, `/vault/browse`, and downloads |
| `src/lib/resend.ts` | Resend client + fulfillment email template |
| `src/app/success/page.tsx` | Payment status page (backend-verified) |
| `src/app/vault/page.tsx` | Token-gated access page (renders the seven category sections) |
| `src/app/vault/browse/page.tsx` | Folder drill-down page for the loose-file structure |
| `src/app/api/vault/download/route.ts` | Per-click token verification + signed-URL redirect (by storage path) |
| `src/components/checkout-button.tsx` | Buy Now → checkout flow |
| `supabase/migrations/0001_create_purchases.sql` | Purchases table |
| `supabase/migrations/0002_founder_vault_storage.sql` | Private `founder-vault` bucket + `updated_at` trigger |
| `docs/supabase-setup.md` | Supabase project setup + Storage upload steps |

## Environment variables

| Variable | Notes |
|---|---|
| `CASHFREE_APP_ID` | Cashfree client id (server-only) |
| `CASHFREE_SECRET_KEY` | Cashfree client secret (server-only, never `NEXT_PUBLIC_*`) |
| `CASHFREE_ENV` | `sandbox` or `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (safe for browser; read server-side) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (safe client-side; not used by current server code) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, bypasses RLS) |
| `RESEND_API_KEY` | Resend API key (server-only) |
| `RESEND_FROM` | Verified sender, e.g. `Founder Vault <deliveries@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL` | Base URL for access links (defaults to the production domain) |

## Supabase setup

Run `supabase/migrations/0001_create_purchases.sql` and
`supabase/migrations/0002_founder_vault_storage.sql` in your Supabase project
(SQL Editor, or `supabase db push`).

- `0001` creates the `purchases` table with a **unique constraint on `order_id`**
  and `access_token`, plus RLS enabled with no policies (public role cannot read
  purchases; only the server can).
- `0002` creates the **private** `founder-vault` Storage bucket and adds an
  `updated_at` trigger. The bucket has no read policies, so its files are
  reachable only through server-minted signed URLs.

Upload the product files and folders (loose files, no ZIPs) into the bucket
after it exists. See `docs/supabase-setup.md` for the exact paths and the
`VAULT_CATEGORIES` mapping in `src/lib/storage.ts`.

## Cashfree dashboard configuration

**Webhook URL (production):**
```
https://vault.entrepreneursjantaparty.com/api/webhooks/cashfree
```

Dashboard: **Payment Gateway → Developers → Webhooks → Add Webhook Endpoint**.
Select API version **2025-01-01**.

**Events to enable** (current Cashfree event names, v2025-01-01):

- `PAYMENT_SUCCESS_WEBHOOK`
- `PAYMENT_FAILED_WEBHOOK`
- `PAYMENT_USER_DROPPED_WEBHOOK`
- `REFUND_STATUS_WEBHOOK`

The handler acknowledges settlement / instrument / dispute events without
fulfilling anything.

The endpoint is also registered per-order via `order_meta.notify_url`, so every
order gets webhooks even before dashboard config.

## Local development & testing

Cashfree only delivers webhooks to a **public HTTPS** endpoint. Use a temporary
tunnel:

```bash
ngrok http 3000
# or:  cloudflared tunnel --url http://localhost:3000
```

1. Run the app: `npm run dev`
2. Copy the tunnel URL, e.g. `https://abcd.ngrok.io`
3. Set `NEXT_PUBLIC_SITE_URL=https://abcd.ngrok.io` in `.env.local` so email
   access links point at your tunnel.
4. In the Cashfree dashboard (sandbox), point the webhook endpoint at
   `https://abcd.ngrok.io/api/webhooks/cashfree` and send a **Test webhook**
   (signature headers are included in the test).
5. Complete a real sandbox checkout with the test card
   `4111 1111 1111 1111` (expiry `12/29`, CVV `123`, OTP `111000`) or UPI
   `testsuccess@gocash`.
6. Confirm in the server log:
   - `Cashfree webhook processed { status: "PAID", email_sent: true }`
   - the Resend email arrives at the customer address.

Verify idempotency: re-POST the same webhook payload (same signature) — the
`email_sent_at` claim guarantees no second email and no duplicate purchase row.

## Retry & idempotency

- Cashfree retries non-200 responses: 3 retries at ~2, 10, and 30 minutes.
- Fulfillment is idempotent:
  - `order_id` is unique in Supabase (upsert).
  - The email slot is claimed atomically
    (`UPDATE … SET email_sent_at = now() WHERE email_sent_at IS NULL`).
    Only the winning delivery sends the email; if the send fails the claim is
    released so a retry can take over.
  - Refund events (`REFUND_STATUS_WEBHOOK` + `refund_status: SUCCESS`) mark the
    purchase `REFUNDED`; the `/vault` page then stops honoring that token and no
    new access is granted.

## Security

- Secret keys are server-side only (`CASHFREE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `RESEND_API_KEY`). Nothing secret is bundled to the client.
- Webhooks are verified with Cashfree's official signature verification
  (`PGVerifyWebhookSignature`) against the **raw** body using
  `x-webhook-signature` + `x-webhook-timestamp`. Unverified webhooks get `400`.
- Orders are re-verified server-to-server (`GET /pg/orders/{order_id}`) and only
  fulfilled on `PAID` + exact ₹149 INR.
- Vault access is per-purchase token; `/vault` is `noindex` and dynamic.
- All files live in the **private** `founder-vault` bucket. No public URL exists;
  every download goes through a short-lived signed URL (5 min) minted by
  `/api/vault/download` only after the token maps to a PAID purchase. An
  invalid/expired token or a refunded purchase gets no link.
- `purchases` has RLS enabled with no policies.

## Go-live checklist (still manual)

1. Add the environment variables in Vercel (production).
2. Run both Supabase migrations and upload the product files/folders to the
   private `founder-vault` bucket (see `docs/supabase-setup.md`).
3. Verify your Resend sending domain and set `RESEND_FROM`.
4. Complete KYC, generate `PROD_` keys, whitelist the domain
   (`vault.entrepreneursjantaparty.com`) in the production Cashfree dashboard.
5. Register the webhook URL + events in the production dashboard.
6. Set `CASHFREE_ENV=production`.
7. Test one real ₹149 purchase end-to-end (payment → email → `/vault` → downloads).
