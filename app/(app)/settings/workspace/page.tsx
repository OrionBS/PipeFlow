import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { WorkspaceSettingsClient } from "@/components/settings/WorkspaceSettingsClient"

export default async function WorkspaceSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaceId = await getCurrentWorkspaceId()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workspace } = await (supabase as any)
    .from("workspaces")
    .select("id, name, slug, plan")
    .eq("id", workspaceId)
    .single() as { data: { id: string; name: string; slug: string; plan: string } | null }

  if (!workspace) redirect("/dashboard")

  return <WorkspaceSettingsClient workspace={workspace} />
}
