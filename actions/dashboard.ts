"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { COLUMN_CONFIG, ACTIVE_STAGES } from "@/lib/pipeline"
import type { DealStage } from "@/types"

function periodStart(period: string): string {
  const now = new Date()
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30
  now.setDate(now.getDate() - days)
  return now.toISOString()
}

export interface FunnelItem {
  label: string
  count: number
  value: number
  accent: string
}

export interface DeadlineDeal {
  id: string
  title: string
  leadName: string
  value: number
  deadline: string
  stageLabel: string
  stageAccent: string
}

export interface DashboardMetrics {
  totalLeads: number
  openDealsCount: number
  pipelineValue: number
  conversionRate: number
  funnelData: FunnelItem[]
  deadlineDeals: DeadlineDeal[]
}

const EMPTY: DashboardMetrics = {
  totalLeads: 0,
  openDealsCount: 0,
  pipelineValue: 0,
  conversionRate: 0,
  funnelData: [],
  deadlineDeals: [],
}

export async function getDashboardMetrics(
  period: string = "30d"
): Promise<DashboardMetrics> {
  const supabase = await createClient()
  const workspaceId = await getCurrentWorkspaceId()
  if (!workspaceId) return EMPTY

  const since = periodStart(period)

  // Run lead count + all deals in parallel
  const [leadsResult, dealsResult] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .gte("created_at", since) as Promise<{ count: number | null }>,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("deals")
      .select("id, stage, value, lead_id, deadline, title")
      .eq("workspace_id", workspaceId) as Promise<{
        data: Array<{
          id: string
          stage: DealStage
          value: number
          lead_id: string
          deadline: string | null
          title: string
        }> | null
      }>,
  ])

  const totalLeads = leadsResult.count ?? 0
  const allDeals = dealsResult.data ?? []

  const openDeals = allDeals.filter((d) => ACTIVE_STAGES.includes(d.stage))
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0)
  const closedWon = allDeals.filter((d) => d.stage === "closed_won").length
  const conversionRate =
    allDeals.length > 0 ? Math.round((closedWon / allDeals.length) * 100) : 0

  const funnelData: FunnelItem[] = (
    Object.entries(COLUMN_CONFIG) as [DealStage, { label: string; accent: string }][]
  ).map(([stage, { label, accent }]) => ({
    label,
    count: allDeals.filter((d) => d.stage === stage).length,
    value: allDeals
      .filter((d) => d.stage === stage)
      .reduce((s, d) => s + d.value, 0),
    accent,
  }))

  // Deals with deadline in the next 7 days
  const now = Date.now()
  const sevenDays = now + 7 * 24 * 60 * 60 * 1000
  const upcomingDeals = allDeals.filter(
    (d) =>
      d.deadline &&
      ACTIVE_STAGES.includes(d.stage) &&
      new Date(d.deadline).getTime() <= sevenDays
  )

  let leadNamesMap: Record<string, string> = {}
  if (upcomingDeals.length > 0) {
    const leadIds = [...new Set(upcomingDeals.map((d) => d.lead_id))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: leadRows } = await (supabase as any)
      .from("leads")
      .select("id, name")
      .in("id", leadIds)
      .eq("workspace_id", workspaceId) as {
        data: Array<{ id: string; name: string }> | null
      }
    leadNamesMap = Object.fromEntries((leadRows ?? []).map((l) => [l.id, l.name]))
  }

  const deadlineDeals: DeadlineDeal[] = upcomingDeals
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )
    .map((d) => ({
      id: d.id,
      title: d.title,
      leadName: leadNamesMap[d.lead_id] ?? "—",
      value: d.value,
      deadline: d.deadline!,
      stageLabel: COLUMN_CONFIG[d.stage].label,
      stageAccent: COLUMN_CONFIG[d.stage].accent,
    }))

  return {
    totalLeads,
    openDealsCount: openDeals.length,
    pipelineValue,
    conversionRate,
    funnelData,
    deadlineDeals,
  }
}
