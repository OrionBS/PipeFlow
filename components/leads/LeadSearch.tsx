"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LeadSearchProps {
  value: string
  onChange: (value: string) => void
}

export function LeadSearch({ value, onChange }: LeadSearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nome, empresa ou e-mail..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
