"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "@base-ui/react/menu"
import { LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { logout } from "@/actions/auth"

interface UserMenuProps {
  user: { name: string; email: string }
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        disabled={pending}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:opacity-60"
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 text-left">
          <p className="truncate text-xs font-medium text-sidebar-foreground leading-tight">
            {user.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/50 leading-tight">
            {user.email}
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="top" align="start" sideOffset={6} positionMethod="fixed" className="z-50">
          <Menu.Popup className="min-w-52 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg outline-none">
            <div className="px-2 py-2 mb-1">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>

            <div className="my-1 h-px bg-border" />

            <Menu.Item onClick={() => router.push("/settings/profile")} className={menuItemClass}>
              <User className="size-4 shrink-0" />
              Perfil
            </Menu.Item>
            <Menu.Item onClick={() => router.push("/settings")} className={menuItemClass}>
              <Settings className="size-4 shrink-0" />
              Configurações
            </Menu.Item>

            <div className="my-1 h-px bg-border" />

            <Menu.Item
              onClick={handleLogout}
              className={cn(menuItemClass, "text-destructive hover:text-destructive focus-visible:text-destructive")}
            >
              <LogOut className="size-4 shrink-0" />
              {pending ? "Saindo..." : "Sair"}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

const menuItemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
