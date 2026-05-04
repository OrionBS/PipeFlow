"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import type { Deal, DealStage } from "@/types"

export async function getDeals(): Promise<Deal[]> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("deals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false }) as { data: Deal[] | null }

  return data ?? []
}

export async function createDealAction(
  payload: Omit<Deal, "id" | "workspace_id" | "created_at">
): Promise<{ error: string } | { deal: Deal }> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  if (!payload.title?.trim()) return { error: "Título é obrigatório." }
  if (!payload.lead_id) return { error: "Selecione um lead." }
  if (payload.value <= 0) return { error: "Valor deve ser maior que zero." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("deals")
    .insert({ ...payload, workspace_id: workspaceId })
    .select()
    .single() as { data: Deal | null; error: { message: string } | null }

  if (error) return { error: "Erro ao criar negócio. Tente novamente." }

  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return { deal: data! }
}

export async function updateDealAction(
  id: string,
  payload: Partial<Omit<Deal, "id" | "workspace_id" | "created_at">>
): Promise<{ error: string } | null> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("deals")
    .update(payload)
    .eq("id", id)
    .eq("workspace_id", workspaceId) as { error: { message: string } | null }

  if (error) return { error: "Erro ao atualizar negócio. Tente novamente." }

  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return null
}

export async function deleteDealAction(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("deals")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId) as { error: { message: string } | null }

  if (error) return { error: "Erro ao excluir negócio. Tente novamente." }

  revalidatePath("/pipeline")
  revalidatePath("/dashboard")
  return null
}

export async function moveDealAction(
  id: string,
  newStage: DealStage
): Promise<{ error: string } | null> {
  return updateDealAction(id, { stage: newStage })
}
