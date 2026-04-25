"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarDays, DollarSign, User, Tag, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { COLUMN_CONFIG } from "./KanbanColumn"
import type { Deal } from "@/types"

interface DealDetailModalProps {
  deal: Deal | null
  leadName: string
  ownerName: string
  onClose: () => void
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function DealDetailModal({ deal, leadName, ownerName, onClose }: DealDetailModalProps) {
  if (!deal) return null

  const config = COLUMN_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)

  const stagePillClass =
    config.color === "won"
      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      : config.color === "lost"
        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
        : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"

  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* cabeçalho com destaque do valor */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug pr-6">
              {deal.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-3">
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                stagePillClass
              )}
            >
              {config.label}
            </span>

            {overdue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <Clock className="h-3 w-3" />
                Prazo vencido
              </span>
            )}
          </div>

          <p className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-4 tracking-tight">
            {formatCurrency(deal.value)}
          </p>
        </div>

        {/* detalhes */}
        <dl className="px-6 py-5 grid gap-4">
          <Row
            icon={<User className="h-4 w-4" />}
            label="Lead vinculado"
            value={<span className="font-medium">{leadName}</span>}
          />
          <Row
            icon={<User className="h-4 w-4" />}
            label="Responsável"
            value={ownerName || "—"}
          />
          <Row
            icon={<CalendarDays className="h-4 w-4" />}
            label="Prazo"
            value={
              <span className={cn(overdue && "text-red-600 dark:text-red-400 font-medium")}>
                {formatDate(deal.deadline)}
              </span>
            }
          />
          <Row
            icon={<Tag className="h-4 w-4" />}
            label="Criado em"
            value={formatDate(deal.created_at)}
          />
        </dl>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0">{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <dt className="text-[11px] uppercase tracking-wide font-medium text-slate-400 dark:text-slate-500">
          {label}
        </dt>
        <dd className="text-sm text-slate-900 dark:text-slate-100">{value}</dd>
      </div>
    </div>
  )
}
