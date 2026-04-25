"use client"

import { useState } from "react"
import { Building2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MOCK_CURRENT_WORKSPACE } from "@/lib/mock-data"

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

export default function WorkspaceSettingsPage() {
  const [name, setName] = useState(MOCK_CURRENT_WORKSPACE.name)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Workspace" description="Informações gerais do seu workspace">
      <div className="grid gap-6">
        {/* logo */}
        <div className="grid gap-2">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Logo
          </Label>
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(202,255,51,0.1)", border: "1px solid rgba(202,255,51,0.2)" }}
            >
              <Building2 className="h-6 w-6" style={{ color: "#CAFF33" }} />
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
              Enviar imagem
            </button>
          </div>
        </div>

        {/* name */}
        <div className="grid gap-1.5">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Nome do Workspace <span style={{ color: "#EF4444" }}>*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-sm border-0 max-w-sm focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
            style={inputStyle}
          />
        </div>

        {/* slug — read only */}
        <div className="grid gap-1.5">
          <Label style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Slug (URL)
          </Label>
          <div className="flex items-center gap-0 max-w-sm">
            <span
              className="h-9 flex items-center px-3 rounded-l-md text-sm select-none"
              style={{
                background: "rgba(14,14,16,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRight: "none",
                color: "#555559",
                fontFamily: "var(--font-ibm-mono, monospace)",
              }}
            >
              pipeflow.app/
            </span>
            <Input
              value={MOCK_CURRENT_WORKSPACE.slug}
              readOnly
              className="h-9 text-sm border-0 rounded-l-none focus-visible:ring-0"
              style={{
                ...inputStyle,
                color: "#555559",
                cursor: "default",
                borderRadius: "0 6px 6px 0",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
          <p className="text-[11px]" style={{ color: "#555559" }}>O slug não pode ser alterado após a criação.</p>
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
