"use client"

import { useState, useMemo, useRef } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus, Search, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, formatCurrency } from "@/lib/utils"
import { KanbanColumn, COLUMN_CONFIG } from "./KanbanColumn"
import { DealCard } from "./DealCard"
import type { Deal, DealStage } from "@/types"

const STAGES = Object.keys(COLUMN_CONFIG) as DealStage[]
const ACTIVE_STAGES: DealStage[] = ["new_lead", "contacted", "proposal_sent", "negotiation"]

interface KanbanBoardProps {
  deals: Deal[]
  onDealsChange: (deals: Deal[] | ((prev: Deal[]) => Deal[])) => void
  leadNames: Record<string, string>
  ownerInitials: Record<string, string>
  onNewDeal: () => void
  onDealClick: (deal: Deal) => void
}

export function KanbanBoard({
  deals,
  onDealsChange: setDeals,
  leadNames,
  ownerInitials,
  onNewDeal,
  onDealClick,
}: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)
  const [search, setSearch] = useState("")
  const didDragRef = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const visibleDeals = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) => {
      const leadName = (leadNames[d.lead_id] ?? "").toLowerCase()
      const title = d.title.toLowerCase()
      return leadName.includes(q) || title.includes(q)
    })
  }, [deals, search, leadNames])

  const dealsByStage = useMemo(() => {
    const map = new Map<DealStage, Deal[]>()
    for (const stage of STAGES) map.set(stage, [])
    for (const deal of visibleDeals) map.get(deal.stage)?.push(deal)
    return map
  }, [visibleDeals])

  const pipelineValue = useMemo(
    () => deals
      .filter((d) => ACTIVE_STAGES.includes(d.stage))
      .reduce((sum, d) => sum + d.value, 0),
    [deals]
  )

  const overdueCount = useMemo(
    () => deals.filter((d) =>
      d.deadline && new Date(d.deadline) < new Date() && ACTIVE_STAGES.includes(d.stage)
    ).length,
    [deals]
  )

  function handleDragStart({ active }: DragStartEvent) {
    didDragRef.current = true
    const found = deals.find((d) => d.id === active.id)
    setActiveDeal(found ?? null)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    const overIsStage = STAGES.includes(overId as DealStage)
    const targetStage = overIsStage
      ? (overId as DealStage)
      : (deals.find((d) => d.id === overId)?.stage ?? null)
    if (!targetStage) return
    setDeals((prev) =>
      prev.map((d) =>
        d.id === activeId && d.stage !== targetStage ? { ...d, stage: targetStage } : d
      )
    )
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveDeal(null)
    setTimeout(() => { didDragRef.current = false }, 0)
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    const overIsStage = STAGES.includes(overId as DealStage)
    if (overIsStage) return
    setDeals((prev) => {
      const activeIndex = prev.findIndex((d) => d.id === activeId)
      const overIndex = prev.findIndex((d) => d.id === overId)
      if (activeIndex === -1 || overIndex === -1) return prev
      return arrayMove(prev, activeIndex, overIndex)
    })
  }

  return (
    <div className="flex flex-col h-full pf-page-enter">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <h1
              className="text-xl font-bold leading-none"
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                color: "#E8E8E8",
              }}
            >
              Pipeline
            </h1>
            <p className="text-xs mt-1" style={{ color: "#555559" }}>
              {visibleDeals.length} negócio{visibleDeals.length !== 1 ? "s" : ""}
              {search.trim() ? " encontrado" + (visibleDeals.length !== 1 ? "s" : "") : ""}
            </p>
          </div>

          {/* badge valor total do pipeline */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(202,255,51,0.08)",
              border: "1px solid rgba(202,255,51,0.18)",
            }}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color: "#CAFF33" }} />
            <span
              className="text-xs font-semibold tabular-nums"
              style={{
                fontFamily: "var(--font-ibm-mono, monospace)",
                color: "#CAFF33",
              }}
            >
              {formatCurrency(pipelineValue)}
            </span>
          </div>

          {/* badge deals atrasados */}
          {overdueCount > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#EF4444" }} />
              <span
                className="text-xs font-semibold"
                style={{ color: "#EF4444" }}
              >
                {overdueCount} atrasado{overdueCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative w-full max-w-[220px]">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
              style={{ color: "#555559" }}
            />
            <Input
              placeholder="Buscar negócio ou lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pl-8 h-8 text-sm",
                "placeholder:text-[#555559]"
              )}
              style={{
                background: "rgba(20,20,22,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#E8E8E8",
                fontFamily: "var(--font-dm-sans, sans-serif)",
              }}
            />
          </div>

          <Button
            onClick={onNewDeal}
            size="sm"
            className="h-8 gap-1.5 shrink-0 text-sm font-semibold transition-all duration-200"
            style={{
              background: "#CAFF33",
              color: "#0C0C0E",
              border: "none",
              fontFamily: "var(--font-syne, sans-serif)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 22px rgba(202,255,51,0.35)"
              ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = ""
              ;(e.currentTarget as HTMLButtonElement).style.transform = ""
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Negócio
          </Button>
        </div>
      </div>

      <DndContext
        id="kanban-dnd"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-4 flex-1 items-start min-w-0 scroll-smooth",
            "snap-x snap-mandatory md:snap-none",
            "touch-pan-x",
            "[&::-webkit-scrollbar]:h-1",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:bg-[rgba(202,255,51,0.15)]"
          )}
        >
          {STAGES.map((stage, i) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              staggerIndex={i}
              deals={dealsByStage.get(stage) ?? []}
              leadNames={leadNames}
              ownerInitials={ownerInitials}
              onCardClick={(deal) => {
                if (!didDragRef.current) onDealClick(deal)
              }}
              onNewDeal={onNewDeal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal ? (
            <div className="rotate-1 scale-105 opacity-95" style={{ filter: "drop-shadow(0 12px 28px rgba(202,255,51,0.18))" }}>
              <DealCard
                deal={activeDeal}
                leadName={leadNames[activeDeal.lead_id] ?? "Lead desconhecido"}
                ownerInitials={activeDeal.owner_id ? (ownerInitials[activeDeal.owner_id] ?? "?") : "?"}
                stageAccent={COLUMN_CONFIG[activeDeal.stage].accent}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
