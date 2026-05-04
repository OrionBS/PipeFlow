"use client"

import { useState, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import type { Deal } from "@/types"

interface DealCardProps {
  deal: Deal
  leadName: string
  ownerInitials: string
  stageAccent: string
  onClick: () => void
}

function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  })
}

function avatarBg(initials: string): string {
  const colors = [
    "#7C3AED", "#4F46E5", "#0284C7", "#0D9488",
    "#059669", "#D97706", "#DC2626", "#DB2777",
  ]
  let hash = 0
  for (let i = 0; i < initials.length; i++) hash += initials.charCodeAt(i)
  return colors[hash % colors.length]
}

export function DealCard({ deal, leadName, ownerInitials, stageAccent, onClick }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  // Initialized to false to match SSR; set on the client after hydration to avoid mismatch
  const [overdue, setOverdue] = useState(false)
  useEffect(() => {
    if (deal.deadline) setOverdue(new Date(deal.deadline) < new Date())
  }, [deal.deadline])

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
        "group relative rounded-lg select-none cursor-grab active:cursor-grabbing",
        "transition-all duration-200",
        isDragging && "opacity-20 scale-[0.97]"
      )}
    >
      <div
        className="rounded-lg overflow-hidden transition-all duration-200"
        style={{
          background: "#1A1A1E",
          border: overdue
            ? "1px solid rgba(239,68,68,0.3)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = overdue ? "rgba(239,68,68,0.55)" : `${stageAccent}44`
          el.style.transform = "translateY(-1px)"
          el.style.boxShadow = overdue
            ? "0 4px 16px rgba(239,68,68,0.1)"
            : `0 4px 16px ${stageAccent}12`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = overdue ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"
          el.style.transform = ""
          el.style.boxShadow = ""
        }}
      >
        {/* barra superior colorida do estágio */}
        <div
          className="h-[1.5px]"
          style={{ background: overdue ? "#EF4444" : stageAccent, opacity: 0.7 }}
        />

        <div className="px-3 py-3">
          {/* título */}
          <p
            className="text-[13px] font-semibold leading-snug line-clamp-2"
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              color: "#E8E8E8",
            }}
          >
            {deal.title}
          </p>

          {/* avatar + nome do lead */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: avatarBg(ownerInitials),
                fontSize: "9px",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--font-syne, sans-serif)",
              }}
            >
              {ownerInitials}
            </div>
            <p
              className="text-[11px] truncate"
              style={{ color: "#8A8A8F" }}
            >
              {leadName}
            </p>
          </div>

          {/* separador */}
          <div
            className="my-2"
            style={{ height: "1px", background: "rgba(255,255,255,0.04)" }}
          />

          {/* valor + responsável + data */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p
                className="text-sm font-semibold tabular-nums tracking-tight"
                style={{
                  fontFamily: "var(--font-ibm-mono, monospace)",
                  color: "#CAFF33",
                }}
              >
                {formatCurrency(deal.value)}
              </p>

              {deal.deadline && (
                <span
                  className="flex items-center gap-1 text-[11px] font-medium mt-1"
                  style={{ color: overdue ? "#EF4444" : "#555559" }}
                >
                  <CalendarDays className="h-3 w-3 shrink-0" />
                  {formatDeadline(deal.deadline)}
                  {overdue && (
                    <span style={{ color: "#EF4444" }}>· Vencido</span>
                  )}
                </span>
              )}
            </div>

            {/* nome do responsável uppercase */}
            <span
              className="text-[10px] font-semibold tracking-wider uppercase shrink-0"
              style={{
                color: "#555559",
                fontFamily: "var(--font-ibm-mono, monospace)",
              }}
            >
              {ownerInitials}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
