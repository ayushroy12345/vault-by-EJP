# Supabase Setup — Founder Vault

Founder Vault uses Supabase for two things only:

1. **Database** — the `purchases` table (customers, payments, access tokens).
2. **Storage** — a **private** bucket (`founder-vault`) holding the product as
   **loose files and folders** (no ZIPs) grouped into seven categories.
   Customers can only download a file after Cashfree confirms a **PAID**
   payment, via a short-lived signed URL minted by our server for that specific
   file. Folders are browsable in a drill-down page; each file downloads
   individually.

There is **no Supabase Auth** in this app. All privileged access is server-side
(service role); customers never touch Supabase directly.

---

## 1. Environment variables

Add these to your local `.env.local`, Vercel Production, and Vercel Preview
(if needed). Placeholders only in `.env.example` — never commit real values.

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe (client or server) | Project URL, e.g. `https://tkohytsmztvxiyaibnzm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe (client) | `sb_publishable_…` from Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | Never `NEXT_PUBLIC_*`, never bundled to the browser. Bypasses RLS. |

Source: **Supabase Dashboard → Project Settings → API**.

## 2. Database — run the migrations

Open **Supabase Dashboard → SQL Editor** and run, in order (or use
`supabase db push` if the CLI is linked to this project):

1. `supabase/migrations/0001_create_purchases.sql` — creates the `purchases`
   table: `id`, `order_id` (**UNIQUE**), `payment_id`, `customer_name`,
   `customer_email`, `customer_phone`, `amount`, `currency`, `payment_status`,
   `product`, `access_token`, `fulfilled_at`, `email_sent_at`, `created_at`,
   `updated_at`. RLS is enabled with **no policies** — anonymous users cannot
   read purchases.
2. `supabase/migrations/0002_founder_vault_storage.sql` — creates the private
   `founder-vault` Storage bucket and an `updated_at` trigger.

Both migrations are idempotent — safe to re-run.

## 3. Storage — upload the product files

The files are uploaded manually (never to `public/`, GitHub, or Next.js static
assets). Do **not** upload until migration `0002` has created the bucket.

1. Open **Supabase** → your project (`tkohytsmztvxiyaibnzm`).
2. Open **Storage** in the left sidebar.
3. Create/open the private bucket **`founder-vault`**:
   - New bucket → name `founder-vault` → **Public bucket: OFF**.
   - If it already exists, open it and confirm it is **not** public.
4. Upload the files as **loose files and folders** (preserving folder structure),
   NOT ZIPs. The app maps categories to exact storage paths via
   `VAULT_CATEGORIES` in `src/lib/storage.ts`:

   | Storage location | Product category |
   |---|---|
   | Root files (investor/VC lists, see `storage.ts` `01-investor-vc-resources.files`) | Investor & VC Resources |
   | `founder-vault/Funded Startups Pitch decks Google drive link.rtf` + `founder-vault/Pitch Deck Templates/` | Pitch Deck Resources |
   | `founder-vault/Business Plan Templates/` | Business Planning |
   | `founder-vault/Financial Projections/` + `founder-vault/Startup Seed Funding Template/` | Financial Resources |
   | `founder-vault/Agreements templates/` | Legal Resources |
   | `founder-vault/Business Docs Pro Collection (1000+ templates)/` | Business Docs Pro |
   | `founder-vault/Startup Resources/` | Founder Resources |

   Folder contents are listed automatically by the server (browse page supports
   unlimited nesting). Empty folders show "No files here yet."
5. Ensure every file is **private**:
   - Open a file → **details** → no public URL is shown, and
     `https://…supabase.co/storage/v1/object/public/founder-vault/…` must **not**
     work. Public access is only possible via server-minted signed URLs.

The server references these exact paths via `VAULT_CATEGORIES` in
`src/lib/storage.ts` (each category has `files[]` for root files and `roots[]`
for folders). If a file/folder is renamed or a category changes, update that
constant.

## 4. Customer access flow

```
Customer receives email
        ↓
Clicks ACCESS FOUNDER VAULT
        ↓
/vault?token=…
        ↓
Server verifies token (RLS-protected purchases lookup)
        ↓
payment_status = PAID?   ← no → "invalid or expired" (no leak about others)
        ↓ yes
Show 7 category sections (files + folders each)
        ↓
Customer clicks a file
        ↓
/api/vault/download?token=…&path=…  (token + PAID re-verified)
        ↓
Mint fresh 5-minute signed URL for that one file
        ↓
Redirect → file downloads

Customer clicks a folder → /vault/browse?token=…&path=… (drill-down,
unlimited nesting; each file download goes through the same download route)
```

- Each click generates a **fresh** short-lived signed URL server-side
  (`/api/vault/download` → `src/lib/storage.ts`), never stored in the DB, and
  expiring after **300 seconds**.
- The download route only accepts paths allowed by `isVaultPathAllowed`
  (`src/lib/storage.ts`): an explicit root file, or anything inside a
  configured category folder. Path traversal (`..`) is rejected.
- Refunded purchases are set to `REFUNDED` by the webhook; `/vault` and the
  download route then stop granting access (only `PAID` unlocks it).
- The `/success` page never decides success itself — it polls
  `/api/payments/verify`, which re-checks the order with Cashfree.

## 5. Security checks

- The category files and folders are **not** publicly accessible (private
  bucket, no public-URL path, signed URLs only).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only; the publishable key is the only
  key ever available client-side, and it can't read purchases (RLS) or the
  bucket (no Storage policies).
- Anonymous users cannot query `purchases`.
- Invalid tokens, unpaid orders, and refunded purchases get no download link.
- Duplicate webhooks are idempotent (unique `order_id` + `email_sent_at` claim).
- No secrets are committed to Git (`.env*` is gitignored).

## 6. Local testing checklist

Requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, plus the Cashfree sandbox keys and
`RESEND_API_KEY`.

1. Supabase connection — `npm run dev` starts without env errors; `/` renders.
2. Migrations applied — table `purchases` and bucket `founder-vault` exist.
3. Product files uploaded (see section 3).
4. Sandbox payment (`4111 1111 1111 1111`, `12/29`, `123`, OTP `111000`).
5. Webhook received → purchase row upserted, `payment_status = PAID`,
   `access_token` present, `fulfilled_at`/`email_sent_at` set.
6. Fulfillment email arrives with the `/vault?token=…` link.
7. `/vault?token=…` (valid token, PAID) renders **seven category sections** with
   their files and folders; clicking a file redirects to a signed URL and
   downloads it, and clicking a folder opens the browse drill-down.
8. Re-POST the same webhook — no duplicate row, no second email.
9. Invalid token → "invalid or expired".
10. Refund webhook → purchase becomes `REFUNDED`; the same `/vault` link stops
    granting access.
