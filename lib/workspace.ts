import { cookies } from "next/headers"
import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export const WORKSPACE_COOKIE = "pipeflow_workspace_id"

export const getCurrentWorkspaceId = cache(async function getCurrentWorkspaceId(): Promise<string> {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(WORKSPACE_COOKIE)?.value
  if (fromCookie) return fromCookie

  // No cookie — find the user's first workspace via service client (no RLS dependency)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return ""

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (service as any)
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle() as { data: { workspace_id: string } | null }

  return data?.workspace_id ?? ""
})
