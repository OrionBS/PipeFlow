"use client"

import { useState } from "react"
import { Upload, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MOCK_USER } from "@/lib/mock-data"

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

export default function ProfilePage() {
  const [name, setName] = useState(MOCK_USER.name)
  const [email, setEmail] = useState(MOCK_USER.email)
  const [showPass, setShowPass] = useState(false)
  const [password, setPassword] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Perfil" description="Dados pessoais e credenciais de acesso">
      <div className="grid gap-6">
        {/* avatar */}
        <div className="grid gap-2">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Avatar
          </Label>
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ background: "#7C3AED", fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {MOCK_USER.initials}
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#8A8A8F",
                fontFamily: "var(--font-dm-sans, sans-serif)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#E8E8E8"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#8A8A8F"
              }}
            >
              <Upload className="h-3.5 w-3.5" />
              Alterar foto
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
          {/* name */}
          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Nome
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
          </div>

          {/* email */}
          <div className="grid gap-1.5">
            <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              E-mail
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
          </div>
        </div>

        {/* password */}
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
