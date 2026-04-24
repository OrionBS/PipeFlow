"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </aside>

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Mobile sidebar (slide-in drawer) ── */}
      <aside
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
