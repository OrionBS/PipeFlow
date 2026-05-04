import type { DealStage } from "@/types"

interface ColumnConfig {
  label: string
  color: "default" | "won" | "lost"
  accent: string
}

export const COLUMN_CONFIG: Record<DealStage, ColumnConfig> = {
  new_lead:      { label: "Novo Lead",          color: "default", accent: "#3B82F6" },
  contacted:     { label: "Contato Realizado",   color: "default", accent: "#06B6D4" },
  proposal_sent: { label: "Proposta Enviada",    color: "default", accent: "#F59E0B" },
  negotiation:   { label: "Negociação",          color: "default", accent: "#F97316" },
  closed_won:    { label: "Fechado Ganho",       color: "won",     accent: "#22C55E" },
  closed_lost:   { label: "Fechado Perdido",     color: "lost",    accent: "#EF4444" },
}

export const ACTIVE_STAGES: DealStage[] = [
  "new_lead",
  "contacted",
  "proposal_sent",
  "negotiation",
]
