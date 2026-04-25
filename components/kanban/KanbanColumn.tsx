"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { DealCard } from "./DealCard"
import type { Deal, DealStage } from "@/types"

interface ColumnConfig {
  label: string
  color: "default" | "won" | "lost"
  accent: string
}

export const COLUMN_CONFIG: Record<DealStage, ColumnConfig> = {
  new_lead:      { label: "Novo Lead",          color: "default", accent: "#3B82F6" },
  contacted:     { label: "Contato Realizado",   color: "default", accent: "#06B6D4" },
  proposal_sent: { label: "Proposta Enviada",    color: "default", accent: "#F59E0B" },
  negotiation:   { label: "Negociação",          color: "default", accent: "#F97316" },
  closed_won:    { label: "Fechado Ganho",       color: "won",     accent: "#22C55E" },
  closed_lost:   { label: "Fechado Perdido",     color: "lost",    accent: "#EF4444" },
}

const STAGGER_CLASS = [
  "pf-stagger-1", "pf-stagger-2", "pf-stagger-3",
  "pf-stagger-4", "pf-stagger-5", "pf-stagger-6",
]

interface KanbanColumnProps {
  stage: DealStage
  staggerIndex: number
  deals: Deal[]
  leadNames: Record<string, string>
  ownerInitials: Record<string, string>
  onCardClick: (deal: Deal) => void
  onNewDeal?: () => void
}

export function KanbanColumn({
  stage,
  staggerIndex,
  deals,
  leadNames,
  ownerInitials,
  onCardClick,
  onNewDeal,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const { label, accent } = COLUMN_CONFIG[stage]
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      className={cn(
        "flex flex-col w-[300px] shrink-0 snap-start rounded-xl overflow-hidden",
        STAGGER_CLASS[staggerIndex] ?? "pf-stagger-1"
      )}
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* cabeçalho */}
      <div className="px-3 pt-3 pb-2">
        {/* linha 1: dot + label + contador + botão + */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {/* dot colorido */}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}88` }}
            />
            <span
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-ibm-mono, monospace)",
                color: "#8A8A8F",
              }}
            >
              {label}
            </span>
            <span
              className="text-[11px] font-bold tabular-nums ml-0.5"
              style={{ color: accent }}
            >
              {deals.length}
            </span>
          </div>

          {onNewDeal && (
            <button
              onClick={onNewDeal}
              className="flex items-center justify-center w-5 h-5 rounded transition-colors duration-150"
              style={{ color: "#555559" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#CAFF33"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#555559"
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* linha 2: valor total */}
        <p
          className="text-xl font-bold tabular-nums tracking-tight leading-none"
          style={{
            fontFamily: "var(--font-syne, sans-serif)",
            color: "#E8E8E8",
          }}
        >
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* separador */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 12px" }} />

      {/* área de drop */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 p-3 flex-1 min-h-[120px]",
          "transition-colors duration-150"
        )}
        style={{
          background: isOver ? `${accent}08` : "transparent",
        }}
      >
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              leadName={leadNames[deal.lead_id] ?? "Lead desconhecido"}
              ownerInitials={deal.owner_id ? (ownerInitials[deal.owner_id] ?? "?") : "?"}
              stageAccent={accent}
              onClick={() => onCardClick(deal)}
            />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="flex-1 flex items-center justify-center min-h-[60px]">
            <p
              className="text-[11px] select-none"
              style={{ color: "#2A2A2E" }}
            >
              Arraste aqui
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
