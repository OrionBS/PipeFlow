import { createServiceClient } from "@/lib/supabase/service"

export interface Owner {
  id: string
  name: string
}

export async function getWorkspaceOwners(workspaceId: string): Promise<Owner[]> {
  try {
    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: members } = await (service as any)
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .not("user_id", "is", null) as {
        data: Array<{ user_id: string; invited_email: string | null }> | null
      }

    if (!members?.length) return []

    // Single admin call to list users, then look up by id — avoids N individual requests
    const { data: listData } = await service.auth.admin.listUsers({ perPage: 1000 })
    const userMap = new Map(
      (listData?.users ?? []).map((u) => [
        u.id,
        (u.user_metadata?.full_name as string | undefined) ?? u.email ?? null,
      ])
    )

    return members.map((m) => ({
      id: m.user_id,
      name: userMap.get(m.user_id) ?? m.invited_email ?? "Membro",
    }))
  } catch {
    // Service role key not configured or admin API unavailable — return empty list
    // rather than crashing the page. Owners are optional UI sugar.
    return []
  }
}
