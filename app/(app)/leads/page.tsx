"use client"

import { useState, useMemo } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadSearch } from "@/components/leads/LeadSearch"
import { LeadFilters } from "@/components/leads/LeadFilters"
import { LeadTable } from "@/components/leads/LeadTable"
import { LeadForm } from "@/components/leads/LeadForm"
import { MOCK_LEADS, MOCK_MEMBERS } from "@/lib/mock-data"
import type { Lead, LeadStatus } from "@/types"

const PAGE_SIZE = 10

const OWNERS = MOCK_MEMBERS.map((m) => ({ id: m.user_id ?? m.id, name: m.name }))

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || l.status === statusFilter
      const matchOwner = ownerFilter === "all" || l.owner_id === ownerFilter
      return matchSearch && matchStatus && matchOwner
    })
  }, [leads, search, statusFilter, ownerFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(value: LeadStatus | "all") {
    setStatusFilter(value)
    setPage(1)
  }

  function handleOwnerChange(value: string) {
    setOwnerFilter(value)
    setPage(1)
  }

  function handleNewLead() {
    setEditingLead(null)
    setFormOpen(true)
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setFormOpen(true)
  }

  function handleDelete(lead: Lead) {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
  }

  function handleSubmit(data: Partial<Lead>) {
    if (editingLead) {
      setLeads((prev) =>
        prev.map((l) => (l.id === editingLead.id ? { ...l, ...data } : l))
      )
    } else {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        workspace_id: "ws-1",
        name: data.name!,
        email: data.email!,
        phone: data.phone ?? null,
        company: data.company ?? null,
        role: data.role ?? null,
        status: data.status ?? "new",
        owner_id: data.owner_id ?? null,
        created_at: new Date().toISOString(),
      }
      setLeads((prev) => [newLead, ...prev])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead cadastrado" : "leads cadastrados"}
          </p>
        </div>
        <Button
          onClick={handleNewLead}
          className="shrink-0 bg-[#C8FF00] text-black hover:bg-[#b8ef00] font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo lead
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LeadSearch value={search} onChange={handleSearchChange} />
        <LeadFilters
          statusFilter={statusFilter}
          ownerFilter={ownerFilter}
          owners={OWNERS}
          onStatusChange={handleStatusChange}
          onOwnerChange={handleOwnerChange}
        />
      </div>

      {filtered.length === 0 && (search || statusFilter !== "all" || ownerFilter !== "all") ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Nenhum lead corresponde aos filtros</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tente ajustar a busca ou os filtros aplicados.
          </p>
        </div>
      ) : (
        <LeadTable
          leads={paginated}
          owners={OWNERS}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <LeadForm
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
        owners={OWNERS}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
