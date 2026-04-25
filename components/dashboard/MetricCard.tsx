"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  accent?: string
  staggerIndex?: number
}

export function MetricCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  accent = "#CAFF33",
  staggerIndex = 0,
}: MetricCardProps) {
  const staggerClass = ["pf-stagger-1", "pf-stagger-2", "pf-stagger-3", "pf-stagger-4"][staggerIndex] ?? "pf-stagger-1"

  return (
    <div
      className={cn("relative rounded-xl overflow-hidden pf-fade-up", staggerClass)}
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* top accent bar */}
      <div className="h-[1.5px]" style={{ background: accent, opacity: 0.6 }} />

      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] uppercase tracking-widest font-medium mb-2"
              style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
            >
              {title}
            </p>
            <p
              className="text-2xl font-bold tabular-nums tracking-tight leading-none"
              style={{
                fontFamily: "var(--font-ibm-mono, monospace)",
                color: accent === "#CAFF33" ? "#CAFF33" : "#E8E8E8",
              }}
            >
              {value}
            </p>
            {change && (
              <p
                className="text-[11px] font-medium mt-2"
                style={{
                  color: changePositive ? "#22C55E" : "#EF4444",
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                }}
              >
                {changePositive ? "↑" : "↓"} {change}
              </p>
            )}
          </div>

          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
        </div>
      </div>
    </div>
  )
}
