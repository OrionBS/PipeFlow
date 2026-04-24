import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LeadStatus } from "@/types"

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "Novo",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  contacted: {
    label: "Contatado",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  qualified: {
    label: "Qualificado",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
  unqualified: {
    label: "Desqualificado",
    className: "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
  },
  converted: {
    label: "Convertido",
    className: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

export { STATUS_CONFIG }
