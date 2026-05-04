-- =============================================================================
-- RODAR UMA VEZ no Supabase Studio → SQL Editor
-- Combina 012_profiles_view.sql + 013_fix_activities_and_profiles.sql
-- É seguro rodar mesmo que 012 já tenha sido rodada (CREATE OR REPLACE).
-- Se a coluna já foi renomeada, o ALTER TABLE vai dar erro — ignore e continue.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 012: RPC profiles_for_workspace
-- (a view pública é criada aqui mas removida logo abaixo em 013)
-- ---------------------------------------------------------------------------

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
    on wm.user_id = u.id
    and wm.workspace_id = p_workspace_id
    and wm.status = 'active'
$$;

grant execute on function public.profiles_for_workspace(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 013: Renomear occurred_at → date na tabela activities
-- (se já foi renomeado, esta linha vai falhar — ignore o erro e continue)
-- ---------------------------------------------------------------------------

alter table public.activities
  rename column occurred_at to date;

-- Recriar índice com o novo nome de coluna
drop index if exists activities_lead_id_occurred_at_idx;
create index if not exists activities_lead_id_date_idx
  on public.activities (lead_id, date desc);

-- ---------------------------------------------------------------------------
-- 013: Remover view pública insegura (se existir)
-- ---------------------------------------------------------------------------
drop view if exists public.profiles;
