"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

interface FunnelDataPoint {
  label: string
  count: number
  value: number
  accent: string
}

interface FunnelChartProps {
  data: FunnelDataPoint[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: FunnelDataPoint }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-sm"
      style={{
        background: "rgba(14,14,16,0.97)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        fontFamily: "var(--font-dm-sans, sans-serif)",
      }}
    >
      <p className="font-semibold mb-1" style={{ color: d.accent }}>{d.label}</p>
      <p className="text-[12px]" style={{ color: "#8A8A8F" }}>
        {d.count} negócio{d.count !== 1 ? "s" : ""}
      </p>
      <p
        className="text-[12px] font-semibold tabular-nums"
        style={{ color: "#CAFF33", fontFamily: "var(--font-ibm-mono, monospace)" }}
      >
        {formatCurrency(d.value)}
      </p>
    </div>
  )
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <div
      className="rounded-xl overflow-hidden pf-fade-up pf-stagger-3"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-medium"
          style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
        >
          Funil de Vendas
        </p>
        <p
          className="text-sm font-semibold mt-0.5"
          style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}
        >
          Negócios por etapa
        </p>
      </div>

      <div className="px-4 py-4" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            barCategoryGap="28%"
          >
            <XAxis
              type="number"
              tick={{ fill: "#555559", fontSize: 10, fontFamily: "var(--font-ibm-mono, monospace)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              tick={{ fill: "#8A8A8F", fontSize: 11, fontFamily: "var(--font-dm-sans, sans-serif)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.accent} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
