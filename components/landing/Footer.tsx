import Link from "next/link"
import { Zap } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="size-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">PipeFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-6 max-w-xs">
              Pipeline de vendas simples e acessível para PMEs, freelancers e equipes de vendas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Produto</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#funcionalidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Como funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} PipeFlow. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com ❤️ para times de vendas brasileiros
          </p>
        </div>
      </div>
    </footer>
  )
}
