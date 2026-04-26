"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
}

interface AppShellProps {
  children: React.ReactNode
  workspaces: Workspace[]
  user: { name: string; email: string }
}

export function AppShell({ children, workspaces, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <Sidebar workspaces={workspaces} user={user} />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar workspaces={workspaces} user={user} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
