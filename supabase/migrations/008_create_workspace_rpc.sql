-- =============================================================================
-- 008_create_workspace_rpc.sql
-- Cria workspace + membro admin em transação atômica.
-- set search_path = '' previne search-path hijack em funções SECURITY DEFINER.
-- =============================================================================

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
