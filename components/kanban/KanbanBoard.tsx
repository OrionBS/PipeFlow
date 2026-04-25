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
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanColumn, COLUMN_CONFIG } from "./KanbanColumn"
import { DealCard } from "./DealCard"
import type { Deal, DealStage } from "@/types"

const STAGES = Object.keys(COLUMN_CONFIG) as DealStage[]

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
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="shrink-0">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {visibleDeals.length} negócio{visibleDeals.length !== 1 ? "s" : ""}
            {search.trim() ? " encontrado" + (visibleDeals.length !== 1 ? "s" : "") : " no total"}
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lead ou negócio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={onNewDeal} size="sm" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Novo Negócio
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 items-start min-w-0 touch-pan-x">
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

        <DragOverlay>
          {activeDeal ? (
            <DealCard
              deal={activeDeal}
              leadName={leadNames[activeDeal.lead_id] ?? "Lead desconhecido"}
              ownerInitials={activeDeal.owner_id ? (ownerInitials[activeDeal.owner_id] ?? "?") : "?"}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
