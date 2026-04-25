"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Users, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/settings/workspace", label: "Workspace", icon: Building2 },
  { href: "/settings/members",   label: "Membros",    icon: Users },
  { href: "/settings/billing",   label: "Plano",      icon: CreditCard },
  { href: "/settings/profile",   label: "Perfil",     icon: User },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6 pf-page-enter">
      {/* page header */}
      <div>
        <h1
          className="text-xl font-bold leading-none"
          style={{ fontFamily: "var(--font-syne, sans-serif)", color: "#E8E8E8" }}
        >
          Configurações
        </h1>
        <p className="text-xs mt-1" style={{ color: "#555559" }}>
          Workspace, membros, cobrança e perfil
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 min-w-0">
        {/* sidebar nav */}
        <nav
          className="md:w-[200px] shrink-0 flex md:flex-col gap-1 overflow-x-auto"
          style={{ minWidth: 0 }}
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150",
                  "shrink-0"
                )}
                style={{
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  background: active ? "rgba(202,255,51,0.08)" : "transparent",
                  color: active ? "#CAFF33" : "#8A8A8F",
                  border: active ? "1px solid rgba(202,255,51,0.18)" : "1px solid transparent",
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
