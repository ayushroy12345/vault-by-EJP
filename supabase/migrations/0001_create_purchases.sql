-- Founder Vault: purchases / orders
-- Run this in your Supabase project (SQL Editor) or via `supabase db push`.
-- Idempotent: safe to run more than once.

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  payment_id text,
  customer_name text,
  customer_email text not null,
  customer_phone text,
  amount numeric not null default 149,
  currency text not null default 'INR',
  payment_status text not null default 'PENDING',
  product text not null default 'Founder Vault',
  access_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  email_sent_at timestamptz
);

create index if not exists purchases_customer_email_idx on public.purchases (customer_email);
create index if not exists purchases_payment_status_idx on public.purchases (payment_status);

-- RLS is ON with no policies: the public/anonymous role cannot read purchases.
-- Only the server (service role, which bypasses RLS) can access this table.
alter table public.purchases enable row level security;
