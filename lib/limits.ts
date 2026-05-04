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

  // Run plan check and count in parallel instead of sequentially
  const [wsResult, countResult] = await Promise.all([
    db.from("workspaces").select("plan").eq("id", workspaceId).single() as Promise<{ data: { plan: string } | null }>,
    db.from("leads").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId) as Promise<{ count: number | null }>,
  ])

  if (wsResult.data?.plan === "pro") return { allowed: true, current: 0, limit: Infinity }

  const current = countResult.count ?? 0
  return { allowed: current < FREE_LIMITS.leads, current, limit: FREE_LIMITS.leads }
}

export async function canAddMember(workspaceId: string): Promise<LimitCheck> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const [wsResult, countResult] = await Promise.all([
    db.from("workspaces").select("plan").eq("id", workspaceId).single() as Promise<{ data: { plan: string } | null }>,
    db.from("workspace_members").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "active") as Promise<{ count: number | null }>,
  ])

  if (wsResult.data?.plan === "pro") return { allowed: true, current: 0, limit: Infinity }

  const current = countResult.count ?? 0
  return { allowed: current < FREE_LIMITS.members, current, limit: FREE_LIMITS.members }
}
