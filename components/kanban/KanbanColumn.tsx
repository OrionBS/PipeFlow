"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn, formatCurrency } from "@/lib/utils"
import { DealCard } from "./DealCard"
import type { Deal, DealStage } from "@/types"

interface ColumnConfig {
  label: string
  color: "default" | "won" | "lost"
}

export const COLUMN_CONFIG: Record<DealStage, ColumnConfig> = {
  new_lead:      { label: "Novo Lead",          color: "default" },
  contacted:     { label: "Contato Realizado",   color: "default" },
  proposal_sent: { label: "Proposta Enviada",    color: "default" },
  negotiation:   { label: "Negociação",          color: "default" },
  closed_won:    { label: "Fechado Ganho",       color: "won" },
  closed_lost:   { label: "Fechado Perdido",     color: "lost" },
}

interface KanbanColumnProps {
  stage: DealStage
  deals: Deal[]
  leadNames: Record<string, string>
  ownerInitials: Record<string, string>
  onCardClick: (deal: Deal) => void
}

export function KanbanColumn({
  stage,
  deals,
  leadNames,
  ownerInitials,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const { label, color } = COLUMN_CONFIG[stage]
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col w-[272px] shrink-0 snap-start">
      {/* cabeçalho */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-t-xl",
          "border border-b-0",
          color === "won"
            ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30"
            : color === "lost"
              ? "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30"
              : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "text-[13px] font-semibold leading-none truncate",
              color === "won"
                ? "text-emerald-800 dark:text-emerald-300"
                : color === "lost"
                  ? "text-red-700 dark:text-red-400"
                  : "text-slate-700 dark:text-slate-200"
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              "text-[11px] font-bold rounded-full px-1.5 py-0.5 leading-none tabular-nums shrink-0",
              color === "won"
                ? "bg-emerald-200 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                : color === "lost"
                  ? "bg-red-200 dark:bg-red-900/60 text-red-600 dark:text-red-400"
                  : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
            )}
          >
            {deals.length}
          </span>
        </div>

        {totalValue > 0 && (
          <span
            className={cn(
              "font-mono text-[11px] font-semibold tabular-nums shrink-0 ml-2",
              color === "won"
                ? "text-emerald-700 dark:text-emerald-400"
                : color === "lost"
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
            )}
          >
            {formatCurrency(totalValue)}
          </span>
        )}
      </div>

      {/* área de drop */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 p-2 rounded-b-xl flex-1 min-h-[140px]",
          "border border-slate-200 dark:border-slate-800",
          "transition-colors duration-150",
          color === "won"
            ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60"
            : color === "lost"
              ? "bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900/60"
              : "bg-slate-50/80 dark:bg-slate-900/30",
          isOver && color === "default" && "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800",
          isOver && color === "won" && "bg-emerald-100/60 dark:bg-emerald-950/30",
          isOver && color === "lost" && "bg-red-100/60 dark:bg-red-950/30"
        )}
      >
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              leadName={leadNames[deal.lead_id] ?? "Lead desconhecido"}
              ownerInitials={deal.owner_id ? (ownerInitials[deal.owner_id] ?? "?") : "?"}
              onClick={() => onCardClick(deal)}
            />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[11px] text-slate-300 dark:text-slate-700 select-none">
              Arraste aqui
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
