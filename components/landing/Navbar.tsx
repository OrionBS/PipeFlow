"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#C8FF00]">
              <span className="text-black font-black text-sm">P</span>
            </div>
            <span className="text-white font-bold tracking-tight text-lg">PipeFlow</span>
            <span className="text-white/30 font-light ml-1">—</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#funcionalidades" className="text-sm text-white/60 hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="#resultados" className="text-sm text-white/60 hover:text-white transition-colors">
              Resultados
            </Link>
            <Link href="#planos" className="text-sm text-white/60 hover:text-white transition-colors">
              Planos
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#C8FF00] px-4 py-2 text-sm font-semibold text-black hover:bg-[#b8ef00] transition-colors"
            >
              Começar grátis
            </Link>
          </div>

          <button
            className="md:hidden rounded-md p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black px-6 py-4 space-y-1">
          <Link href="#funcionalidades" className="block py-2 text-sm text-white/60 hover:text-white" onClick={() => setOpen(false)}>
            Funcionalidades
          </Link>
          <Link href="#resultados" className="block py-2 text-sm text-white/60 hover:text-white" onClick={() => setOpen(false)}>
            Resultados
          </Link>
          <Link href="#planos" className="block py-2 text-sm text-white/60 hover:text-white" onClick={() => setOpen(false)}>
            Planos
          </Link>
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/login" className="block py-2 text-center text-sm text-white/60 border border-white/20 rounded-md hover:text-white">
              Entrar
            </Link>
            <Link href="/register" className="block py-2 text-center text-sm font-semibold bg-[#C8FF00] text-black rounded-md hover:bg-[#b8ef00]">
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
