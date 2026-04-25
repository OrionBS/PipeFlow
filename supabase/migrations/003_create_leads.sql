-- =============================================================================
-- 003_create_leads.sql
-- =============================================================================

create table public.leads (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces (id) on delete cascade,
  name         text        not null,
  email        text        not null,
  phone        text,
  company      text,
  role         text,
  status       text        not null default 'new'
                check (status in ('new', 'contacted', 'qualified', 'unqualified', 'converted')),
  owner_id     uuid        references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Trigger: mantém updated_at sincronizado automaticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create index on public.leads (workspace_id);
create index on public.leads (owner_id);
create index on public.leads (workspace_id, status);
