"use client"

import { Menu } from "@base-ui/react/menu"
import { LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MOCK_USER, MOCK_CURRENT_WORKSPACE } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function UserMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {MOCK_USER.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 text-left">
          <p className="truncate text-xs font-medium text-sidebar-foreground leading-tight">
            {MOCK_USER.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/50 leading-tight">
            {MOCK_USER.email}
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="top" align="start" sideOffset={6}>
          <Menu.Popup className="z-50 min-w-52 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg outline-none data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150">
            <div className="px-2 py-2 mb-1">
              <p className="text-sm font-medium text-foreground">{MOCK_USER.name}</p>
              <p className="text-xs text-muted-foreground truncate">{MOCK_USER.email}</p>
            </div>

            <div className="my-1 h-px bg-border" />

            <Menu.Item className={menuItemClass}>
              <User className="size-4 shrink-0" />
              Perfil
            </Menu.Item>
            <Menu.Item className={menuItemClass}>
              <Settings className="size-4 shrink-0" />
              Configurações
            </Menu.Item>

            <div className="my-1 h-px bg-border" />

            <Menu.Item className={cn(menuItemClass, "text-destructive hover:text-destructive focus-visible:text-destructive")}>
              <LogOut className="size-4 shrink-0" />
              Sair
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

const menuItemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
