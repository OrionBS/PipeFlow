"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_CONFIG } from "@/components/leads/LeadStatusBadge"
import type { LeadStatus } from "@/types"

interface Owner {
  id: string
  name: string
}

interface LeadFiltersProps {
  statusFilter: LeadStatus | "all"
  ownerFilter: string
  owners: Owner[]
  onStatusChange: (value: LeadStatus | "all") => void
  onOwnerChange: (value: string) => void
}

export function LeadFilters({
  statusFilter,
  ownerFilter,
  owners,
  onStatusChange,
  onOwnerChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusChange((v ?? "all") as LeadStatus | "all")}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={ownerFilter} onValueChange={(v) => onOwnerChange(v ?? "all")}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {owners.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
