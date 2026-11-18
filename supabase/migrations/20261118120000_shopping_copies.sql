-- Immutable display-only shopping snapshots, addressed by a random 128-bit sharing code.
-- Only the Edge Function can access these rows. There is no public listing or mutation API.
create table public.shopping_copies (
  code text primary key check (code ~ '^[A-Za-z0-9_-]{22}$'),
  snapshot jsonb not null check (
    jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 140000
  ),
  created_at timestamptz not null default now()
);

alter table public.shopping_copies enable row level security;
revoke all on public.shopping_copies from public, anon, authenticated;
grant select, insert on public.shopping_copies to service_role;
