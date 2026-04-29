"use client"

import { useState } from "react"
import { Users, TrendingUp, DollarSign, Target } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { FunnelChart } from "@/components/dashboard/FunnelChart"
import { DealsDeadlineList } from "@/components/dashboard/DealsDeadlineList"
import { MOCK_DEALS, MOCK_LEADS } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { COLUMN_CONFIG } from "@/components/kanban/KanbanColumn"
import type { DealStage } from "@/types"
import { cn } from "@/lib/utils"

const PERIODS = ["7d", "30d", "90d"] as const
type Period = typeof PERIODS[number]

const ACTIVE_STAGES: DealStage[] = ["new_lead", "contacted", "proposal_sent", "negotiation"]

function computeMetrics() {
  const totalLeads = MOCK_LEADS.length
  const openDeals = MOCK_DEALS.filter((d) => ACTIVE_STAGES.includes(d.stage))
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0)
  const closedWon = MOCK_DEALS.filter((d) => d.stage === "closed_won").length
  const totalDeals = MOCK_DEALS.length
  const conversionRate = totalDeals > 0 ? Math.round((closedWon / totalDeals) * 100) : 0
  return { totalLeads, openDealsCount: openDeals.length, pipelineValue, conversionRate }
}

function computeFunnelData() {
  return (Object.entries(COLUMN_CONFIG) as [DealStage, { label: string; accent: string }][]).map(
    ([stage, { label, accent }]) => ({
      label,
      count: MOCK_DEALS.filter((d) => d.stage === stage).length,
      value: MOCK_DEALS.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
      accent,
    })
  )
}

function computeDeadlineDeals() {
  const now = Date.now()
  const sevenDays = now + 7 * 24 * 60 * 60 * 1000
  return MOCK_DEALS.filter(
    (d) => d.deadline && ACTIVE_STAGES.includes(d.stage) && new Date(d.deadline).getTime() <= sevenDays
  )
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .map((d) => ({
      id: d.id,
      title: d.title,
      leadName: MOCK_LEADS.find((l) => l.id === d.lead_id)?.name ?? "—",
      value: d.value,
      deadline: d.deadline!,
      stageLabel: COLUMN_CONFIG[d.stage].label,
      stageAccent: COLUMN_CONFIG[d.stage].accent,
    }))
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30d")

  const { totalLeads, openDealsCount, pipelineValue, conversionRate } = computeMetrics()
  const funnelData = computeFunnelData()
  const deadlineDeals = computeDeadlineDeals()

  return (
    <div className="flex flex-col gap-6 pf-page-enter">
      {/* toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="text-xl font-bold leading-none"
            style={{ fontFamily: "var(--font-syne, sans-serif)", color: "#E8E8E8" }}
          >
            Dashboard
          </h1>
          <p className="text-xs mt-1" style={{ color: "#555559" }}>
            Visão geral do pipeline de vendas
          </p>
        </div>

        {/* period filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all duration-150"
              style={{
                fontFamily: "var(--font-ibm-mono, monospace)",
                background: period === p ? "rgba(202,255,51,0.12)" : "transparent",
                color: period === p ? "#CAFF33" : "#555559",
                border: period === p ? "1px solid rgba(202,255,51,0.25)" : "1px solid transparent",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Total de Leads"
          value={String(totalLeads)}
          change="12% vs mês anterior"
          changePositive
          icon={Users}
          accent="#3B82F6"
          staggerIndex={0}
        />
        <MetricCard
          title="Negócios Abertos"
          value={String(openDealsCount)}
          change="2 novos esta semana"
          changePositive
          icon={TrendingUp}
          accent="#06B6D4"
          staggerIndex={1}
        />
        <MetricCard
          title="Valor do Pipeline"
          value={formatCurrency(pipelineValue)}
          change="R$ 3.200 vs mês anterior"
          changePositive
          icon={DollarSign}
          accent="#CAFF33"
          staggerIndex={2}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${conversionRate}%`}
          change="5% vs mês anterior"
          changePositive
          icon={Target}
          accent="#22C55E"
          staggerIndex={3}
        />
      </div>

      {/* chart + deadline list */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
        <FunnelChart data={funnelData} />
        <DealsDeadlineList deals={deadlineDeals} />
      </div>
    </div>
  )
}
