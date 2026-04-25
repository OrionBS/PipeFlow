-- =============================================================================
-- 007_rls_policies.sql
-- Aplicar após todos os arquivos 001–006.
-- Pode ser re-executado: cada bloco dropa as policies antes de recriar.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Habilitar RLS
-- ---------------------------------------------------------------------------

alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads             enable row level security;
alter table public.deals             enable row level security;
alter table public.activities        enable row level security;
alter table public.subscriptions     enable row level security;

-- ---------------------------------------------------------------------------
-- Função auxiliar — retorna workspace_ids do usuário autenticado.
-- security definer: roda como dono da função, ignora RLS em workspace_members,
-- o que é seguro porque só expõe os ids do próprio auth.uid().
-- ---------------------------------------------------------------------------

create or replace function public.my_workspace_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select workspace_id
  from   public.workspace_members
  where  user_id = auth.uid()
  and    status  = 'active'
$$;

-- ---------------------------------------------------------------------------
-- workspaces
-- Inserção via service_role (onboarding Server Action) — sem INSERT policy.
-- Bootstrap: usuário não pode ser membro antes de o workspace existir.
-- ---------------------------------------------------------------------------

drop policy if exists "workspaces: members can select" on public.workspaces;
drop policy if exists "workspaces: admins can update"  on public.workspaces;
drop policy if exists "workspaces: admins can delete"  on public.workspaces;

create policy "workspaces: members can select"
  on public.workspaces for select
  using (id in (select public.my_workspace_ids()));

create policy "workspaces: admins can update"
  on public.workspaces for update
  using (
    id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );

create policy "workspaces: admins can delete"
  on public.workspaces for delete
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

create policy "members: active members can select"
  on public.workspace_members for select
  using (workspace_id in (select public.my_workspace_ids()));

create policy "members: admins can insert"
  on public.workspace_members for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );

create policy "members: admins can update"
  on public.workspace_members for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members m2
      where  m2.user_id = auth.uid()
      and    m2.role    = 'admin'
      and    m2.status  = 'active'
    )
  );

create policy "members: admins can delete"
  on public.workspace_members for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members m2
      where  m2.user_id = auth.uid()
      and    m2.role    = 'admin'
      and    m2.status  = 'active'
    )
  );

-- Usuário pode atualizar a própria linha (aceitar convite: muda status → 'active')
create policy "members: user can update own row"
  on public.workspace_members for update
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- leads — qualquer membro ativo faz CRUD
-- ---------------------------------------------------------------------------

drop policy if exists "leads: members can select" on public.leads;
drop policy if exists "leads: members can insert" on public.leads;
drop policy if exists "leads: members can update" on public.leads;
drop policy if exists "leads: members can delete" on public.leads;

create policy "leads: members can select"
  on public.leads for select
  using (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can insert"
  on public.leads for insert
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can update"
  on public.leads for update
  using (workspace_id in (select public.my_workspace_ids()));

create policy "leads: members can delete"
  on public.leads for delete
  using (workspace_id in (select public.my_workspace_ids()));

-- ---------------------------------------------------------------------------
-- deals — qualquer membro ativo faz CRUD
-- ---------------------------------------------------------------------------

drop policy if exists "deals: members can select" on public.deals;
drop policy if exists "deals: members can insert" on public.deals;
drop policy if exists "deals: members can update" on public.deals;
drop policy if exists "deals: members can delete" on public.deals;

create policy "deals: members can select"
  on public.deals for select
  using (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can insert"
  on public.deals for insert
  with check (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can update"
  on public.deals for update
  using (workspace_id in (select public.my_workspace_ids()));

create policy "deals: members can delete"
  on public.deals for delete
  using (workspace_id in (select public.my_workspace_ids()));

-- ---------------------------------------------------------------------------
-- activities — membros lêem e criam; somente o autor edita/deleta
-- ---------------------------------------------------------------------------

drop policy if exists "activities: members can select"  on public.activities;
drop policy if exists "activities: members can insert"  on public.activities;
drop policy if exists "activities: author can update"   on public.activities;
drop policy if exists "activities: author can delete"   on public.activities;

create policy "activities: members can select"
  on public.activities for select
  using (workspace_id in (select public.my_workspace_ids()));

create policy "activities: members can insert"
  on public.activities for insert
  with check (
    workspace_id in (select public.my_workspace_ids())
    and author_id = auth.uid()
  );

create policy "activities: author can update"
  on public.activities for update
  using (
    workspace_id in (select public.my_workspace_ids())
    and author_id = auth.uid()
  );

create policy "activities: author can delete"
  on public.activities for delete
  using (
    workspace_id in (select public.my_workspace_ids())
    and author_id = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- subscriptions — apenas admins lêem; escrita somente via service_role (webhook)
-- ---------------------------------------------------------------------------

drop policy if exists "subscriptions: admins can select" on public.subscriptions;

create policy "subscriptions: admins can select"
  on public.subscriptions for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where  user_id = auth.uid()
      and    role    = 'admin'
      and    status  = 'active'
    )
  );
