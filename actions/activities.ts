"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import type { Activity, ActivityType } from "@/types"
import type { ActivityRow } from "@/src/types/supabase"

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    workspace_id: row.workspace_id,
    lead_id: row.lead_id,
    type: row.type,
    description: row.description,
    author_id: row.author_id,
    date: row.occurred_at,
    created_at: row.created_at,
  }
}

export async function getActivitiesByLead(leadId: string): Promise<Activity[]> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("activities")
    .select("*")
    .eq("lead_id", leadId)
    .eq("workspace_id", workspaceId)
    .order("occurred_at", { ascending: false }) as { data: ActivityRow[] | null }

  return (data ?? []).map(toActivity)
}

export async function createActivityAction(
  leadId: string,
  payload: { type: ActivityType; description: string; date: string }
): Promise<{ error: string } | { activity: Activity }> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return { error: "Workspace não encontrado." }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  if (!payload.description.trim()) return { error: "Descrição é obrigatória." }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("activities")
    .insert({
      lead_id: leadId,
      workspace_id: workspaceId,
      author_id: user.id,
      type: payload.type,
      description: payload.description.trim(),
      occurred_at: payload.date,
    })
    .select()
    .single() as { data: ActivityRow | null; error: { message: string } | null }

  if (error) return { error: "Erro ao registrar atividade. Tente novamente." }

  revalidatePath(`/leads/${leadId}`)
  return { activity: toActivity(data!) }
}
