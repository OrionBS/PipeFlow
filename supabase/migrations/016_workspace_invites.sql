-- =============================================================================
-- 016_workspace_invites.sql
-- Tabela dedicada para convites por e-mail. Separada de workspace_members
-- para permitir tokens de aceite sem poluir membros ativos, expiração automática
-- e rastreabilidade de quem convidou quem.
-- =============================================================================

create table public.workspace_invites (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references public.workspaces(id) on delete cascade,
  email         text        not null,
  role          text        not null default 'member'
                              check (role in ('admin', 'member')),
  token         uuid        not null default gen_random_uuid(),
  invited_by    uuid        references auth.users(id) on delete set null,
  expires_at    timestamptz not null default (now() + interval '7 days'),
  accepted_at   timestamptz,
  created_at    timestamptz not null default now(),

  constraint workspace_invites_token_unique unique (token),
  constraint workspace_invites_workspace_email_unique unique (workspace_id, email)
);

alter table public.workspace_invites enable row level security;

-- Membros ativos do workspace enxergam convites pendentes (para evitar duplicatas na UI)
create policy "members_select_invites" on public.workspace_invites
  for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_invites.workspace_id
        and wm.user_id = auth.uid()
        and wm.status = 'active'
    )
  );

-- Apenas admins criam convites
create policy "admins_insert_invites" on public.workspace_invites
  for insert with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_invites.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
        and wm.status = 'active'
    )
  );

-- Apenas admins cancelam convites
create policy "admins_delete_invites" on public.workspace_invites
  for delete using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_invites.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
        and wm.status = 'active'
    )
  );

create index on public.workspace_invites (workspace_id);
create index on public.workspace_invites (token);
create index on public.workspace_invites (email);
create index on public.workspace_invites (workspace_id, email) where accepted_at is null;
