-- =============================================================================
-- 002_create_workspace_members.sql
-- =============================================================================

create table public.workspace_members (
  id             uuid        primary key default gen_random_uuid(),
  workspace_id   uuid        not null references public.workspaces (id) on delete cascade,
  user_id        uuid        references auth.users (id) on delete set null,
  role           text        not null default 'member' check (role in ('admin', 'member')),
  invited_email  text,
  status         text        not null default 'invited' check (status in ('active', 'invited', 'removed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint workspace_members_unique unique (workspace_id, user_id)
);

create index on public.workspace_members (workspace_id);
create index on public.workspace_members (user_id);
create index on public.workspace_members (workspace_id, status);
