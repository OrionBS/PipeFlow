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
    <div className="flex flex-col w-64 shrink-0">
      {/* cabeçalho da coluna */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-t-lg border-t-2",
          color === "won"
            ? "border-green-500 bg-green-50 dark:bg-green-950/40"
            : color === "lost"
              ? "border-red-500 bg-red-50 dark:bg-red-950/40"
              : "border-indigo-400 bg-slate-50 dark:bg-slate-800/60"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              color === "won"
                ? "text-green-800 dark:text-green-300"
                : color === "lost"
                  ? "text-red-800 dark:text-red-300"
                  : "text-slate-800 dark:text-slate-200"
            )}
          >
            {label}
          </span>
          <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-1.5 py-0.5">
            {deals.length}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {formatCurrency(totalValue)}
        </span>
      </div>

      {/* área de drop */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 p-2 rounded-b-lg min-h-[120px] flex-1 transition-colors",
          "bg-slate-100/60 dark:bg-slate-800/30 border border-t-0 border-slate-200 dark:border-slate-700",
          isOver && "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700"
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
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-4 select-none">
            Arraste um negócio aqui
          </p>
        )}
      </div>
    </div>
  )
}
