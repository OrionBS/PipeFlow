import { createServiceClient } from "@/lib/supabase/service"

export interface Owner {
  id: string
  name: string
}

export async function getWorkspaceOwners(workspaceId: string): Promise<Owner[]> {
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

  const owners = await Promise.all(
    members.map(async (m) => {
      const { data } = await service.auth.admin.getUserById(m.user_id)
      const name =
        data.user?.user_metadata?.full_name ??
        data.user?.email ??
        m.invited_email ??
        "Membro"
      return { id: m.user_id, name } as Owner
    })
  )

  return owners
}
