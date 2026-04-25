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

const STAGES = Object.entries(COLUMN_CONFIG) as [DealStage, { label: string; color: string }][]

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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-base font-semibold">Novo Negócio</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 grid gap-4">
          {/* Título */}
          <Field label="Título" required error={errors.title}>
            <Input
              id="deal-title"
              placeholder="Ex: Licença Pro — Empresa X"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              className={cn(errors.title && "border-red-400 dark:border-red-700 focus-visible:ring-red-300")}
            />
          </Field>

          {/* Valor */}
          <Field label="Valor (R$)" required error={errors.value}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">
                R$
              </span>
              <Input
                id="deal-value"
                type="number"
                min="0"
                placeholder="0,00"
                value={form.value}
                onChange={(e) => set("value")(e.target.value)}
                className={cn(
                  "pl-9 font-mono",
                  errors.value && "border-red-400 dark:border-red-700 focus-visible:ring-red-300"
                )}
              />
            </div>
          </Field>

          {/* Lead */}
          <Field label="Lead vinculado" required error={errors.lead_id}>
            <Select value={form.lead_id} onValueChange={set("lead_id")}>
              <SelectTrigger className={cn(errors.lead_id && "border-red-400 dark:border-red-700")}>
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name}{lead.company ? ` — ${lead.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Etapa — pills visuais */}
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Etapa inicial
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map(([stage, { label, color }]) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => set("stage")(stage)}
                  className={cn(
                    "text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all",
                    form.stage === stage
                      ? color === "won"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : color === "lost"
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Responsável */}
            <Field label="Responsável">
              <Select value={form.owner_id} onValueChange={set("owner_id")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.user_id ?? m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Prazo */}
            <Field label="Prazo">
              <Input
                id="deal-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline")(e.target.value)}
                className="h-9 text-sm"
              />
            </Field>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0 gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} className="font-medium">
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
      <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}
