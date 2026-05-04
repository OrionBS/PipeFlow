"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { LeadProfile } from "@/components/leads/LeadProfile"
import { ActivityTimeline } from "@/components/leads/ActivityTimeline"
import { ActivityForm } from "@/components/leads/ActivityForm"
import { LeadForm } from "@/components/leads/LeadForm"
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge"
import { updateLeadAction } from "@/actions/leads"
import { formatCurrency } from "@/lib/utils"
import type { Lead, Activity, Deal } from "@/types"

interface Owner {
  id: string
  name: string
}

interface LeadDetailClientProps {
  lead: Lead
  activities: Activity[]
  deals: Deal[]
  owners: Owner[]
}

const STAGE_LABELS: Record<string, string> = {
  new_lead: "Novo Lead",
  contacted: "Contato Realizado",
  proposal_sent: "Proposta Enviada",
  negotiation: "Negociação",
  closed_won: "Fechado Ganho",
  closed_lost: "Fechado Perdido",
}

export function LeadDetailClient({
  lead: initialLead,
  activities,
  deals,
  owners,
}: LeadDetailClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [lead, setLead] = useState<Lead>(initialLead)
  const [editOpen, setEditOpen] = useState(false)

  // Sync when server re-renders with fresh data
  useEffect(() => {
    setLead(initialLead)
  }, [initialLead])

  async function handleLeadSave(data: Partial<Lead>): Promise<string | null> {
    const result = await updateLeadAction(lead.id, data)
    if (result?.error) return result.error

    setLead((prev) => ({ ...prev, ...data }))
    toast.success("Lead atualizado.")
    startTransition(() => router.refresh())
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Leads
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{lead.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <LeadProfile lead={lead} owners={owners} onEdit={() => setEditOpen(true)} />

          {deals.length > 0 && (
            <div className="rounded-lg border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Negócios ({deals.length})
                </h3>
              </div>
              <ul className="space-y-2">
                {deals.map((deal) => (
                  <li
                    key={deal.id}
                    className="rounded-md border bg-muted/30 p-3 space-y-1.5"
                  >
                    <p className="text-sm font-medium leading-tight">{deal.title}</p>
                    <div className="flex items-center justify-between gap-2">
                      <LeadStatusBadge
                        status={
                          deal.stage === "closed_won"
                            ? "converted"
                            : deal.stage === "closed_lost"
                            ? "unqualified"
                            : "contacted"
                        }
                        className="text-[11px] px-1.5 py-0"
                      />
                      <span className="text-xs font-semibold text-foreground">
                        {formatCurrency(deal.value)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {STAGE_LABELS[deal.stage] ?? deal.stage}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">
                Atividades
                {activities.length > 0 && (
                  <span className="ml-1.5 text-muted-foreground font-normal">
                    ({activities.length})
                  </span>
                )}
              </h3>
              <ActivityForm leadId={lead.id} />
            </div>

            <ActivityTimeline activities={activities} authors={owners} />
          </div>
        </div>
      </div>

      <LeadForm
        open={editOpen}
        onOpenChange={setEditOpen}
        lead={lead}
        owners={owners}
        onSubmit={handleLeadSave}
      />
    </div>
  )
}
