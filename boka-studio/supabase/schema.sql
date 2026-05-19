-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/qmzjdtkdzmkcrmtulwuv/sql/new
-- Enable Email OTP: Authentication → Providers → Email → Enable Email OTP

-- Profiles (role stored in app_metadata via Auth hooks, or use this table)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_read_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Custom orders (fallback when API unavailable; primary store is BokaMarket API)
create table if not exists public.custom_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  customer_email text not null,
  customer_name text not null,
  builder jsonb not null default '{}',
  live_summary text not null default '',
  inspiration_image_url text,
  sketch_data_url text,
  customer_notes text default '',
  status text not null default 'pending_review',
  quoted_price numeric,
  quote_message text,
  quote_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.custom_orders enable row level security;

create policy "customers_read_own_custom_orders"
  on public.custom_orders for select
  using (auth.jwt() ->> 'email' = customer_email);

create policy "customers_insert_own_custom_orders"
  on public.custom_orders for insert
  with check (auth.jwt() ->> 'email' = customer_email);

-- Storage bucket for inspiration uploads (optional)
insert into storage.buckets (id, name, public)
values ('inspiration', 'inspiration', true)
on conflict (id) do nothing;
