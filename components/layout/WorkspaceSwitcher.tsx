"use client"

import { useState } from "react"
import { Menu } from "@base-ui/react/menu"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_WORKSPACES, MOCK_CURRENT_WORKSPACE } from "@/lib/mock-data"
import type { Workspace } from "@/types"

export function WorkspaceSwitcher() {
  const [current, setCurrent] = useState<Workspace>(MOCK_CURRENT_WORKSPACE)

  return (
    <Menu.Root>
      <Menu.Trigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase">
          {current.name.charAt(0)}
        </span>
        <span className="flex-1 truncate text-left text-sidebar-foreground">
          {current.name}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/40" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="start" sideOffset={6}>
          <Menu.Popup className="z-50 min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg outline-none data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Workspaces
            </p>

            {MOCK_WORKSPACES.map((ws) => (
              <Menu.Item
                key={ws.id}
                onClick={() => setCurrent(ws)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm outline-none transition-colors",
                  "hover:bg-accent focus-visible:bg-accent"
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/15 text-primary text-xs font-bold uppercase">
                  {ws.name.charAt(0)}
                </span>
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === current.id && (
                  <Check className="size-3.5 text-primary shrink-0" />
                )}
              </Menu.Item>
            ))}

            <div className="my-1 h-px bg-border" />

            <Menu.Item className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent">
              <Plus className="size-4 shrink-0" />
              Criar workspace
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
