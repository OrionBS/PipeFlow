"use client"

import { useState, useCallback } from "react"
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
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const didDragRef = { current: false }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const dealsByStage = useCallback(
    (stage: DealStage) => deals.filter((d) => d.stage === stage),
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {deals.length} negócio{deals.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <Button onClick={onNewDeal} size="sm" className="gap-2">
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
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 items-start">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage(stage)}
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
