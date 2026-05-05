import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { MembersClient } from "@/components/settings/MembersClient"

function initials(name: string, email: string): string {
  const parts = name.trim().split(" ").filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaceId = await getCurrentWorkspaceId()
  const service = createServiceClient()

  // Load active members + workspace plan in parallel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [membersResult, wsResult, invitesResult] = await Promise.all([
    (service as any)
      .from("workspace_members")
      .select("id, user_id, invited_email, role, status")
      .eq("workspace_id", workspaceId)
      .eq("status", "active") as Promise<{
        data: Array<{ id: string; user_id: string | null; invited_email: string | null; role: string; status: string }> | null
      }>,
    (service as any)
      .from("workspaces")
      .select("plan")
      .eq("id", workspaceId)
      .single() as Promise<{ data: { plan: string } | null }>,
    (service as any)
      .from("workspace_invites")
      .select("id, email, role")
      .eq("workspace_id", workspaceId)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString()) as Promise<{
        data: Array<{ id: string; email: string; role: string }> | null
      }>,
  ])

  const members = membersResult.data ?? []
  const plan = wsResult.data?.plan ?? "free"
  const pendingInvites = invitesResult.data ?? []

  // Resolve user names via admin API
  const { data: listData } = await service.auth.admin.listUsers({ perPage: 1000 })
  const userMap = new Map(
    (listData?.users ?? []).map((u) => [
      u.id,
      (u.user_metadata?.full_name as string | undefined) ?? u.email ?? "",
    ])
  )

  type Row =
    | { kind: "member"; id: string; name: string; email: string; initials: string; role: string }
    | { kind: "invite"; id: string; email: string; initials: string; role: string }

  const memberRows: Row[] = members.map((m) => {
    const name = m.user_id ? (userMap.get(m.user_id) ?? m.invited_email ?? "Membro") : (m.invited_email ?? "Membro")
    const email = m.user_id ? ((listData?.users ?? []).find((u) => u.id === m.user_id)?.email ?? m.invited_email ?? "") : (m.invited_email ?? "")
    return { kind: "member", id: m.id, name, email, initials: initials(name, email), role: m.role }
  })

  const inviteRows: Row[] = pendingInvites.map((inv) => ({
    kind: "invite",
    id: inv.id,
    email: inv.email,
    initials: inv.email.slice(0, 2).toUpperCase(),
    role: inv.role,
  }))

  const rows: Row[] = [...memberRows, ...inviteRows]

  return (
    <MembersClient
      rows={rows}
      workspaceId={workspaceId}
      plan={plan}
      activeMemberCount={members.length}
    />
  )
}
