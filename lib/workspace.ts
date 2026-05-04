import { cookies } from "next/headers"
import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

export const WORKSPACE_COOKIE = "pipeflow_workspace_id"

// cache() ensures this resolves once per request regardless of how many
// actions call it in parallel (getDeals, getLeads, getWorkspaceOwners, etc.)
export const getCurrentWorkspaceId = cache(async function getCurrentWorkspaceId(): Promise<string> {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (fromCookie) return fromCookie

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("workspaces")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle() as { data: { id: string } | null }

  return data?.id ?? ""
})
