"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { COLUMN_CONFIG } from "./KanbanColumn"
import type { Deal, DealStage, Lead } from "@/types"

interface Member {
  id: string
  user_id: string | null
  name: string
  initials: string
}

interface NewDealModalProps {
  open: boolean
  onClose: () => void
  onSave: (deal: Omit<Deal, "id" | "workspace_id" | "created_at">) => void
  leads: Lead[]
  members: Member[]
}

interface FormState {
  title: string
  value: string
  lead_id: string
  owner_id: string
  deadline: string
  stage: DealStage
}

const EMPTY: FormState = {
  title: "",
  value: "",
  lead_id: "",
  owner_id: "",
  deadline: "",
  stage: "new_lead",
}

const STAGES = Object.entries(COLUMN_CONFIG) as [DealStage, { label: string; color: string; accent: string }][]

export function NewDealModal({ open, onClose, onSave, leads, members }: NewDealModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.title.trim()) next.title = "Obrigatório"
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0)
      next.value = "Informe um valor válido"
    if (!form.lead_id) next.lead_id = "Selecione um lead"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({
      lead_id: form.lead_id,
      title: form.title.trim(),
      value: Number(form.value),
      stage: form.stage,
      owner_id: form.owner_id || null,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    })
    setForm(EMPTY)
    setErrors({})
    onClose()
  }

  function handleClose() {
    setForm(EMPTY)
    setErrors({})
    onClose()
  }

  function set(field: keyof FormState) {
    return (value: string | null) => {
      setForm((prev) => ({ ...prev, [field]: value ?? "" }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const inputStyle = {
    background: "rgba(26,26,30,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#E8E8E8",
    fontFamily: "var(--font-dm-sans, sans-serif)",
  }

  const inputErrorStyle = {
    ...inputStyle,
    border: "1px solid rgba(239,68,68,0.5)",
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0"
        style={{
          background: "rgba(14,14,16,0.98)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
        }}
      >
        <DialogHeader
          className="px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <DialogTitle
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              color: "#E8E8E8",
            }}
          >
            Novo Negócio
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 grid gap-4">
          {/* Título */}
          <Field label="Título" required error={errors.title}>
            <Input
              placeholder="Ex: Licença Pro — Empresa X"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={errors.title ? inputErrorStyle : inputStyle}
            />
          </Field>

          {/* Valor */}
          <Field label="Valor (R$)" required error={errors.value}>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
              >
                R$
              </span>
              <Input
                type="number"
                min="0"
                placeholder="0,00"
                value={form.value}
                onChange={(e) => set("value")(e.target.value)}
                className="h-9 text-sm pl-9 border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
                style={{
                  ...(errors.value ? inputErrorStyle : inputStyle),
                  fontFamily: "var(--font-ibm-mono, monospace)",
                  color: "#CAFF33",
                }}
              />
            </div>
          </Field>

          {/* Lead */}
          <Field label="Lead vinculado" required error={errors.lead_id}>
            <Select value={form.lead_id} onValueChange={set("lead_id")}>
              <SelectTrigger
                className="h-9 text-sm border-0 focus:ring-1 focus:ring-[rgba(202,255,51,0.4)]"
                style={errors.lead_id ? inputErrorStyle : inputStyle}
              >
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent style={{ background: "#141416", border: "1px solid rgba(255,255,255,0.08)" }}>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id} style={{ color: "#E8E8E8" }}>
                    {lead.name}{lead.company ? ` — ${lead.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Etapa — pills com cor do estágio */}
          <div className="grid gap-1.5">
            <Label
              className="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
            >
              Etapa inicial
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map(([stage, { label, accent }]) => {
                const active = form.stage === stage
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => set("stage")(stage)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-150"
                    style={{
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      background: active ? accent : "transparent",
                      color: active ? "#0C0C0E" : "#8A8A8F",
                      border: active ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Responsável */}
            <Field label="Responsável">
              <Select value={form.owner_id} onValueChange={set("owner_id")}>
                <SelectTrigger
                  className="h-9 text-sm border-0"
                  style={inputStyle}
                >
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent style={{ background: "#141416", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.user_id ?? m.id} style={{ color: "#E8E8E8" }}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Prazo */}
            <Field label="Prazo">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline")(e.target.value)}
                className="h-9 text-sm border-0"
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        <DialogFooter
          className="px-6 pb-6 pt-0 gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8A8A8F",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="font-semibold transition-all duration-200"
            style={{
              background: "#CAFF33",
              color: "#0C0C0E",
              border: "none",
              fontFamily: "var(--font-syne, sans-serif)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(202,255,51,0.3)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = ""
            }}
          >
            Salvar negócio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label
        className="text-[10px] uppercase tracking-widest font-medium"
        style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}
      >
        {label}
        {required && <span style={{ color: "#EF4444" }} className="ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p
          className="text-[11px] font-medium"
          style={{ color: "#EF4444", fontFamily: "var(--font-dm-sans, sans-serif)" }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
