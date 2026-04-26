-- =============================================================================
-- 011_best_practices_fixes.sql
-- Aplica correções de segurança e performance identificadas na revisão M6.
--
-- Correções:
-- 1. set_updated_at() — adiciona set search_path = '' (previne search-path hijack)
-- 2. my_workspace_ids() — cacheia (select auth.uid()) em vez de auth.uid() por linha
-- 3. Policies de UPDATE nas tabelas principais adicionam WITH CHECK explícito
-- 4. workspaces INSERT policy — faltava (createWorkspace via RPC é service_role,
--    mas usuários pro poderão criar workspaces adicionais via client)
-- 5. Cria tabela invites + RLS (necessário para M10 — previne bloqueio de migração)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. set_updated_at — search_path seguro
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. my_workspace_ids — auth.uid() cacheado para evitar chamada por linha
-- ---------------------------------------------------------------------------
create or replace function public.my_workspace_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select workspace_id
  from   public.workspace_members
  where  user_id = (select auth.uid())
  and    status  = 'active'
$$;

-- Função auxiliar para checagem de admin — usada nas policies de update/delete
create or replace function public.is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
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
-- 3. Recriar policies de UPDATE com WITH CHECK explícito
--    (sem WITH CHECK o Postgres aceita silenciosamente qualquer valor)
-- ---------------------------------------------------------------------------

-- workspaces
drop policy if exists "workspaces: admins can update" on public.workspaces;
create policy "workspaces: admins can update"
  on public.workspaces
  as permissive for update
  to authenticated
  using  ((select public.is_workspace_admin(id)))
  with check ((select public.is_workspace_admin(id)));

-- leads
drop policy if exists "leads: members can update" on public.leads;
create policy "leads: members can update"
  on public.leads
  as permissive for update
  to authenticated
  using      (workspace_id in (select public.my_workspace_ids()))
  with check (workspace_id in (select public.my_workspace_ids()));

-- deals
drop policy if exists "deals: members can update" on public.deals;
create policy "deals: members can update"
  on public.deals
  as permissive for update
  to authenticated
  using      (workspace_id in (select public.my_workspace_ids()))
  with check (workspace_id in (select public.my_workspace_ids()));

-- activities (author can update)
drop policy if exists "activities: author can update" on public.activities;
create policy "activities: author can update"
  on public.activities
  as permissive for update
  to authenticated
  using (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  )
  with check (
    workspace_id in (select public.my_workspace_ids())
    and author_id = (select auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 4. Tabela invites — criada aqui para não bloquear M10
-- ---------------------------------------------------------------------------
create table if not exists public.invites (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces (id) on delete cascade,
  email        text        not null,
  token        text        not null unique default encode(gen_random_bytes(32), 'hex'),
  role         text        not null default 'member' check (role in ('admin', 'member')),
  invited_by   uuid        references auth.users (id) on delete set null,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists invites_workspace_id_idx on public.invites (workspace_id);
create index if not exists invites_token_idx        on public.invites (token);
create index if not exists invites_email_idx        on public.invites (email);

alter table public.invites enable row level security;

-- Admins do workspace gerenciam convites
drop policy if exists "invites: admins can select"  on public.invites;
drop policy if exists "invites: admins can insert"  on public.invites;
drop policy if exists "invites: admins can delete"  on public.invites;
-- Leitura pública por token (para aceite de convite sem autenticação)
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

-- Permite leitura do convite pelo token sem autenticação (para a página /invite/[token])
create policy "invites: public read by token"
  on public.invites as permissive for select to anon
  using (accepted_at is null and expires_at > now());
