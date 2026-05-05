"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/actions/settings"

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

export function ProfileSettingsClient({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const [name, setName] = useState(initialName)
  const [showPass, setShowPass] = useState(false)
  const [password, setPassword] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    const result = await updateProfile({ name: name.trim(), password: password || undefined })
    if (result?.error) {
      setError(result.error)
      return
    }
    setError("")
    setPassword("")
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Perfil" description="Dados pessoais e credenciais de acesso">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Avatar
          </Label>
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ background: "#7C3AED", fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {initials(name || initialEmail)}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Nome
            </Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
          </div>

          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              E-mail
            </Label>
            <Input
              type="email"
              value={initialEmail}
              readOnly
              className="h-9 text-sm border-0 focus-visible:ring-0"
              style={{ ...inputStyle, color: "#555559", cursor: "default" }}
            />
          </div>
        </div>

        <div className="grid gap-1.5 max-w-sm">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Nova senha
          </Label>
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Deixe em branco para manter a atual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm border-0 pr-9 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "#555559" }}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>}

        <div>
          <Button
            size="sm"
            onClick={handleSave}
            style={{
              background: saved ? "#22C55E" : "#CAFF33",
              color: "#0C0C0E",
              border: "none",
              fontFamily: "var(--font-syne, sans-serif)",
              fontWeight: 700,
              transition: "background 0.2s",
            }}
          >
            {saved ? "Salvo!" : "Salvar alterações"}
          </Button>
        </div>
      </div>
    </SettingsSection>
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
