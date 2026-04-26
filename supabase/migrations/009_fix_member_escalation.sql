-- =============================================================================
-- 009_fix_member_escalation.sql
-- Incorporado ao 007_rls_policies.sql v2 — este arquivo é mantido para
-- rastreabilidade histórica da correção de privilege escalation.
-- A policy "members: user can accept invite" já inclui o with check no 007.
-- =============================================================================

-- No-op: policy já recriada corretamente em 007_rls_policies.sql v2
select 'migration 009 applied via 007 v2' as status;
