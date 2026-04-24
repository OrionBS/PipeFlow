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
import { STATUS_CONFIG } from "@/components/leads/LeadStatusBadge"
import type { Lead, LeadStatus } from "@/types"

interface Owner {
  id: string
  name: string
}

interface LeadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  owners: Owner[]
  onSubmit: (data: Partial<Lead>) => void
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  status: "new" as LeadStatus,
  owner_id: "",
}

export function LeadForm({ open, onOpenChange, lead, owners, onSubmit }: LeadFormProps) {
  const [form, setForm] = useState({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    company: lead?.company ?? "",
    role: lead?.role ?? "",
    status: lead?.status ?? ("new" as LeadStatus),
    owner_id: lead?.owner_id ?? "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleOpenChange(open: boolean) {
    if (!open) {
      setForm(lead ? {
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? "",
        company: lead.company ?? "",
        role: lead.role ?? "",
        status: lead.status,
        owner_id: lead.owner_id ?? "",
      } : EMPTY_FORM)
      setErrors({})
    }
    onOpenChange(open)
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Nome é obrigatório"
    if (!form.email.trim()) next.email = "E-mail é obrigatório"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "E-mail inválido"
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      ...form,
      phone: form.phone || null,
      company: form.company || null,
      role: form.role || null,
      owner_id: form.owner_id || null,
    })
    handleOpenChange(false)
  }

  const isEditing = !!lead

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar lead" : "Novo lead"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rafael Oliveira"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="rafael@empresa.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="TechStart Ltda"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="CTO"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Responsável</Label>
              <Select
                value={form.owner_id}
                onValueChange={(v) => setForm({ ...form, owner_id: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Salvar alterações" : "Criar lead"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
