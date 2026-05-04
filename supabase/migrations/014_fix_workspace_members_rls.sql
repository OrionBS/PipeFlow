-- =============================================================================
-- 014_fix_workspace_members_rls.sql
-- Corrige deadlock circular na policy de SELECT de workspace_members.
--
-- Problema: a policy usava "workspace_id in (select my_workspace_ids())",
-- mas my_workspace_ids() consulta workspace_members — usuários novos (sem
-- nenhum workspace ainda) nunca conseguem ler suas próprias linhas, causando
-- erro "Workspace não encontrado na sessão" logo após o onboarding.
--
-- Fix: adiciona OR user_id = auth.uid() para que cada usuário possa sempre
-- ler as suas próprias linhas em workspace_members.
-- =============================================================================

drop policy if exists "members: active members can select" on public.workspace_members;

create policy "members: active members can select"
  on public.workspace_members
  as permissive for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or workspace_id in (select public.my_workspace_ids())
  );
