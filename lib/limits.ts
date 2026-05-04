import { createClient } from "@/lib/supabase/server"

const FREE_LIMITS = { leads: 50, members: 2 } as const

export interface LimitCheck {
  allowed: boolean
  current: number
  limit: number
}

export async function canAddLead(workspaceId: string): Promise<LimitCheck> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: ws } = await db
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .single() as { data: { plan: string } | null }

  if (ws?.plan === "pro") return { allowed: true, current: 0, limit: Infinity }

  const { count } = await db
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId) as { count: number | null }

  const current = count ?? 0
  return { allowed: current < FREE_LIMITS.leads, current, limit: FREE_LIMITS.leads }
}

export async function canAddMember(workspaceId: string): Promise<LimitCheck> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: ws } = await db
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .single() as { data: { plan: string } | null }

  if (ws?.plan === "pro") return { allowed: true, current: 0, limit: Infinity }

  const { count } = await db
    .from("workspace_members")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)
    .eq("status", "active") as { count: number | null }

  const current = count ?? 0
  return { allowed: current < FREE_LIMITS.members, current, limit: FREE_LIMITS.members }
}
