-- =============================================================================
-- 000_cleanup_before_rls.sql
-- Limpa policies e funções antigas antes de aplicar 007 + 011.
-- Execute este script PRIMEIRO no Supabase SQL Editor.
-- Idempotente — IF EXISTS em tudo.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Funções antigas (versões sem set search_path)
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS is_workspace_member(UUID);
DROP FUNCTION IF EXISTS is_workspace_admin(UUID);
DROP FUNCTION IF EXISTS public.my_workspace_ids();
DROP FUNCTION IF EXISTS public.is_workspace_admin(UUID);
DROP FUNCTION IF EXISTS public.set_updated_at();

-- ---------------------------------------------------------------------------
-- workspaces — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "workspaces_select_members"        ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_insert_authenticated"  ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_admin"          ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_admin"          ON public.workspaces;
DROP POLICY IF EXISTS "workspaces: members can select"   ON public.workspaces;
DROP POLICY IF EXISTS "workspaces: admins can update"    ON public.workspaces;
DROP POLICY IF EXISTS "workspaces: admins can delete"    ON public.workspaces;

-- ---------------------------------------------------------------------------
-- workspace_members — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "workspace_members_select"              ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_admin"        ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_admin"        ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete"              ON public.workspace_members;
DROP POLICY IF EXISTS "members: active members can select"    ON public.workspace_members;
DROP POLICY IF EXISTS "members: admins can insert"            ON public.workspace_members;
DROP POLICY IF EXISTS "members: admins can update"            ON public.workspace_members;
DROP POLICY IF EXISTS "members: admins can delete"            ON public.workspace_members;
DROP POLICY IF EXISTS "members: user can update own row"      ON public.workspace_members;
DROP POLICY IF EXISTS "members: user can accept invite"       ON public.workspace_members;

-- ---------------------------------------------------------------------------
-- leads — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "leads_select"                ON public.leads;
DROP POLICY IF EXISTS "leads_insert"                ON public.leads;
DROP POLICY IF EXISTS "leads_update"                ON public.leads;
DROP POLICY IF EXISTS "leads_delete"                ON public.leads;
DROP POLICY IF EXISTS "leads: members can select"   ON public.leads;
DROP POLICY IF EXISTS "leads: members can insert"   ON public.leads;
DROP POLICY IF EXISTS "leads: members can update"   ON public.leads;
DROP POLICY IF EXISTS "leads: members can delete"   ON public.leads;

-- ---------------------------------------------------------------------------
-- deals — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "deals_select"                ON public.deals;
DROP POLICY IF EXISTS "deals_insert"                ON public.deals;
DROP POLICY IF EXISTS "deals_update"                ON public.deals;
DROP POLICY IF EXISTS "deals_delete"                ON public.deals;
DROP POLICY IF EXISTS "deals: members can select"   ON public.deals;
DROP POLICY IF EXISTS "deals: members can insert"   ON public.deals;
DROP POLICY IF EXISTS "deals: members can update"   ON public.deals;
DROP POLICY IF EXISTS "deals: members can delete"   ON public.deals;

-- ---------------------------------------------------------------------------
-- activities — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "activities_select"               ON public.activities;
DROP POLICY IF EXISTS "activities_insert"               ON public.activities;
DROP POLICY IF EXISTS "activities_update"               ON public.activities;
DROP POLICY IF EXISTS "activities_delete"               ON public.activities;
DROP POLICY IF EXISTS "activities: members can select"  ON public.activities;
DROP POLICY IF EXISTS "activities: members can insert"  ON public.activities;
DROP POLICY IF EXISTS "activities: author can update"   ON public.activities;
DROP POLICY IF EXISTS "activities: author can delete"   ON public.activities;

-- ---------------------------------------------------------------------------
-- subscriptions — nomes antigos e novos
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "subscriptions_select"              ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions: admins can select"  ON public.subscriptions;

-- ---------------------------------------------------------------------------
-- invites (pode não existir ainda — IF EXISTS protege)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "invites: admins can select"    ON public.invites;
DROP POLICY IF EXISTS "invites: admins can insert"    ON public.invites;
DROP POLICY IF EXISTS "invites: admins can delete"    ON public.invites;
DROP POLICY IF EXISTS "invites: public read by token" ON public.invites;
