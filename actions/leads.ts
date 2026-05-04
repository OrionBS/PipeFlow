"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { canAddLead } from "@/lib/limits"
import type { Lead, LeadStatus, Deal } from "@/types"

export interface LeadFilters {
  search?: string
  status?: LeadStatus | "all"
  owner_id?: string | "all"
  page?: number
  pageSize?: number
}

export async function getLeads(
  filters: LeadFilters = {}
): Promise<{ leads: Lead[]; total: number }> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { leads: [], total: 0 }

  const { search, status, owner_id, page = 1, pageSize = 10 } = filters

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = (supabase as any)
    .from("leads")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (search?.trim()) {
    const q = search.trim()
    query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%`)
  }

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (owner_id && owner_id !== "all") {
    query = query.eq("owner_id", owner_id)
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count } = await query as { data: Lead[] | null; count: number | null }
  return { leads: data ?? [], total: count ?? 0 }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .maybeSingle() as { data: Lead | null }

  return data
}

export async function getDealsByLead(leadId: string): Promise<Deal[]> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("deals")
    .select("*")
    .eq("lead_id", leadId)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false }) as { data: Deal[] | null }

  return data ?? []
}

export async function createLeadAction(
  payload: Omit<Lead, "id" | "workspace_id" | "created_at">
): Promise<{ error: string } | { lead: Lead }> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  if (!payload.name?.trim()) return { error: "Nome é obrigatório." }
  if (!payload.email?.trim()) return { error: "E-mail é obrigatório." }

  const limitCheck = await canAddLead(workspaceId)
  if (!limitCheck.allowed) {
    return {
      error: `Limite de ${limitCheck.limit} leads atingido. Faça upgrade para o plano Pro.`,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("leads")
    .insert({ ...payload, workspace_id: workspaceId })
    .select()
    .single() as { data: Lead | null; error: { message: string } | null }

  if (error) return { error: "Erro ao criar lead. Tente novamente." }

  revalidatePath("/leads")
  return { lead: data! }
}

export async function updateLeadAction(
  id: string,
  payload: Partial<Omit<Lead, "id" | "workspace_id" | "created_at">>
): Promise<{ error: string } | null> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("leads")
    .update(payload)
    .eq("id", id)
    .eq("workspace_id", workspaceId) as { error: { message: string } | null }

  if (error) return { error: "Erro ao atualizar lead. Tente novamente." }

  revalidatePath("/leads")
  revalidatePath(`/leads/${id}`)
  return null
}

export async function deleteLeadAction(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId) as { error: { message: string } | null }

  if (error) return { error: "Erro ao excluir lead. Tente novamente." }

  revalidatePath("/leads")
  return null
}
