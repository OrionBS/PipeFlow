"use client"

import { Zap, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MOCK_CURRENT_WORKSPACE, MOCK_LEADS, MOCK_MEMBERS } from "@/lib/mock-data"

const isPro = MOCK_CURRENT_WORKSPACE.plan === "pro"
const LEAD_LIMIT = 50
const MEMBER_LIMIT = 2

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : "#22C55E"
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium" style={{ color: "#8A8A8F", fontFamily: "var(--font-dm-sans, sans-serif)" }}>
          {label}
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color, fontFamily: "var(--font-ibm-mono, monospace)" }}
        >
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function BillingPage() {
  const leadsUsed = MOCK_LEADS.length
  const membersUsed = MOCK_MEMBERS.length

  return (
    <div className="flex flex-col gap-4">
      {/* current plan */}
      <SettingsSection title="Plano Atual" description="Gerencie sua assinatura e limites de uso">
        <div className="flex flex-col gap-5">
          {/* plan badge */}
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{
                background: isPro ? "rgba(202,255,51,0.1)" : "rgba(255,255,255,0.04)",
                border: isPro ? "1px solid rgba(202,255,51,0.25)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Zap
                className="h-5 w-5"
                style={{ color: isPro ? "#CAFF33" : "#555559" }}
              />
            </div>
            <div>
              <p
                className="text-base font-bold"
                style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}
              >
                Plano {isPro ? "Pro" : "Free"}
              </p>
              <p className="text-[12px]" style={{ color: "#555559" }}>
                {isPro ? "Membros e leads ilimitados" : "Até 2 membros e 50 leads"}
              </p>
            </div>
            <span
              className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: isPro ? "rgba(202,255,51,0.1)" : "rgba(255,255,255,0.05)",
                color: isPro ? "#CAFF33" : "#8A8A8F",
                border: isPro ? "1px solid rgba(202,255,51,0.2)" : "1px solid rgba(255,255,255,0.06)",
                fontFamily: "var(--font-ibm-mono, monospace)",
              }}
            >
              {isPro ? "Ativo" : "Grátis"}
            </span>
          </div>

          {/* usage — only for free */}
          {!isPro && (
            <div className="grid gap-3 p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[11px] uppercase tracking-widest font-medium" style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}>
                Uso atual
              </p>
              <UsageBar used={leadsUsed} limit={LEAD_LIMIT} label="Leads" />
              <UsageBar used={membersUsed} limit={MEMBER_LIMIT} label="Membros" />
            </div>
          )}

          {/* cta */}
          {!isPro && (
            <div
              className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: "rgba(202,255,51,0.05)", border: "1px solid rgba(202,255,51,0.15)" }}
            >
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "#CAFF33", fontFamily: "var(--font-syne, sans-serif)" }}>
                  Faça upgrade para o Pro
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "#8A8A8F" }}>
                  Membros e leads ilimitados por apenas R$49/mês
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {["Leads ilimitados", "Membros ilimitados", "Dashboard avançado", "Suporte prioritário"].map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-[11px]" style={{ color: "#8A8A8F" }}>
                      <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: "#22C55E" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                size="sm"
                className="shrink-0 font-semibold gap-2"
                style={{
                  background: "#CAFF33",
                  color: "#0C0C0E",
                  border: "none",
                  fontFamily: "var(--font-syne, sans-serif)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(202,255,51,0.35)"
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = ""
                }}
              >
                <Zap className="h-3.5 w-3.5" />
                Fazer upgrade — R$49/mês
              </Button>
            </div>
          )}

          {/* manage subscription — pro only */}
          {isPro && (
            <button
              type="button"
              className="flex items-center gap-2 text-sm self-start transition-colors duration-150"
              style={{ color: "#555559", fontFamily: "var(--font-dm-sans, sans-serif)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#E8E8E8" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#555559" }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Gerenciar assinatura no Stripe
            </button>
          )}
        </div>
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="text-sm font-bold" style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}>
          {title}
        </h2>
        <p className="text-[12px] mt-0.5" style={{ color: "#555559" }}>{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
