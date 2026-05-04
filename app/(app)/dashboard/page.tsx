import { Suspense } from "react"
import { Users, TrendingUp, DollarSign, Target } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { FunnelChart } from "@/components/dashboard/FunnelChart"
import { DealsDeadlineList } from "@/components/dashboard/DealsDeadlineList"
import { PeriodFilter } from "@/components/dashboard/PeriodFilter"
import { getDashboardMetrics } from "@/actions/dashboard"
import { formatCurrency } from "@/lib/utils"

interface Props {
  searchParams: Promise<{ period?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { period = "30d" } = await searchParams

  const {
    totalLeads,
    openDealsCount,
    pipelineValue,
    conversionRate,
    funnelData,
    deadlineDeals,
  } = await getDashboardMetrics(period)

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

        <Suspense fallback={null}>
          <PeriodFilter period={period} />
        </Suspense>
      </div>

      {/* metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Total de Leads"
          value={String(totalLeads)}
          change={`Últimos ${period}`}
          changePositive
          icon={Users}
          accent="#3B82F6"
          staggerIndex={0}
        />
        <MetricCard
          title="Negócios Abertos"
          value={String(openDealsCount)}
          change="Em andamento"
          changePositive
          icon={TrendingUp}
          accent="#06B6D4"
          staggerIndex={1}
        />
        <MetricCard
          title="Valor do Pipeline"
          value={formatCurrency(pipelineValue)}
          change="Negócios ativos"
          changePositive
          icon={DollarSign}
          accent="#CAFF33"
          staggerIndex={2}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${conversionRate}%`}
          change="Ganhos / Total"
          changePositive={conversionRate > 0}
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
