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
  initialDeals: Deal[]
  leadNames: Record<string, string>
  ownerInitials: Record<string, string>
  onNewDeal: () => void
  onDealClick: (deal: Deal) => void
}

export function KanbanBoard({
  initialDeals,
  leadNames,
  ownerInitials,
  onNewDeal,
  onDealClick,
}: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
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
    () => deals.filter((d) => d.deadline && new Date(d.deadline) < new Date() && ACTIVE_STAGES.includes(d.stage)).length,
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
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-none">
              Pipeline
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {visibleDeals.length} negócio{visibleDeals.length !== 1 ? "s" : ""}
              {search.trim() ? " encontrado" + (visibleDeals.length !== 1 ? "s" : "") : ""}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-300 tabular-nums">
              {formatCurrency(pipelineValue)}
            </span>
          </div>

          {overdueCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60">
              <AlertCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 shrink-0" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {overdueCount} atrasado{overdueCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative w-full max-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Buscar negócio ou lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pl-8 h-8 text-sm",
                "bg-white dark:bg-slate-900",
                "border-slate-200 dark:border-slate-800",
                "placeholder:text-slate-400 dark:placeholder:text-slate-600"
              )}
            />
          </div>

          <Button
            onClick={onNewDeal}
            size="sm"
            className="h-8 gap-1.5 shrink-0 text-sm font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Negócio
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* scroll horizontal com snap no mobile */}
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-4 flex-1 items-start min-w-0",
            "scroll-smooth",
            // snap para mobile
            "snap-x snap-mandatory md:snap-none",
            // scrollbar fina e discreta
            "[&::-webkit-scrollbar]:h-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            // touch
            "touch-pan-x [-webkit-overflow-scrolling:touch]"
          )}
        >
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage.get(stage) ?? []}
              leadNames={leadNames}
              ownerInitials={ownerInitials}
              onCardClick={(deal) => {
                if (!didDragRef.current) onDealClick(deal)
              }}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal ? (
            <div className="rotate-1 scale-105 opacity-95 drop-shadow-xl">
              <DealCard
                deal={activeDeal}
                leadName={leadNames[activeDeal.lead_id] ?? "Lead desconhecido"}
                ownerInitials={activeDeal.owner_id ? (ownerInitials[activeDeal.owner_id] ?? "?") : "?"}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
