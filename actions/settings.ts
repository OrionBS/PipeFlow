"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

type Result = { error: string } | null

export async function updateWorkspaceName(workspaceId: string, name: string): Promise<Result> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("workspaces")
    .update({ name })
    .eq("id", workspaceId)

  if (error) return { error: "Erro ao salvar. Tente novamente." }

  revalidatePath("/settings/workspace")
  revalidatePath("/", "layout")
  return null
}

export async function updateProfile({ name, password }: { name: string; password?: string }): Promise<Result> {
  const supabase = await createClient()

  const updates: Parameters<typeof supabase.auth.updateUser>[0] = {
    data: { full_name: name },
  }
  if (password) updates.password = password

  const { error } = await supabase.auth.updateUser(updates)
  if (error) return { error: error.message }

  revalidatePath("/settings/profile")
  return null
}

export async function inviteMember(email: string, workspaceId: string): Promise<Result> {
  const supabase = await createClient()
  const service = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (service as any)
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .maybeSingle()

  if (existing) return { error: "Este e-mail já foi convidado." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service as any)
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      invited_email: email,
      role: "member",
      status: "invited",
    })

  if (error) return { error: "Erro ao enviar convite. Tente novamente." }

  revalidatePath("/settings/members")
  return null
}

export async function removeMember(memberId: string, workspaceId: string): Promise<Result> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", workspaceId)

  if (error) return { error: "Erro ao remover membro." }

  revalidatePath("/settings/members")
  return null
}

export async function startCheckout(): Promise<void> {
  redirect("/api/stripe/checkout")
}
