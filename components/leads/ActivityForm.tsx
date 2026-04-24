"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TYPE_CONFIG } from "@/components/leads/ActivityTimeline"
import type { Activity, ActivityType } from "@/types"

interface ActivityFormProps {
  leadId: string
  onSubmit: (activity: Activity) => void
}

const ACTIVITY_TYPES = Object.keys(TYPE_CONFIG) as ActivityType[]

export function ActivityForm({ leadId, onSubmit }: ActivityFormProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ActivityType>("call")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16))
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      setError("Descrição é obrigatória.")
      return
    }
    alert("Registrar atividade chegará no M8 com backend real.")
    return
    const activity: Activity = {
      id: `act-${Date.now()}`,
      workspace_id: "ws-1",
      lead_id: leadId,
      type,
      description: description.trim(),
      author_id: "user-1",
      date: new Date(date).toISOString(),
      created_at: new Date().toISOString(),
    }
    onSubmit(activity)
    setDescription("")
    setType("call")
    setDate(new Date().toISOString().slice(0, 16))
    setError("")
    setOpen(false)
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Registrar atividade
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-muted/40 p-4 space-y-3"
    >
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1.5 w-36">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => setType((v ?? "call") as ActivityType)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {TYPE_CONFIG[t].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 flex-1 min-w-40">
          <Label htmlFor="act-date">Data e hora</Label>
          <Input
            id="act-date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-8"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="act-desc">
          Descrição <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="act-desc"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (error) setError("")
          }}
          placeholder="Descreva o que aconteceu..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setOpen(false)
            setError("")
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" size="sm">
          Salvar
        </Button>
      </div>
    </form>
  )
}
