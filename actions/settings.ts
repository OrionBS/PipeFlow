"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { canAddMember } from "@/lib/limits"
import { isAdmin } from "@/lib/roles"
import { sendInviteEmail } from "@/lib/email"
import { WORKSPACE_COOKIE } from "@/lib/workspace"

type Result = { error: string } | null

export async function updateWorkspaceName(workspaceId: string, name: string): Promise<Result> {
  const supabase = await createClient()
  if (!(await isAdmin(workspaceId))) return { error: "Apenas admins podem editar o workspace." }

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

  if (!(await isAdmin(workspaceId))) return { error: "Apenas admins podem convidar membros." }

  const limit = await canAddMember(workspaceId)
  if (!limit.allowed) {
    return { error: `Limite de ${limit.limit} membros atingido. Faça upgrade para o plano Pro.` }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingInvite } = await (service as any)
    .from("workspace_invites")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("email", email)
    .is("accepted_at", null)
    .maybeSingle()

  if (existingInvite) return { error: "Este e-mail já tem um convite pendente." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingMember } = await (service as any)
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("invited_email", email)
    .eq("status", "active")
    .maybeSingle()

  if (existingMember) return { error: "Este e-mail já é membro deste workspace." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: invite, error: insertError } = await (service as any)
    .from("workspace_invites")
    .insert({ workspace_id: workspaceId, email, role: "member", invited_by: user.id })
    .select("token")
    .single() as { data: { token: string } | null; error: unknown }

  if (insertError || !invite) return { error: "Erro ao criar convite." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ws } = await (service as any)
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .single() as { data: { name: string } | null }

  const inviterName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Alguém"

  try {
    await sendInviteEmail({
      to: email,
      inviterName,
      workspaceName: ws?.name ?? "workspace",
      token: invite.token,
    })
  } catch {
    // E-mail falhou mas o convite foi criado — não bloqueia o fluxo
  }

  revalidatePath("/settings/members")
  return null
}

export async function cancelInvite(inviteId: string, workspaceId: string): Promise<Result> {
  const service = createServiceClient()

  if (!(await isAdmin(workspaceId))) return { error: "Apenas admins podem cancelar convites." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service as any)
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .eq("workspace_id", workspaceId)

  if (error) return { error: "Erro ao cancelar convite." }

  revalidatePath("/settings/members")
  return null
}

export async function removeMember(memberId: string, workspaceId: string): Promise<Result> {
  const supabase = await createClient()

  if (!(await isAdmin(workspaceId))) return { error: "Apenas admins podem remover membros." }

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

export async function acceptInvite(token: string): Promise<Result> {
  const supabase = await createClient()
  const service = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Você precisa estar logado para aceitar o convite." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: invite } = await (service as any)
    .from("workspace_invites")
    .select("id, workspace_id, email, role, expires_at, accepted_at")
    .eq("token", token)
    .maybeSingle() as {
      data: {
        id: string
        workspace_id: string
        email: string
        role: string
        expires_at: string
        accepted_at: string | null
      } | null
    }

  if (!invite) return { error: "Convite inválido." }
  if (invite.accepted_at) return { error: "Este convite já foi aceito." }
  if (new Date(invite.expires_at) < new Date()) return { error: "Este convite expirou." }
  if (invite.email !== user.email) return { error: "Este convite é para outro e-mail." }

  // Verifica limite antes de aceitar
  const limit = await canAddMember(invite.workspace_id)
  if (!limit.allowed) {
    return { error: "O workspace atingiu o limite de membros do plano Free." }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: memberError } = await (service as any)
    .from("workspace_members")
    .insert({
      workspace_id: invite.workspace_id,
      user_id: user.id,
      invited_email: user.email,
      role: invite.role,
      status: "active",
    })

  if (memberError) return { error: "Erro ao aceitar convite. Você pode já ser membro deste workspace." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (service as any)
    .from("workspace_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id)

  const cookieStore = await cookies()
  cookieStore.set(WORKSPACE_COOKIE, invite.workspace_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })

  return null
}

export async function startCheckout(): Promise<void> {
  redirect("/api/stripe/checkout")
}
