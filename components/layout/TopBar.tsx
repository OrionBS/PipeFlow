"use client"

import { usePathname } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  pipeline: "Pipeline",
  activities: "Atividades",
  settings: "Configurações",
  workspace: "Workspace",
  members: "Membros",
  billing: "Cobrança",
  profile: "Perfil",
}

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => routeLabels[seg] ?? seg)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 bg-background/80 backdrop-blur">
      {/* Hamburger — only on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground/40 select-none">/</span>
            )}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-medium text-foreground truncate"
                  : "text-muted-foreground"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Search — hidden on small screens */}
      <div className="ml-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar..."
            className="h-8 w-44 pl-8 text-sm bg-muted/50 border-transparent focus-visible:border-input focus-visible:bg-background"
          />
        </div>
      </div>
    </header>
  )
}
