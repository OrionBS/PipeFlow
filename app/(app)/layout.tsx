import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { AppShell } from "@/components/layout/AppShell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workspaces } = await (service as any)
    .from("workspaces")
    .select("id, name, slug, plan")
    .in("id", (await (service as any)
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .eq("status", "active")
    ).data?.map((m: { workspace_id: string }) => m.workspace_id) ?? [])
    .order("created_at", { ascending: true }) as { data: { id: string; name: string; slug: string; plan: string }[] | null }

  const currentWorkspaceId = await getCurrentWorkspaceId()
  const name: string = user.user_metadata?.full_name ?? user.email ?? "Usuário"
  const email: string = user.email ?? ""

  return (
    <AppShell
      workspaces={workspaces ?? []}
      currentWorkspaceId={currentWorkspaceId}
      user={{ name, email }}
    >
      {children}
    </AppShell>
  )
}
