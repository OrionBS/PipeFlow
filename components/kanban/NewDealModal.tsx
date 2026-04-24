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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Negócio</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Título */}
          <div className="grid gap-1.5">
            <Label htmlFor="deal-title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deal-title"
              placeholder="Ex: Licença Pro - Empresa X"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Valor */}
          <div className="grid gap-1.5">
            <Label htmlFor="deal-value">
              Valor (R$) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deal-value"
              type="number"
              min="0"
              placeholder="0,00"
              value={form.value}
              onChange={(e) => set("value")(e.target.value)}
            />
            {errors.value && <p className="text-xs text-red-500">{errors.value}</p>}
          </div>

          {/* Lead */}
          <div className="grid gap-1.5">
            <Label>
              Lead vinculado <span className="text-red-500">*</span>
            </Label>
            <Select value={form.lead_id} onValueChange={set("lead_id")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} {lead.company ? `— ${lead.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lead_id && <p className="text-xs text-red-500">{errors.lead_id}</p>}
          </div>

          {/* Responsável */}
          <div className="grid gap-1.5">
            <Label>Responsável</Label>
            <Select value={form.owner_id} onValueChange={set("owner_id")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.user_id ?? m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Prazo */}
            <div className="grid gap-1.5">
              <Label htmlFor="deal-deadline">Prazo</Label>
              <Input
                id="deal-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline")(e.target.value)}
              />
            </div>

            {/* Etapa */}
            <div className="grid gap-1.5">
              <Label>Etapa inicial</Label>
              <Select value={form.stage} onValueChange={set("stage")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(COLUMN_CONFIG) as [DealStage, { label: string }][]).map(
                    ([stage, { label }]) => (
                      <SelectItem key={stage} value={stage}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar negócio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
