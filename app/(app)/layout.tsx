import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/layout/AppShell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name, slug, plan")
    .order("created_at", { ascending: true })

  const name: string = user.user_metadata?.full_name ?? user.email ?? "Usuário"
  const email: string = user.email ?? ""

  return (
    <AppShell
      workspaces={workspaces ?? []}
      user={{ name, email }}
    >
      {children}
    </AppShell>
  )
}
