-- =============================================================================
-- 007_rls_policies.sql — v2
-- Aplicar após todos os arquivos 001–006. Idempotente (drop + recreate).
-- v2: TO authenticated em todas as policies (anon role não avalia mais as
--     políticas), SET search_path = '' nas funções SECURITY DEFINER
--     (previne search-path hijack).
-- =============================================================================

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads             enable row level security;
alter table public.deals             enable row level security;
alter table public.activities        enable row level security;
alter table public.subscriptions     enable row level security;

-- ---------------------------------------------------------------------------
-- Função auxiliar — retorna workspace_ids do usuário autenticado.
-- set search_path = '' força referências schema-qualified, bloqueando hijack.
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
  where  user_id = auth.uid()
  and    status  = 'active'
$$;

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------

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
  using (
    id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );

create policy "workspaces: admins can delete"
  on public.workspaces
  as permissive for delete
  to authenticated
  using (
    id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );

-- ---------------------------------------------------------------------------
-- workspace_members
-- ---------------------------------------------------------------------------

drop policy if exists "members: active members can select" on public.workspace_members;
drop policy if exists "members: admins can insert"         on public.workspace_members;
drop policy if exists "members: admins can update"         on public.workspace_members;
drop policy if exists "members: admins can delete"         on public.workspace_members;
drop policy if exists "members: user can update own row"   on public.workspace_members;
drop policy if exists "members: user can accept invite"    on public.workspace_members;

create policy "members: active members can select"
  on public.workspace_members
  as permissive for select
  to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

create policy "members: admins can insert"
  on public.workspace_members
  as permissive for insert
  to authenticated
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );

create policy "members: admins can update"
  on public.workspace_members
  as permissive for update
  to authenticated
  using (
    workspace_id in (
      select workspace_id from public.workspace_members m2
      where  m2.user_id = auth.uid()
      and    m2.role    = 'admin'
      and    m2.status  = 'active'
    )
  );

create policy "members: admins can delete"
  on public.workspace_members
  as permissive for delete
  to authenticated
  using (
    workspace_id in (
      select workspace_id from public.workspace_members m2
      where  m2.user_id = auth.uid()
      and    m2.role    = 'admin'
      and    m2.status  = 'active'
    )
  );

-- Restringe update da própria linha: role não pode mudar (previne escalação)
create policy "members: user can accept invite"
  on public.workspace_members
  as permissive for update
  to authenticated
  using (user_id = auth.uid())
  with check (
    role = (
      select role from public.workspace_members
      where  user_id      = auth.uid()
      and    workspace_id = workspace_members.workspace_id
    )
  );

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------

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
  using (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can delete"
  on public.leads as permissive for delete to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

-- ---------------------------------------------------------------------------
-- deals
-- ---------------------------------------------------------------------------

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
  using (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can delete"
  on public.deals as permissive for delete to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

-- ---------------------------------------------------------------------------
-- activities
-- ---------------------------------------------------------------------------

drop policy if exists "activities: members can select"  on public.activities;
drop policy if exists "activities: members can insert"  on public.activities;
drop policy if exists "activities: author can update"   on public.activities;
drop policy if exists "activities: author can delete"   on public.activities;

create policy "activities: members can select"
  on public.activities as permissive for select to authenticated
  using (workspace_id in (select public.my_workspace_ids()));

create policy "activities: members can insert"
  on public.activities as permissive for insert to authenticated
  with check (
    workspace_id in (select public.my_workspace_ids())
    and author_id = auth.uid()
  );

create policy "activities: author can update"
  on public.activities as permissive for update to authenticated
  using (workspace_id in (select public.my_workspace_ids()) and author_id = auth.uid());

create policy "activities: author can delete"
  on public.activities as permissive for delete to authenticated
  using (workspace_id in (select public.my_workspace_ids()) and author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- subscriptions — apenas admins lêem; escrita somente via service_role
-- ---------------------------------------------------------------------------

drop policy if exists "subscriptions: admins can select" on public.subscriptions;

create policy "subscriptions: admins can select"
  on public.subscriptions as permissive for select to authenticated
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );
