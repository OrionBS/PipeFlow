"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays } from "lucide-react"
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

function avatarColor(initials: string): string {
  const colors = [
    "bg-violet-500",
    "bg-indigo-500",
    "bg-sky-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-pink-500",
  ]
  let hash = 0
  for (let i = 0; i < initials.length; i++) hash += initials.charCodeAt(i)
  return colors[hash % colors.length]
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
        "group relative rounded-lg border select-none cursor-grab active:cursor-grabbing",
        "bg-white dark:bg-slate-900",
        "transition-all duration-150",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/80 dark:hover:shadow-slate-950/80",
        overdue
          ? "border-red-200 dark:border-red-900/60 shadow-sm shadow-red-100 dark:shadow-red-950/30"
          : "border-slate-200 dark:border-slate-800 shadow-sm",
        isDragging && "opacity-30 scale-[0.98]"
      )}
    >
      {/* color bar esquerda */}
      <div
        className={cn(
          "absolute left-0 top-2 bottom-2 w-0.5 rounded-full",
          overdue
            ? "bg-red-400 dark:bg-red-600"
            : "bg-indigo-400/60 dark:bg-indigo-500/40"
        )}
      />

      <div className="px-3 py-2.5 pl-4">
        <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
          {deal.title}
        </p>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
          {leadName}
        </p>

        <p className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2 tracking-tight">
          {formatCurrency(deal.value)}
        </p>

        <div className="flex items-center justify-between mt-2">
          {deal.deadline ? (
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] font-medium",
                overdue
                  ? "text-red-500 dark:text-red-400"
                  : "text-slate-400 dark:text-slate-500"
              )}
            >
              <CalendarDays className="h-3 w-3 shrink-0" />
              {formatDeadline(deal.deadline)}
              {overdue && <span className="text-red-500 dark:text-red-400">· atrasado</span>}
            </span>
          ) : (
            <span />
          )}

          <div
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center",
              "text-[10px] font-bold text-white shrink-0",
              avatarColor(ownerInitials)
            )}
          >
            {ownerInitials}
          </div>
        </div>
      </div>
    </div>
  )
}
