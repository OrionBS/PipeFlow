"use client"

import { CalendarDays, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

interface DeadlineDeal {
  id: string
  title: string
  leadName: string
  value: number
  deadline: string
  stageLabel: string
  stageAccent: string
}

interface DealsDeadlineListProps {
  deals: DeadlineDeal[]
}

function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function deadlineColor(days: number): string {
  if (days < 0) return "#EF4444"
  if (days <= 2) return "#F97316"
  if (days <= 5) return "#F59E0B"
  return "#8A8A8F"
}

export function DealsDeadlineList({ deals }: DealsDeadlineListProps) {
  return (
    <div
      className="rounded-xl overflow-hidden pf-fade-up pf-stagger-4 flex flex-col"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "#F59E0B" }} />
          <p
            className="text-[10px] uppercase tracking-widest font-medium"
            style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
          >
            Prazos Próximos
          </p>
        </div>
        <p
          className="text-sm font-semibold mt-0.5"
          style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}
        >
          Próximos 7 dias
        </p>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {deals.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-10">
            <p className="text-[12px]" style={{ color: "#2A2A2E" }}>Nenhum prazo nos próximos 7 dias</p>
          </div>
        ) : (
          deals.map((deal) => {
            const days = daysUntil(deal.deadline)
            const color = deadlineColor(days)
            const label = days < 0
              ? `${Math.abs(days)}d vencido`
              : days === 0
              ? "Hoje"
              : days === 1
              ? "Amanhã"
              : `${days}d`

            return (
              <div key={deal.id} className="px-5 py-3 flex items-center gap-3 group">
                {/* stage dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: deal.stageAccent, boxShadow: `0 0 5px ${deal.stageAccent}88` }}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-semibold leading-tight truncate"
                    style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}
                  >
                    {deal.title}
                  </p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: "#555559" }}>
                    {deal.leadName} · {deal.stageLabel}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className="text-[12px] font-semibold tabular-nums"
                    style={{ color: "#CAFF33", fontFamily: "var(--font-ibm-mono, monospace)" }}
                  >
                    {formatCurrency(deal.value)}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <CalendarDays className="h-2.5 w-2.5" style={{ color }} />
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color, fontFamily: "var(--font-ibm-mono, monospace)" }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
