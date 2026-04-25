"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarDays, User, Tag, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { COLUMN_CONFIG } from "./KanbanColumn"
import type { Deal } from "@/types"

interface DealDetailModalProps {
  deal: Deal | null
  leadName: string
  ownerName: string
  onClose: () => void
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function DealDetailModal({ deal, leadName, ownerName, onClose }: DealDetailModalProps) {
  if (!deal) return null

  const config = COLUMN_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)
  const stageAccent = config.accent

  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0"
        style={{
          background: "rgba(14,14,16,0.97)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
        }}
      >
        {/* linha colorida do estágio no topo */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: stageAccent }}
        />

        {/* cabeçalho */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-base font-bold leading-snug pr-6"
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                color: "#E8E8E8",
              }}
            >
              {deal.title}
            </DialogTitle>
          </DialogHeader>

          {/* badges de estágio e prazo */}
          <div className="flex items-center gap-2 mt-3">
            <span
              className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: `${stageAccent}18`,
                color: stageAccent,
                border: `1px solid ${stageAccent}33`,
                fontFamily: "var(--font-dm-sans, sans-serif)",
              }}
            >
              {config.label}
            </span>

            {overdue && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  color: "#EF4444",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <Clock className="h-3 w-3" />
                Prazo vencido
              </span>
            )}
          </div>

          {/* valor em destaque */}
          <p
            className="text-2xl font-bold mt-4 tabular-nums tracking-tight"
            style={{
              fontFamily: "var(--font-ibm-mono, monospace)",
              color: "#CAFF33",
            }}
          >
            {formatCurrency(deal.value)}
          </p>
        </div>

        {/* detalhes */}
        <dl className="px-6 py-5 grid gap-4">
          <Row icon={<User className="h-4 w-4" />} label="Lead vinculado">
            <span className="font-medium" style={{ color: "#E8E8E8" }}>{leadName}</span>
          </Row>
          <Row icon={<User className="h-4 w-4" />} label="Responsável">
            <span style={{ color: "#E8E8E8" }}>{ownerName || "—"}</span>
          </Row>
          <Row icon={<CalendarDays className="h-4 w-4" />} label="Prazo">
            <span
              style={{ color: overdue ? "#EF4444" : "#E8E8E8" }}
              className={cn(overdue && "font-medium")}
            >
              {formatDate(deal.deadline)}
            </span>
          </Row>
          <Row icon={<Tag className="h-4 w-4" />} label="Criado em">
            <span style={{ color: "#8A8A8F" }}>{formatDate(deal.created_at)}</span>
          </Row>
        </dl>
      </DialogContent>
    </Dialog>
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
      <div className="mt-0.5 shrink-0" style={{ color: "#555559" }}>{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <dt
          className="text-[10px] uppercase tracking-widest font-medium"
          style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
        >
          {label}
        </dt>
        <dd
          className="text-sm"
          style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
        >
          {children}
        </dd>
      </div>
    </div>
  )
}
