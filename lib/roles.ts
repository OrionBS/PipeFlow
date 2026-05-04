import { createClient } from "@/lib/supabase/server"

export async function getMemberRole(workspaceId: string): Promise<"admin" | "member" | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle() as { data: { role: string } | null }

  return (data?.role ?? null) as "admin" | "member" | null
}

export async function isAdmin(workspaceId: string): Promise<boolean> {
  return (await getMemberRole(workspaceId)) === "admin"
}
