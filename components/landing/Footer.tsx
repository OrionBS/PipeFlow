import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#C8FF00]">
                <span className="text-black font-black text-xs">P</span>
              </div>
              <span className="text-white font-bold tracking-tight">PipeFlow</span>
            </Link>
            <p className="text-sm text-white/40 leading-6 max-w-xs">
              Pipeline de vendas simples e acessível para PMEs, freelancers e equipes de vendas.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Produto</h3>
            <ul className="space-y-3">
              <li><Link href="#funcionalidades" className="text-sm text-white/40 hover:text-white transition-colors">Funcionalidades</Link></li>
              <li><Link href="#planos" className="text-sm text-white/40 hover:text-white transition-colors">Planos</Link></li>
              <li><Link href="#resultados" className="text-sm text-white/40 hover:text-white transition-colors">Resultados</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Sobre nós</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Termos de uso</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/25">© {year} PipeFlow. Todos os direitos reservados.</p>
          <p className="text-sm text-white/25">Feito com ❤️ para times de vendas brasileiros</p>
        </div>
      </div>
    </footer>
  )
}
