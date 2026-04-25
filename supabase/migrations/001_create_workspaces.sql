-- =============================================================================
-- 001_create_workspaces.sql
-- =============================================================================

create type public.plan_type as enum ('free', 'pro');

create table public.workspaces (
  id                     uuid        primary key default gen_random_uuid(),
  name                   text        not null,
  slug                   text        not null unique,
  plan                   text        not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index on public.workspaces (slug);
