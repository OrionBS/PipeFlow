"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">PipeFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#funcionalidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como funciona
            </Link>
            <Link href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Entrar
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "px-4")}>
              Começar grátis
            </Link>
          </div>

          <button
            className="md:hidden rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          <Link
            href="#funcionalidades"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Funcionalidades
          </Link>
          <Link
            href="#como-funciona"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Como funciona
          </Link>
          <Link
            href="#precos"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Preços
          </Link>
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-center")}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
