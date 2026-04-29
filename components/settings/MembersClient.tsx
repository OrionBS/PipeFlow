"use client"

import { useState, useTransition } from "react"
import { UserMinus, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteMember, removeMember } from "@/actions/settings"

interface Member {
  id: string
  name: string
  email: string
  initials: string
  role: string
  status: string
}

interface MembersClientProps {
  members: Member[]
  workspaceId: string
  plan: string
}

const AVATAR_COLORS = ["#7C3AED", "#4F46E5", "#0284C7", "#059669", "#D97706"]
function avatarColor(initials: string) {
  let h = 0
  for (const c of initials) h += c.charCodeAt(0)
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

export function MembersClient({ members: initialMembers, workspaceId, plan }: MembersClientProps) {
  const [members, setMembers] = useState(initialMembers)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [inviteSent, setInviteSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const FREE_MEMBER_LIMIT = 2
  const atLimit = plan !== "pro" && members.length >= FREE_MEMBER_LIMIT

  function handleRemove(id: string) {
    startTransition(async () => {
      const result = await removeMember(id, workspaceId)
      if (!result?.error) {
        setMembers((prev) => prev.filter((m) => m.id !== id))
      }
    })
  }

  function handleInvite() {
    const trimmed = inviteEmail.trim()
    if (!trimmed) { setInviteError("Digite um e-mail."); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setInviteError("E-mail inválido."); return }
    if (atLimit) { setInviteError("Limite de membros atingido. Faça upgrade para o Pro."); return }

    setInviteError("")
    startTransition(async () => {
      const result = await inviteMember(trimmed, workspaceId)
      if (result?.error) {
        setInviteError(result.error)
        return
      }
      setInviteEmail("")
      setInviteSent(true)
      setTimeout(() => setInviteSent(false), 2500)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <SettingsSection title="Membros" description="Gerencie quem tem acesso a este workspace">
        <div className="flex flex-col divide-y">
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
                <p className="text-[11px]" style={{ color: "#555559" }}>{m.email}</p>
              </div>
              {m.status === "invited" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", color: "#F59E0B", border: "1px solid rgba(251,191,36,0.2)", fontFamily: "var(--font-ibm-mono, monospace)" }}>
                  Pendente
                </span>
              )}
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
                  disabled={isPending}
                  className="h-7 w-7 rounded-lg flex items-center justify-center transition-colors duration-150 disabled:opacity-40"
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

      <SettingsSection title="Convidar Membro" description="Envie um convite por e-mail para adicionar alguém ao workspace">
        <div className="flex flex-col gap-3 max-w-sm">
          {atLimit && (
            <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              Limite de {FREE_MEMBER_LIMIT} membros atingido no plano Free.
            </p>
          )}
          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              E-mail
            </Label>
            <Input
              type="email"
              placeholder="nome@empresa.com"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setInviteError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              disabled={isPending || atLimit}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
            {inviteError && <p className="text-xs" style={{ color: "#EF4444" }}>{inviteError}</p>}
          </div>
          <Button
            size="sm"
            onClick={handleInvite}
            disabled={isPending || atLimit}
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
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {inviteSent ? "Convite enviado!" : "Enviar convite"}
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="text-sm font-bold" style={{ color: "#E8E8E8", fontFamily: "var(--font-syne, sans-serif)" }}>{title}</h2>
        <p className="text-[12px] mt-0.5" style={{ color: "#555559" }}>{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
