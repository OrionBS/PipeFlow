"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { NewDealModal } from "@/components/kanban/NewDealModal"
import { DealDetailModal } from "@/components/kanban/DealDetailModal"
import { moveDealAction } from "@/actions/deals"
import type { Deal, DealStage, Lead } from "@/types"
import type { Owner } from "@/lib/members"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface PipelineClientProps {
  initialDeals: Deal[]
  leads: Lead[]
  owners: Owner[]
}

export function PipelineClient({ initialDeals, leads, owners }: PipelineClientProps) {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [newDealOpen, setNewDealOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  const leadNames: Record<string, string> = Object.fromEntries(
    leads.map((l) => [l.id, l.name])
  )
  const ownerInitials: Record<string, string> = Object.fromEntries(
    owners.map((o) => [o.id, getInitials(o.name)])
  )
  const ownerNames: Record<string, string> = Object.fromEntries(
    owners.map((o) => [o.id, o.name])
  )

  async function handleMoveDeal(id: string, newStage: DealStage) {
    const result = await moveDealAction(id, newStage)
    if (result?.error) {
      // Revert optimistic update on error
      router.refresh()
    }
  }

  function handleDealCreated(deal: Deal) {
    setDeals((prev) => [deal, ...prev])
  }

  function handleDealUpdated(updated: Deal) {
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setSelectedDeal(updated)
  }

  function handleDealDeleted(id: string) {
    setDeals((prev) => prev.filter((d) => d.id !== id))
    setSelectedDeal(null)
  }

  return (
    <>
      <KanbanBoard
        deals={deals}
        onDealsChange={setDeals}
        leadNames={leadNames}
        ownerInitials={ownerInitials}
        onNewDeal={() => setNewDealOpen(true)}
        onDealClick={setSelectedDeal}
        onMoveDeal={handleMoveDeal}
      />

      <NewDealModal
        open={newDealOpen}
        onClose={() => setNewDealOpen(false)}
        onCreated={handleDealCreated}
        leads={leads}
        owners={owners}
      />

      <DealDetailModal
        deal={selectedDeal}
        leadNames={leadNames}
        ownerNames={ownerNames}
        leads={leads}
        owners={owners}
        onClose={() => setSelectedDeal(null)}
        onUpdated={handleDealUpdated}
        onDeleted={handleDealDeleted}
      />
    </>
  )
}
