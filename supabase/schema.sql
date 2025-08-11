-- Schema for Emotion Tracker (Supabase / PostgreSQL)
-- Run in Supabase SQL editor or via migrations

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  entry_date date not null,
  said_no_count integer not null check (said_no_count >= 0),
  asked_help_count integer not null check (asked_help_count >= 0),
  chose_for_joy_count integer not null check (chose_for_joy_count >= 0),
  took_rest boolean not null default false,
  must_do_tasks text[] not null check (cardinality(must_do_tasks) = 3),
  wanted_but_skipped_tasks text[] not null check (cardinality(wanted_but_skipped_tasks) = 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- New fields
alter table if exists public.daily_entries
  add column if not exists did_cook boolean not null default false;

alter table if exists public.daily_entries
  add column if not exists did_exercise boolean not null default false;

-- Unique per user per day (null user_id allows duplicates, OK for single-user v1)
create unique index if not exists daily_entries_user_day_uniq
  on public.daily_entries (user_id, entry_date);

-- Ensure single entry per day for anonymous (user_id is null)
create unique index if not exists daily_entries_day_unique_public
  on public.daily_entries (entry_date)
  where user_id is null;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

drop trigger if exists set_updated_at on public.daily_entries;
create trigger set_updated_at
before update on public.daily_entries
for each row execute procedure public.set_updated_at();

alter table public.daily_entries enable row level security;

-- Select own rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_select_own'
  ) then
    create policy "daily_entries_select_own"
      on public.daily_entries for select
      using (auth.uid() is not null and user_id = auth.uid());
  end if;
end$$;

-- Insert own rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_insert_own'
  ) then
    create policy "daily_entries_insert_own"
      on public.daily_entries for insert
      with check (auth.uid() is not null and user_id = auth.uid());
  end if;
end$$;

-- Update own rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_update_own'
  ) then
    create policy "daily_entries_update_own"
      on public.daily_entries for update
      using (auth.uid() is not null and user_id = auth.uid())
      with check (auth.uid() is not null and user_id = auth.uid());
  end if;
end$$;

-- Delete own rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_delete_own'
  ) then
    create policy "daily_entries_delete_own"
      on public.daily_entries for delete
      using (auth.uid() is not null and user_id = auth.uid());
  end if;
end$$;

-- (Optional for v1) Public/anonymous access for rows with NULL user_id only
-- These policies allow unauthenticated (anon) clients to insert/select
-- rows where user_id IS NULL. Remove or disable in production when Auth is enabled.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_select_public_null_user'
  ) then
    create policy "daily_entries_select_public_null_user"
      on public.daily_entries for select
      to anon
      using (user_id is null);
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_insert_public_null_user'
  ) then
    create policy "daily_entries_insert_public_null_user"
      on public.daily_entries for insert
      to anon
      with check (user_id is null);
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_delete_public_null_user'
  ) then
    create policy "daily_entries_delete_public_null_user"
      on public.daily_entries for delete
      to anon
      using (user_id is null);
  end if;
end$$;

-- Update for anonymous null user rows
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_entries' and policyname = 'daily_entries_update_public_null_user'
  ) then
    create policy "daily_entries_update_public_null_user"
      on public.daily_entries for update
      to anon
      using (user_id is null)
      with check (user_id is null);
  end if;
end$$;

-- Notes:
-- - For v1 single-user without Auth, set a fixed user_id in the client or remove RLS and user_id temporarily.
-- - For production, prefer Auth + RLS to isolate per-user data.
