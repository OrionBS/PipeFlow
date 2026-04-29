import Link from "next/link"
import {
  KanbanSquare,
  Users,
  BarChart3,
  Building2,
  Activity,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"

const features = [
  {
    icon: KanbanSquare,
    title: "Pipeline Kanban",
    description: "Visualize e mova negócios entre etapas com drag & drop. Veja o funil completo em um relance.",
  },
  {
    icon: Users,
    title: "Gestão de Leads",
    description: "Cadastre contatos, empresas e histórico de interações. Nunca mais perca um follow-up.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analítico",
    description: "Métricas de pipeline, taxa de conversão e deals com prazo próximo em tempo real.",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description: "Gerencie múltiplos workspaces independentes. Ideal para agências e consultores.",
  },
  {
    icon: Activity,
    title: "Linha do Tempo",
    description: "Registre ligações, e-mails, reuniões e notas. Histórico completo de cada lead.",
  },
  {
    icon: CreditCard,
    title: "Planos Flexíveis",
    description: "Comece grátis e faça upgrade quando precisar. Sem contratos de longo prazo.",
  },
]

const pipelineRows = [
  { label: "NOVO",       color: "#3B82F6", width: "72%", value: "R$ 32k", count: 12 },
  { label: "CONTATO",    color: "#06B6D4", width: "60%", value: "R$ 24k", count: 9  },
  { label: "PROPOSTA",   color: "#A3E635", width: "48%", value: "R$ 18k", count: 6  },
  { label: "NEGOCIAÇÃO", color: "#F97316", width: "36%", value: "R$ 12k", count: 3  },
  { label: "FECHADO ✓",  color: "#22C55E", width: "64%", value: "R$ 45k", count: 9  },
]

const freePlanFeatures = [
  "Até 2 membros",
  "Até 50 leads",
  "Pipeline Kanban",
  "Gestão de atividades",
  "Dashboard básico",
]

const proPlanFeatures = [
  "Membros ilimitados",
  "Leads ilimitados",
  "Tudo do plano Free",
  "Dashboard avançado",
  "Multi-workspace",
  "Convite por e-mail",
  "Suporte prioritário",
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-28 lg:pt-32 lg:pb-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/70 uppercase mb-8">
                <span className="size-1.5 rounded-full bg-[#C8FF00]" />
                CRM DE VENDAS MULTI-EMPRESA
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-2">
                <span className="text-white">Vendas em</span>
                <br />
                <span className="text-[#C8FF00]">fluxo</span>
                <br />
                <span className="text-[#C8FF00]">contínuo</span>
              </h1>

              <div className="w-8 h-1 bg-white/40 mt-4 mb-8" />

              <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10">
                Gerencie leads, negócios e equipe num CRM que respeita a velocidade do seu time. Pipeline visual. Multi-empresa. Sem fricção.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/register"
                  className="rounded-md bg-[#C8FF00] px-6 py-3 text-sm font-bold text-black hover:bg-[#b8ef00] transition-colors inline-flex items-center gap-2"
                >
                  Começar grátis
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#funcionalidades"
                  className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/80 hover:border-white/40 hover:text-white transition-colors"
                >
                  Ver funcionalidades
                </Link>
              </div>

              <p className="mt-5 text-sm text-white/30">
                — Sem cartão de crédito · Plano grátis para sempre
              </p>
            </div>

            <div className="relative">
              <div className="rounded-xl bg-[#111111] border border-white/10 overflow-hidden shadow-2xl shadow-black/60">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-[#0A0A0A]">
                  <span className="size-3 rounded-full bg-[#FF5F57]" />
                  <span className="size-3 rounded-full bg-[#FFBD2E]" />
                  <span className="size-3 rounded-full bg-[#28CA41]" />
                  <span className="ml-3 text-xs text-white/30 font-mono tracking-wide">
                    pipeline — workspace: acme-corp
                  </span>
                </div>

                <div className="px-6 py-6 space-y-4">
                  {pipelineRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                      <span className="w-24 text-[10px] font-semibold tracking-widest text-white/40 shrink-0">
                        {row.label}
                      </span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: row.width, backgroundColor: row.color }}
                        />
                      </div>
                      <span className="w-14 text-xs text-white/60 text-right font-mono shrink-0">
                        {row.value}
                      </span>
                      <span className="w-5 text-xs text-white/30 text-right font-mono shrink-0">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-white/8 bg-[#0A0A0A]">
                  <span className="text-[10px] font-mono text-white/30 tracking-widest">total pipeline</span>
                  <span className="text-sm font-bold text-[#C8FF00] font-mono">R$ 131.000</span>
                </div>
              </div>

              <div className="absolute -inset-4 -z-10 bg-[#C8FF00]/5 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="py-24 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#C8FF00] text-xs font-semibold tracking-widest uppercase mb-3">Funcionalidades</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Tudo que sua equipe precisa
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-xl">
              Ferramentas poderosas sem a complexidade dos CRMs tradicionais.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-white/8 bg-[#111111] p-6 hover:border-[#C8FF00]/30 transition-colors"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#C8FF00]/10 mb-4">
                    <Icon className="size-5 text-[#C8FF00]" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/45 leading-6">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="planos" className="py-24 bg-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#C8FF00] text-xs font-semibold tracking-widest uppercase mb-3">Planos</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Preços transparentes
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Comece de graça. Faça upgrade quando sua equipe crescer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="rounded-2xl border border-white/10 bg-[#111111] p-8 flex flex-col">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Free</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">R$0</span>
                <span className="text-white/40">/mês</span>
              </div>
              <p className="text-sm text-white/40 mb-8">Para freelancers e times pequenos.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle className="size-4 text-[#C8FF00] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center rounded-md border border-white/20 py-3 text-sm font-semibold text-white hover:border-[#C8FF00]/40 hover:text-[#C8FF00] transition-colors"
              >
                Criar conta grátis
              </Link>
            </div>

            <div className="rounded-2xl border border-[#C8FF00]/40 bg-[#111111] p-8 flex flex-col relative">
              <div className="absolute -top-3 left-6">
                <span className="rounded-full bg-[#C8FF00] px-3 py-1 text-xs font-bold text-black">
                  Mais popular
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#C8FF00] uppercase tracking-widest mb-4">Pro</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">R$49</span>
                <span className="text-white/40">/mês</span>
              </div>
              <p className="text-sm text-white/40 mb-8">Para times em crescimento.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {proPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle className="size-4 text-[#C8FF00] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center rounded-md bg-[#C8FF00] py-3 text-sm font-bold text-black hover:bg-[#b8ef00] transition-colors"
              >
                Começar com Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0A]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Pronto para transformar<br />suas vendas?
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            Junte-se a times de vendas que usam PipeFlow para fechar mais negócios todos os dias.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-md bg-[#C8FF00] px-8 py-4 text-base font-bold text-black hover:bg-[#b8ef00] transition-colors"
          >
            Criar conta grátis
            <ArrowRight className="size-5" />
          </Link>
          <p className="mt-5 text-sm text-white/30">
            — Sem cartão de crédito · Plano grátis para sempre
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
