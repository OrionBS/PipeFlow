"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { CalendarDays, User, Tag, Clock, Pencil, Trash2, Loader2, X } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { COLUMN_CONFIG } from "./KanbanColumn"
import { updateDealAction, deleteDealAction } from "@/actions/deals"
import type { Deal, DealStage, Lead } from "@/types"
import type { Owner } from "@/lib/members"

interface DealDetailModalProps {
  deal: Deal | null
  leadNames: Record<string, string>
  ownerNames: Record<string, string>
  leads: Lead[]
  owners: Owner[]
  onClose: () => void
  onUpdated: (deal: Deal) => void
  onDeleted: (id: string) => void
}

// Outer shell handles null — inner component receives guaranteed non-null deal
export function DealDetailModal(props: DealDetailModalProps) {
  const { deal, onClose } = props
  return (
    <Dialog open={!!deal} onOpenChange={(o) => !o && onClose()}>
      {deal && <DealDetailContent {...props} deal={deal} />}
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner component — deal is always non-null here
// ─────────────────────────────────────────────────────────────────────────────
type InnerProps = Omit<DealDetailModalProps, "deal"> & { deal: Deal }

const STAGES = Object.entries(COLUMN_CONFIG) as [DealStage, { label: string; color: string; accent: string }][]

const inputStyle = {
  background: "rgba(26,26,30,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#E8E8E8",
  fontFamily: "var(--font-dm-sans, sans-serif)",
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function DealDetailContent({
  deal,
  leadNames,
  ownerNames,
  leads,
  owners,
  onClose,
  onUpdated,
  onDeleted,
}: InnerProps) {
  const [editMode, setEditMode] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [form, setForm] = useState({
    title: deal.title,
    value: String(deal.value),
    stage: deal.stage,
    lead_id: deal.lead_id,
    owner_id: deal.owner_id ?? "",
    deadline: deal.deadline ? deal.deadline.split("T")[0] : "",
  })

  const config = COLUMN_CONFIG[deal.stage]
  const overdue = deal.deadline ? new Date(deal.deadline) < new Date() : false

  function openEdit() {
    setForm({
      title: deal.title,
      value: String(deal.value),
      stage: deal.stage,
      lead_id: deal.lead_id,
      owner_id: deal.owner_id ?? "",
      deadline: deal.deadline ? deal.deadline.split("T")[0] : "",
    })
    setServerError("")
    setEditMode(true)
  }

  function closeEdit() {
    setEditMode(false)
    setServerError("")
  }

  function set(field: keyof typeof form) {
    return (value: string | null) =>
      setForm((prev) => ({ ...prev, [field]: value ?? "" }))
  }

  async function handleSave() {
    if (!form.title.trim() || Number(form.value) <= 0) {
      setServerError("Título e valor são obrigatórios.")
      return
    }
    setSaving(true)
    setServerError("")

    const payload = {
      title: form.title.trim(),
      value: Number(form.value),
      stage: form.stage,
      lead_id: form.lead_id || deal.lead_id,
      owner_id: form.owner_id || null,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }

    const result = await updateDealAction(deal.id, payload)
    setSaving(false)

    if (result?.error) {
      setServerError(result.error)
      return
    }

    onUpdated({ ...deal, ...payload })
    setEditMode(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteDealAction(deal.id)
    setDeleting(false)

    if (result?.error) {
      setServerError(result.error)
      return
    }

    onDeleted(deal.id)
  }

  return (
    <DialogContent
      className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0"
      style={{
        background: "rgba(14,14,16,0.97)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
      }}
    >
      {/* linha colorida do estágio */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: config.accent }} />

      {/* cabeçalho */}
      <div
        className="px-6 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <DialogTitle
              className="text-base font-bold leading-snug"
              style={{ fontFamily: "var(--font-syne, sans-serif)", color: "#E8E8E8" }}
            >
              {editMode ? "Editar Negócio" : deal.title}
            </DialogTitle>

            {!editMode && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={openEdit}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                  style={{ color: "#555559" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#CAFF33" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#555559" }}
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                  style={{ color: "#555559" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#EF4444" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#555559" }}
                  title="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </DialogHeader>

        {!editMode && (
          <>
            <div className="flex items-center gap-2 mt-3">
              <span
                className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: `${config.accent}18`,
                  color: config.accent,
                  border: `1px solid ${config.accent}33`,
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                }}
              >
                {config.label}
              </span>
              {overdue && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#EF4444",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <Clock className="h-3 w-3" />
                  Prazo vencido
                </span>
              )}
            </div>

            <p
              className="text-2xl font-bold mt-4 tabular-nums tracking-tight"
              style={{ fontFamily: "var(--font-ibm-mono, monospace)", color: "#CAFF33" }}
            >
              {formatCurrency(deal.value)}
            </p>
          </>
        )}
      </div>

      {/* Confirmar exclusão */}
      {confirmDelete && !editMode && (
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm mb-4" style={{ color: "#E8E8E8", fontFamily: "var(--font-dm-sans)" }}>
            Tem certeza que deseja excluir este negócio? Esta ação não pode ser desfeita.
          </p>
          {serverError && (
            <p className="text-[12px] mb-3" style={{ color: "#EF4444" }}>{serverError}</p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setConfirmDelete(false); setServerError("") }}
              disabled={deleting}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#8A8A8F" }}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-1.5"
              style={{ background: "#EF4444", color: "#fff", border: "none", fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      )}

      {/* Formulário de edição */}
      {editMode && (
        <div className="px-6 py-5 grid gap-4">
          <EditField label="Título" required>
            <Input
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              className="h-9 text-sm border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
              style={inputStyle}
            />
          </EditField>

          <EditField label="Valor (R$)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}>R$</span>
              <Input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => set("value")(e.target.value)}
                className="h-9 text-sm pl-9 border-0 focus-visible:ring-1 focus-visible:ring-[rgba(202,255,51,0.4)]"
                style={{ ...inputStyle, fontFamily: "var(--font-ibm-mono, monospace)", color: "#CAFF33" }}
              />
            </div>
          </EditField>

          <EditField label="Lead vinculado">
            <Select value={form.lead_id} onValueChange={set("lead_id")}>
              <SelectTrigger className="h-9 text-sm border-0" style={inputStyle}>
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
          </EditField>

          <EditField label="Etapa">
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
          </EditField>

          <div className="grid grid-cols-2 gap-3">
            <EditField label="Responsável">
              <Select value={form.owner_id} onValueChange={set("owner_id")}>
                <SelectTrigger className="h-9 text-sm border-0" style={inputStyle}>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent style={{ background: "#141416", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {owners.map((o) => (
                    <SelectItem key={o.id} value={o.id} style={{ color: "#E8E8E8" }}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditField>

            <EditField label="Prazo">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline")(e.target.value)}
                className="h-9 text-sm border-0"
                style={inputStyle}
              />
            </EditField>
          </div>

          {serverError && (
            <p className="text-[12px] font-medium" style={{ color: "#EF4444" }}>{serverError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={closeEdit}
              disabled={saving}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#8A8A8F", fontFamily: "var(--font-dm-sans, sans-serif)" }}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1.5 font-semibold"
              style={{ background: "#CAFF33", color: "#0C0C0E", border: "none", fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      )}

      {/* Detalhes (view mode) */}
      {!editMode && !confirmDelete && (
        <dl className="px-6 py-5 grid gap-4">
          <Row icon={<User className="h-4 w-4" />} label="Lead vinculado">
            <span className="font-medium" style={{ color: "#E8E8E8" }}>
              {leadNames[deal.lead_id] ?? "—"}
            </span>
          </Row>
          <Row icon={<User className="h-4 w-4" />} label="Responsável">
            <span style={{ color: "#E8E8E8" }}>
              {deal.owner_id ? (ownerNames[deal.owner_id] ?? "—") : "—"}
            </span>
          </Row>
          <Row icon={<CalendarDays className="h-4 w-4" />} label="Prazo">
            <span style={{ color: overdue ? "#EF4444" : "#E8E8E8" }} className={cn(overdue && "font-medium")}>
              {formatDate(deal.deadline)}
            </span>
          </Row>
          <Row icon={<Tag className="h-4 w-4" />} label="Criado em">
            <span style={{ color: "#8A8A8F" }}>{formatDate(deal.created_at)}</span>
          </Row>
        </dl>
      )}
    </DialogContent>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0" style={{ color: "#555559" }}>{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <dt className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}>
          {label}
        </dt>
        <dd className="text-sm" style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}>
          {children}
        </dd>
      </div>
    </div>
  )
}

function EditField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#555559", fontFamily: "var(--font-ibm-mono, monospace)" }}>
        {label}
        {required && <span style={{ color: "#EF4444" }} className="ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}
