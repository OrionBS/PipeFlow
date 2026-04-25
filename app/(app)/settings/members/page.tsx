"use client"

import { useState } from "react"
import { UserMinus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MOCK_MEMBERS } from "@/lib/mock-data"
import type { Member } from "@/types"

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

const AVATAR_COLORS = ["#7C3AED", "#4F46E5", "#0284C7", "#059669", "#D97706"]
function avatarColor(initials: string) {
  let h = 0
  for (const c of initials) h += c.charCodeAt(0)
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export default function MembersPage() {
  const [members, setMembers] = useState(MOCK_MEMBERS)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteSent, setInviteSent] = useState(false)

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return
    setInviteSent(true)
    setInviteEmail("")
    setTimeout(() => setInviteSent(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* member list */}
      <SettingsSection title="Membros" description="Gerencie quem tem acesso a este workspace">
        <div className="flex flex-col divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
                style={{ background: avatarColor(m.initials), fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "#E8E8E8", fontFamily: "var(--font-dm-sans, sans-serif)" }}>
                  {m.name}
                </p>
                <p className="text-[11px]" style={{ color: "#555559" }}>
                  {m.invited_email ?? `${m.name.toLowerCase().replace(" ", ".")}@acmecorp.com`}
                </p>
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: m.role === "admin" ? "rgba(202,255,51,0.1)" : "rgba(255,255,255,0.05)",
                  color: m.role === "admin" ? "#CAFF33" : "#8A8A8F",
                  fontFamily: "var(--font-ibm-mono, monospace)",
                  border: m.role === "admin" ? "1px solid rgba(202,255,51,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {m.role === "admin" ? "Admin" : "Membro"}
              </span>
              {m.role !== "admin" && (
                <button
                  type="button"
                  onClick={() => handleRemove(m.id)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors duration-150"
                  style={{ color: "#555559", background: "transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"
                    ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#555559"
                    ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                  }}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* invite */}
      <SettingsSection title="Convidar Membro" description="Envie um convite por e-mail para adicionar alguém ao workspace">
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              E-mail
            </Label>
            <Input
              type="email"
              placeholder="nome@empresa.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
          </div>
          <Button
            size="sm"
            onClick={handleInvite}
            className="gap-2 self-start"
            style={{
              background: inviteSent ? "#22C55E" : "#CAFF33",
              color: "#0C0C0E",
              border: "none",
              fontFamily: "var(--font-syne, sans-serif)",
              fontWeight: 700,
              transition: "background 0.2s",
            }}
          >
            <Send className="h-3.5 w-3.5" />
            {inviteSent ? "Convite enviado!" : "Enviar convite"}
          </Button>
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
