-- Fix: my_workspace_ids e is_workspace_admin devem ser SECURITY INVOKER
-- para que auth.uid() funcione corretamente dentro das políticas RLS.
-- SECURITY DEFINER faz a função rodar como o dono (postgres), não como o
-- usuário autenticado, então auth.uid() retornava NULL causando RLS falhar.

CREATE OR REPLACE FUNCTION public.my_workspace_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT workspace_id
  FROM   public.workspace_members
  WHERE  user_id = (SELECT auth.uid())
  AND    status  = 'active'
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_admin(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.workspace_members
    WHERE  workspace_id = p_workspace_id
    AND    user_id      = (SELECT auth.uid())
    AND    role         = 'admin'
    AND    status       = 'active'
  )
$$;
