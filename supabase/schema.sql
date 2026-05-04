-- =============================================================================
-- PipeFlow CRM — Schema Completo
-- Arquivo único, idempotente, pronto para colar no Supabase Studio → SQL Editor.
-- Ordem: extensões → tipos → tabelas → triggers → índices → RLS → funções → RPC
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensões
-- ---------------------------------------------------------------------------

create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

-- workspaces ------------------------------------------------------------------

create table if not exists public.workspaces (
  id                     uuid        primary key default gen_random_uuid(),
  name                   text        not null,
  slug                   text        not null unique,
  plan                   text        not null default 'free'
                           check (plan in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists workspaces_slug_idx on public.workspaces (slug);

-- workspace_members -----------------------------------------------------------

create table if not exists public.workspace_members (
  id             uuid        primary key default gen_random_uuid(),
  workspace_id   uuid        not null references public.workspaces (id) on delete cascade,
  user_id        uuid        references auth.users (id) on delete set null,
  role           text        not null default 'member'
                   check (role in ('admin', 'member')),
  invited_email  text,
  status         text        not null default 'invited'
                   check (status in ('active', 'invited', 'removed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint workspace_members_unique unique (workspace_id, user_id)
);

create index if not exists workspace_members_workspace_id_idx
  on public.workspace_members (workspace_id);
create index if not exists workspace_members_user_id_idx
  on public.workspace_members (user_id);
create index if not exists workspace_members_workspace_status_idx
  on public.workspace_members (workspace_id, status);

-- leads -----------------------------------------------------------------------

create table if not exists public.leads (
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

create index if not exists leads_workspace_id_idx
  on public.leads (workspace_id);
create index if not exists leads_owner_id_idx
  on public.leads (owner_id);
create index if not exists leads_workspace_status_idx
  on public.leads (workspace_id, status);
create index if not exists leads_workspace_email_idx
  on public.leads (workspace_id, email);
create index if not exists leads_name_trgm_idx
  on public.leads using gin (name gin_trgm_ops);
create index if not exists leads_company_trgm_idx
  on public.leads using gin (company gin_trgm_ops);

-- deals -----------------------------------------------------------------------

create table if not exists public.deals (
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

create index if not exists deals_workspace_id_idx
  on public.deals (workspace_id);
create index if not exists deals_lead_id_idx
  on public.deals (lead_id);
create index if not exists deals_owner_id_idx
  on public.deals (owner_id);
create index if not exists deals_workspace_stage_position_idx
  on public.deals (workspace_id, stage, position);
create index if not exists deals_title_trgm_idx
  on public.deals using gin (title gin_trgm_ops);

-- activities ------------------------------------------------------------------
-- Coluna 'date' (renomeada de occurred_at na migração 013).
-- Se estiver criando do zero use 'date' diretamente.

create table if not exists public.activities (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces (id) on delete cascade,
  lead_id      uuid        not null references public.leads (id) on delete cascade,
  type         text        not null check (type in ('call', 'email', 'meeting', 'note')),
  description  text        not null,
  author_id    uuid        not null references auth.users (id) on delete cascade,
  date         timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists activities_workspace_id_idx
  on public.activities (workspace_id);
create index if not exists activities_lead_id_date_idx
  on public.activities (lead_id, date desc);
create index if not exists activities_author_id_idx
  on public.activities (author_id);

-- subscriptions ---------------------------------------------------------------

create table if not exists public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  workspace_id            uuid        not null references public.workspaces (id) on delete cascade,
  stripe_customer_id      text        not null,
  stripe_subscription_id  text        not null,
  stripe_price_id         text        not null,
  status                  text        not null
                            check (status in (
                              'active', 'canceled', 'incomplete',
                              'incomplete_expired', 'past_due',
                              'trialing', 'unpaid'
                            )),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean     not null default false,
  canceled_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint subscriptions_stripe_customer_unique
    unique (stripe_customer_id),
  constraint subscriptions_stripe_subscription_unique
    unique (stripe_subscription_id)
);

create index if not exists subscriptions_workspace_id_idx
  on public.subscriptions (workspace_id);
create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);
create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

-- invites ---------------------------------------------------------------------

create table if not exists public.invites (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces (id) on delete cascade,
  email        text        not null,
  token        text        not null unique default encode(gen_random_bytes(32), 'hex'),
  role         text        not null default 'member'
                 check (role in ('admin', 'member')),
  invited_by   uuid        references auth.users (id) on delete set null,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists invites_workspace_id_idx on public.invites (workspace_id);
create index if not exists invites_token_idx        on public.invites (token);
create index if not exists invites_email_idx        on public.invites (email);

-- ---------------------------------------------------------------------------
-- Trigger: set_updated_at
-- SECURITY INVOKER + search_path = '' previne privilege escalation e
-- search-path hijacking.
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplica o trigger em cada tabela com updated_at

create or replace trigger workspaces_set_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

create or replace trigger workspace_members_set_updated_at
  before update on public.workspace_members
  for each row execute function public.set_updated_at();

create or replace trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create or replace trigger deals_set_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

create or replace trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Funções auxiliares de RLS
-- SECURITY INVOKER garante que auth.uid() resolve o usuário da requisição.
-- ---------------------------------------------------------------------------

create or replace function public.my_workspace_ids()
returns setof uuid
language sql
stable
security invoker
set search_path = ''
as $$
  select workspace_id
  from   public.workspace_members
  where  user_id = (select auth.uid())
  and    status  = 'active'
$$;

create or replace function public.is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from   public.workspace_members
    where  workspace_id = p_workspace_id
    and    user_id      = (select auth.uid())
    and    role         = 'admin'
    and    status       = 'active'
  )
$$;

-- ---------------------------------------------------------------------------
-- RPC: criar workspace + admin em transação atômica
-- Chamada via service_role no onboarding; SECURITY DEFINER necessário aqui
-- para contornar a ausência de INSERT policy em workspaces para o anon role.
-- ---------------------------------------------------------------------------

create or replace function public.create_workspace_with_admin(
  p_name     text,
  p_slug     text,
  p_user_id  uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace_id uuid;
begin
  insert into public.workspaces (name, slug, plan)
  values (p_name, p_slug, 'free')
  returning id into v_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role, status)
  values (v_workspace_id, p_user_id, 'admin', 'active');

  return v_workspace_id;
end;
$$;

-- RPC: perfis dos membros ativos de um workspace (leitura segura de auth.users)

create or replace function public.profiles_for_workspace(p_workspace_id uuid)
returns table (id uuid, full_name text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    u.id,
    u.raw_user_meta_data->>'full_name' as full_name,
    u.email
  from auth.users u
  inner join public.workspace_members wm
    on  wm.user_id      = u.id
    and wm.workspace_id = p_workspace_id
    and wm.status       = 'active'
$$;

grant execute on function public.profiles_for_workspace(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads             enable row level security;
alter table public.deals             enable row level security;
alter table public.activities        enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.invites           enable row level security;

-- workspaces -----------------------------------------------------------------

drop policy if exists "workspaces: members can select" on public.workspaces;
drop policy if exists "workspaces: admins can update"  on public.workspaces;
drop policy if exists "workspaces: admins can delete"  on public.workspaces;

create policy "workspaces: members can select"
  on public.workspaces
  as permissive for select
  to authenticated
  using (id in (select public.my_workspace_ids()));

create policy "workspaces: admins can update"
  on public.workspaces
  as permissive for update
  to authenticated
  using      ((select public.is_workspace_admin(id)))
  with check ((select public.is_workspace_admin(id)));

create policy "workspaces: admins can delete"
  on public.workspaces
  as permissive for delete
  to authenticated
  using ((select public.is_workspace_admin(id)));

-- workspace_members ----------------------------------------------------------
-- SELECT: usuário vê as suas próprias linhas (OR) ou linhas do workspace
-- em que já é membro ativo — evita deadlock circular no onboarding.

drop policy if exists "members: active members can select" on public.workspace_members;
drop policy if exists "members: admins can insert"         on public.workspace_members;
drop policy if exists "members: admins can update"         on public.workspace_members;
drop policy if exists "members: admins can delete"         on public.workspace_members;
drop policy if exists "members: user can accept invite"    on public.workspace_members;

create policy "members: active members can select"
  on public.workspace_members
  as permissive for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or workspace_id in (select public.my_workspace_ids())
  );

create policy "members: admins can insert"
  on public.workspace_members
  as permissive for insert
  to authenticated
  with check ((select public.is_workspace_admin(workspace_id)));

create policy "members: admins can update"
  on public.workspace_members
  as permissive for update
  to authenticated
  using      ((select public.is_workspace_admin(workspace_id)))
  with check ((select public.is_workspace_admin(workspace_id)));

create policy "members: admins can delete"
  on public.workspace_members
  as permissive for delete
  to authenticated
  using ((select public.is_workspace_admin(workspace_id)));

-- Membro aceita próprio convite: só pode mudar status, role imutável
create policy "members: user can accept invite"
  on public.workspace_members
  as permissive for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    role = (
      select role
      from   public.workspace_members
      where  user_id      = (select auth.uid())
      and    workspace_id = workspace_members.workspace_id
    )
  );

-- leads ----------------------------------------------------------------------

drop policy if exists "leads: members can select" on public.leads;
drop policy if exists "leads: members can insert" on public.leads;
drop policy if exists "leads: members can update" on public.leads;
drop policy if exists "leads: members can delete" on public.leads;

create policy "leads: members can select"
  on public.leads as permissive for select to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can insert"
  on public.leads as permissive for insert to authenticated
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can update"
  on public.leads as permissive for update to authenticated
  using      (workspace_id in (select public.my_workspace_ids()))
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can delete"
  on public.leads as permissive for delete to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

-- deals ----------------------------------------------------------------------

drop policy if exists "deals: members can select" on public.deals;
drop policy if exists "deals: members can insert" on public.deals;
drop policy if exists "deals: members can update" on public.deals;
drop policy if exists "deals: members can delete" on public.deals;

create policy "deals: members can select"
  on public.deals as permissive for select to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can insert"
  on public.deals as permissive for insert to authenticated
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can update"
  on public.deals as permissive for update to authenticated
  using      (workspace_id in (select public.my_workspace_ids()))
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can delete"
  on public.deals as permissive for delete to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

-- activities -----------------------------------------------------------------

drop policy if exists "activities: members can select" on public.activities;
drop policy if exists "activities: members can insert" on public.activities;
drop policy if exists "activities: author can update"  on public.activities;
drop policy if exists "activities: author can delete"  on public.activities;

create policy "activities: members can select"
  on public.activities as permissive for select to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

create policy "activities: members can insert"
  on public.activities as permissive for insert to authenticated
  with check (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  );

create policy "activities: author can update"
  on public.activities as permissive for update to authenticated
  using (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  )
  with check (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  );

create policy "activities: author can delete"
  on public.activities as permissive for delete to authenticated
  using (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  );

-- subscriptions — leitura apenas por admins; escrita somente via service_role

drop policy if exists "subscriptions: admins can select" on public.subscriptions;

create policy "subscriptions: admins can select"
  on public.subscriptions as permissive for select to authenticated
  using ((select public.is_workspace_admin(workspace_id)));

-- invites — admins gerenciam; anon pode ler pelo token para aceitar convite

drop policy if exists "invites: admins can select"    on public.invites;
drop policy if exists "invites: admins can insert"    on public.invites;
drop policy if exists "invites: admins can delete"    on public.invites;
drop policy if exists "invites: public read by token" on public.invites;

create policy "invites: admins can select"
  on public.invites as permissive for select to authenticated
  using ((select public.is_workspace_admin(workspace_id)));

create policy "invites: admins can insert"
  on public.invites as permissive for insert to authenticated
  with check ((select public.is_workspace_admin(workspace_id)));

create policy "invites: admins can delete"
  on public.invites as permissive for delete to authenticated
  using ((select public.is_workspace_admin(workspace_id)));

create policy "invites: public read by token"
  on public.invites as permissive for select to anon
  using (accepted_at is null and expires_at > now());
