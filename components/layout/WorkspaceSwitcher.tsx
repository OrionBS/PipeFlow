"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "@base-ui/react/menu"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
}

export function WorkspaceSwitcher({ workspaces }: WorkspaceSwitcherProps) {
  const router = useRouter()
  const [currentId, setCurrentId] = useState<string>(workspaces[0]?.id ?? "")
  const current = workspaces.find((ws) => ws.id === currentId) ?? workspaces[0]

  if (!current) return null

  return (
    <Menu.Root modal={false}>
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
        <Menu.Positioner
          side="bottom"
          align="start"
          sideOffset={6}
          positionMethod="fixed"
          className="z-50"
        >
          <Menu.Popup className="min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg outline-none">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Workspaces</p>

            {workspaces.map((ws) => (
              <Menu.Item
                key={ws.id}
                onClick={() => setCurrentId(ws.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm outline-none transition-colors",
                  "hover:bg-accent focus-visible:bg-accent"
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/15 text-primary text-xs font-bold uppercase">
                  {ws.name.charAt(0)}
                </span>
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === current.id && <Check className="size-3.5 text-primary shrink-0" />}
              </Menu.Item>
            ))}

            <div className="my-1 h-px bg-border" />

            <Menu.Item
              onClick={() => router.push("/onboarding")}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent"
            >
              <Plus className="size-4 shrink-0" />
              Criar workspace
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
