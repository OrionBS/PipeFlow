"use client"

import { useRouter, useSearchParams } from "next/navigation"

const PERIODS = ["7d", "30d", "90d"] as const
type Period = typeof PERIODS[number]

export function PeriodFilter({ period }: { period: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setPeriod(p: Period) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", p)
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-lg"
      style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {PERIODS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPeriod(p)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all duration-150"
          style={{
            fontFamily: "var(--font-ibm-mono, monospace)",
            background: period === p ? "rgba(202,255,51,0.12)" : "transparent",
            color: period === p ? "#CAFF33" : "#555559",
            border: period === p ? "1px solid rgba(202,255,51,0.25)" : "1px solid transparent",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
