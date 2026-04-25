-- =============================================================================
-- 004_create_deals.sql
-- =============================================================================

create table public.deals (
  id           uuid           primary key default gen_random_uuid(),
  workspace_id uuid           not null references public.workspaces (id) on delete cascade,
  lead_id      uuid           not null references public.leads (id) on delete cascade,
  title        text           not null,
  value        numeric(12, 2) not null default 0,
  stage        text           not null default 'new_lead'
                check (stage in (
                  'new_lead', 'contacted', 'proposal_sent',
                  'negotiation', 'closed_won', 'closed_lost'
                )),
  position     integer        not null default 0,
  owner_id     uuid           references auth.users (id) on delete set null,
  deadline     date,
  created_at   timestamptz    not null default now(),
  updated_at   timestamptz    not null default now()
);

create trigger deals_set_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

create index on public.deals (workspace_id);
create index on public.deals (lead_id);
create index on public.deals (owner_id);
-- Índice composto para ordenação Kanban: busca por stage + posição em um único scan
create index on public.deals (workspace_id, stage, position);
