"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { NewDealModal } from "@/components/kanban/NewDealModal"
import { DealDetailModal } from "@/components/kanban/DealDetailModal"
import { MOCK_DEALS, MOCK_LEADS, MOCK_MEMBERS } from "@/lib/mock-data"
import type { Deal } from "@/types"

const leadNames: Record<string, string> = Object.fromEntries(
  MOCK_LEADS.map((l) => [l.id, l.name])
)

const ownerInitials: Record<string, string> = Object.fromEntries(
  MOCK_MEMBERS.filter((m) => m.user_id !== null).map((m) => [m.user_id, m.initials])
)

const ownerNames: Record<string, string> = Object.fromEntries(
  MOCK_MEMBERS.filter((m) => m.user_id !== null).map((m) => [m.user_id, m.name])
)

export default function PipelinePage() {
  const [newDealOpen, setNewDealOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)

  function handleSaveDeal(data: Omit<Deal, "id" | "workspace_id" | "created_at">) {
    const newDeal: Deal = {
      ...data,
      id: `deal-${Date.now()}`,
      workspace_id: "ws-1",
      created_at: new Date().toISOString(),
    }
    setDeals((prev) => [newDeal, ...prev])
  }

  return (
    <div className="flex flex-col h-full min-w-0">
      <KanbanBoard
        deals={deals}
        onDealsChange={setDeals}
        leadNames={leadNames}
        ownerInitials={ownerInitials}
        onNewDeal={() => setNewDealOpen(true)}
        onDealClick={setSelectedDeal}
      />

      <NewDealModal
        open={newDealOpen}
        onClose={() => setNewDealOpen(false)}
        onSave={handleSaveDeal}
        leads={MOCK_LEADS}
        members={MOCK_MEMBERS}
      />

      <DealDetailModal
        deal={selectedDeal}
        leadName={selectedDeal ? (leadNames[selectedDeal.lead_id] ?? "—") : ""}
        ownerName={
          selectedDeal?.owner_id ? (ownerNames[selectedDeal.owner_id] ?? "—") : "—"
        }
        onClose={() => setSelectedDeal(null)}
      />
    </div>
  )
}
