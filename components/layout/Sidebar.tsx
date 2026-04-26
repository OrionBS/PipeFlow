"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, KanbanSquare, Activity, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"
import { UserMenu } from "./UserMenu"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { label: "Atividades", href: "/activities", icon: Activity },
  { label: "Configurações", href: "/settings", icon: Settings },
]

interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
}

interface SidebarProps {
  workspaces: Workspace[]
  user: { name: string; email: string }
  onNavigate?: () => void
}

export function Sidebar({ workspaces, user, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const currentPlan = workspaces[0]?.plan ?? "free"

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border">
        <WorkspaceSwitcher workspaces={workspaces} />
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-sidebar-accent/50">
          <Zap className="size-3.5 text-primary shrink-0" />
          <span className="flex-1 text-xs text-sidebar-foreground/60">Plano atual</span>
          <Badge
            variant={currentPlan === "pro" ? "default" : "secondary"}
            className="h-5 px-1.5 text-[10px]"
          >
            {currentPlan === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
        <UserMenu user={user} />
      </div>
    </div>
  )
}
