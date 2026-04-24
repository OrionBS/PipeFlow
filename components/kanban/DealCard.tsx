"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays, GripVertical } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import type { Deal } from "@/types"

interface DealCardProps {
  deal: Deal
  leadName: string
  ownerInitials: string
  onClick: () => void
}

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function DealCard({ deal, leadName, ownerInitials, onClick }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const overdue = isOverdue(deal.deadline)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group relative bg-white dark:bg-slate-800 rounded-lg border p-3 shadow-sm",
        "cursor-grab active:cursor-grabbing select-none",
        "hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all",
        overdue
          ? "border-red-300 dark:border-red-700"
          : "border-slate-200 dark:border-slate-700",
        isDragging && "opacity-40 shadow-lg ring-2 ring-indigo-400"
      )}
    >
      <GripVertical className="absolute top-2 right-2 h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 pr-5 leading-tight">
        {deal.title}
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
        {leadName}
      </p>

      <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
        {formatCurrency(deal.value)}
      </p>

      <div className="flex items-center justify-between mt-3">
        {deal.deadline ? (
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              overdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <CalendarDays className="h-3 w-3" />
            {formatDeadline(deal.deadline)}
            {overdue && " • atrasado"}
          </span>
        ) : (
          <span />
        )}

        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
          {ownerInitials}
        </div>
      </div>
    </div>
  )
}
