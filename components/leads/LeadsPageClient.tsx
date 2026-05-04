"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Users } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { LeadSearch } from "@/components/leads/LeadSearch"
import { LeadFilters } from "@/components/leads/LeadFilters"
import { LeadTable } from "@/components/leads/LeadTable"
import { LeadForm } from "@/components/leads/LeadForm"
import {
  createLeadAction,
  updateLeadAction,
  deleteLeadAction,
} from "@/actions/leads"
import type { Lead, LeadStatus } from "@/types"

interface Owner {
  id: string
  name: string
}

interface LeadsPageClientProps {
  leads: Lead[]
  total: number
  owners: Owner[]
  currentSearch: string
  currentStatus: LeadStatus | "all"
  currentOwner: string
  currentPage: number
  pageSize: number
  plan: string
  leadCount: number
  leadLimit: number
}

export function LeadsPageClient({
  leads,
  total,
  owners,
  currentSearch,
  currentStatus,
  currentOwner,
  currentPage,
  pageSize,
  plan,
  leadCount,
  leadLimit,
}: LeadsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(currentSearch)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function buildUrl(overrides: Record<string, string | number>) {
    const params = new URLSearchParams()
    const merged: Record<string, string> = {
      q: currentSearch,
      status: currentStatus,
      owner: currentOwner,
      page: String(currentPage),
      ...Object.fromEntries(
        Object.entries(overrides).map(([k, v]) => [k, String(v)])
      ),
    }
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "all" && v !== "1" && v !== "") {
        params.set(k, v)
      }
    }
    return `/leads?${params.toString()}`
  }

  // Debounce search input → URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== currentSearch) {
        startTransition(() => {
          router.replace(buildUrl({ q: searchInput, page: 1 }))
        })
      }
    }, 350)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Sync local search input when URL param changes externally
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  function handleStatusChange(value: LeadStatus | "all") {
    startTransition(() => {
      router.replace(buildUrl({ status: value, page: 1 }))
    })
  }

  function handleOwnerChange(value: string) {
    startTransition(() => {
      router.replace(buildUrl({ owner: value, page: 1 }))
    })
  }

  function handlePageChange(page: number) {
    startTransition(() => {
      router.replace(buildUrl({ page }))
    })
  }

  function handleNewLead() {
    setEditingLead(null)
    setFormOpen(true)
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setFormOpen(true)
  }

  async function handleDelete(lead: Lead) {
    const result = await deleteLeadAction(lead.id)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Lead excluído.")
    startTransition(() => router.refresh())
  }

  async function handleSubmit(data: Partial<Lead>): Promise<string | null> {
    if (editingLead) {
      const result = await updateLeadAction(editingLead.id, data)
      if (result?.error) return result.error
      toast.success("Lead atualizado.")
    } else {
      const result = await createLeadAction(data as Omit<Lead, "id" | "workspace_id" | "created_at">)
      if ("error" in result) {
        if (result.error.includes("Limite")) {
          toast.error(result.error, {
            description: "Acesse Configurações > Plano para fazer upgrade.",
            duration: 6000,
          })
          return null
        }
        return result.error
      }
      toast.success("Lead criado com sucesso.")
    }

    startTransition(() => router.refresh())
    return null
  }

  const isFiltered = currentSearch || currentStatus !== "all" || currentOwner !== "all"

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {plan === "free" ? (
              <span>
                <span className={leadCount >= leadLimit ? "text-destructive font-medium" : ""}>
                  {leadCount}/{leadLimit}
                </span>
                {" leads usados"}
              </span>
            ) : (
              <span>{total} {total === 1 ? "lead cadastrado" : "leads cadastrados"}</span>
            )}
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
        <LeadSearch value={searchInput} onChange={setSearchInput} />
        <LeadFilters
          statusFilter={currentStatus}
          ownerFilter={currentOwner}
          owners={owners}
          onStatusChange={handleStatusChange}
          onOwnerChange={handleOwnerChange}
        />
      </div>

      {leads.length === 0 && isFiltered ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Nenhum lead corresponde aos filtros</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tente ajustar a busca ou os filtros aplicados.
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Nenhum lead ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clique em &quot;Novo lead&quot; para começar.
          </p>
        </div>
      ) : (
        <LeadTable
          leads={leads}
          owners={owners}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <LeadForm
        open={formOpen}
        onOpenChange={setFormOpen}
        lead={editingLead}
        owners={owners}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
