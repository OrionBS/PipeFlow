-- =============================================================================
-- 005_create_activities.sql
-- =============================================================================

create table public.activities (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces (id) on delete cascade,
  lead_id      uuid        not null references public.leads (id) on delete cascade,
  type         text        not null check (type in ('call', 'email', 'meeting', 'note')),
  description  text        not null,
  author_id    uuid        not null references auth.users (id) on delete cascade,
  occurred_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index on public.activities (workspace_id);
-- Índice composto para timeline: busca por lead ordenada por data decrescente
create index on public.activities (lead_id, occurred_at desc);
create index on public.activities (author_id);
