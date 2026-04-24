"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, User, Tag } from "lucide-react"
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

  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-8 leading-snug">{deal.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-1">
          <Badge
            variant="secondary"
            className={cn(
              config.color === "won"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                : config.color === "lost"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300"
            )}
          >
            {config.label}
          </Badge>

          {overdue && (
            <Badge variant="destructive" className="text-xs">
              Prazo vencido
            </Badge>
          )}
        </div>

        <dl className="grid gap-3 mt-2">
          <Row
            icon={<DollarSign className="h-4 w-4" />}
            label="Valor"
            value={
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(deal.value)}
              </span>
            }
          />
          <Row
            icon={<User className="h-4 w-4" />}
            label="Lead vinculado"
            value={leadName}
          />
          <Row
            icon={<User className="h-4 w-4" />}
            label="Responsável"
            value={ownerName || "—"}
          />
          <Row
            icon={<CalendarDays className="h-4 w-4" />}
            label="Prazo"
            value={
              <span className={cn(overdue && "text-red-600 dark:text-red-400 font-medium")}>
                {formatDate(deal.deadline)}
              </span>
            }
          />
          <Row
            icon={<Tag className="h-4 w-4" />}
            label="Criado em"
            value={formatDate(deal.created_at)}
          />
        </dl>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0">{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="text-sm text-slate-900 dark:text-slate-100">{value}</dd>
      </div>
    </div>
  )
}
