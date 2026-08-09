-- Founder Vault: private Storage bucket + purchases.updated_at trigger.
-- Run AFTER 0001 in your Supabase project (SQL Editor) or via `supabase db push`.
-- Idempotent: safe to run more than once.

-- Private Storage bucket for the seven product category files (one ZIP per
-- category, uploaded manually at the bucket root). `public = false` keeps every
-- object private; the only way to download is a short-lived signed URL issued
-- server-side after a PAID purchase is verified.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'founder-vault',
  'founder-vault',
  false,
  1073741824, -- 1 GiB safety cap; adjust if the ZIP is larger
  null
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects RLS is enabled by default. We intentionally add NO policies
-- for the anon/authenticated roles: only the service role (which bypasses RLS)
-- can list/read, and customers receive temporary signed URLs. An even more
-- restrictive posture can be added later if a client (anon/publishable) key is
-- ever used against Storage — it must NOT be able to list or read this bucket.

-- Keep purchases.updated_at current on every write.
create or replace function public.founder_vault_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at
before update on public.purchases
for each row execute function public.founder_vault_set_updated_at();
