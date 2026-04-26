"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import type { PlanType } from "@/src/types/supabase"

export type WorkspaceResult = { error: string } | null

export async function createWorkspace(
  name: string,
  slug: string
): Promise<WorkspaceResult> {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Sessão expirada. Faça login novamente." }
  }

  const service = createServiceClient()

  // Single atomic transaction via RPC — avoids the bootstrap RLS problem and
  // eliminates any race between workspace INSERT and member INSERT.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: rpcError } = await (service as any).rpc(
    "create_workspace_with_admin",
    { p_name: name, p_slug: slug, p_user_id: user.id }
  )

  if (rpcError) {
    // Postgres unique_violation on slug column
    if (rpcError.code === "23505") {
      return { error: "Esse slug já está em uso. Escolha outro nome." }
    }
    return { error: "Erro ao criar workspace. Tente novamente." }
  }

  // Return null on success — let the caller decide where to redirect.
  // Onboarding shows step 2 (invite) before navigating to dashboard.
  return null
}

export async function getWorkspaces(): Promise<
  { id: string; name: string; slug: string; plan: PlanType }[]
> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("workspaces")
    .select("id, name, slug, plan")
    .order("created_at", { ascending: true })

  return (data ?? []) as { id: string; name: string; slug: string; plan: PlanType }[]
}
