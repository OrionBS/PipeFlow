import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export const WORKSPACE_COOKIE = "pipeflow_workspace_id"

export async function getCurrentWorkspaceId(): Promise<string> {
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
}
