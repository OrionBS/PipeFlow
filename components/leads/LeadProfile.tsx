"use client"

import { Pencil, Mail, Phone, Building2, Briefcase, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge"
import type { Lead } from "@/types"

interface Owner {
  id: string
  name: string
}

interface LeadProfileProps {
  lead: Lead
  owners: Owner[]
  onEdit: () => void
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

export function LeadProfile({ lead, owners, onEdit }: LeadProfileProps) {
  const ownerName = owners.find((o) => o.id === lead.owner_id)?.name ?? "—"

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-tight">{lead.name}</h2>
          {lead.role && lead.company && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {lead.role} · {lead.company}
            </p>
          )}
          {lead.role && !lead.company && (
            <p className="mt-0.5 text-sm text-muted-foreground">{lead.role}</p>
          )}
          {!lead.role && lead.company && (
            <p className="mt-0.5 text-sm text-muted-foreground">{lead.company}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0">
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Editar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="space-y-3">
        <Row icon={<Mail className="h-4 w-4" />} label="E-mail">
          <a
            href={`mailto:${lead.email}`}
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            {lead.email}
          </a>
        </Row>

        {lead.phone && (
          <Row icon={<Phone className="h-4 w-4" />} label="Telefone">
            <span className="text-sm">{lead.phone}</span>
          </Row>
        )}

        {lead.company && (
          <Row icon={<Building2 className="h-4 w-4" />} label="Empresa">
            <span className="text-sm">{lead.company}</span>
          </Row>
        )}

        {lead.role && (
          <Row icon={<Briefcase className="h-4 w-4" />} label="Cargo">
            <span className="text-sm">{lead.role}</span>
          </Row>
        )}

        <Row icon={<Calendar className="h-4 w-4" />} label="Criado em">
          <span className="text-sm">{formatDate(lead.created_at)}</span>
        </Row>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
          Responsável
        </p>
        <p className="text-sm font-medium">{ownerName}</p>
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}
