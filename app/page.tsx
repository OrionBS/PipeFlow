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
  UserPlus,
  FileUp,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"

const features = [
  {
    icon: KanbanSquare,
    title: "Pipeline Kanban",
    description: "Visualize e mova negócios entre etapas com drag & drop. Veja o funil completo de vendas em um relance.",
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

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta grátis",
    description: "Cadastro em 30 segundos. Sem cartão de crédito, sem burocracia.",
  },
  {
    number: "02",
    icon: FileUp,
    title: "Adicione seus leads",
    description: "Importe sua lista de contatos ou adicione manualmente. Configure seu pipeline.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Feche mais negócios",
    description: "Acompanhe cada oportunidade, registre atividades e tome decisões com dados.",
  },
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
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium mb-8">
            <span>Novo: planos a partir de R$0/mês</span>
            <ArrowRight className="size-3.5" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-3xl mx-auto">
            Feche mais negócios.{" "}
            <span className="text-primary">Sem complicação.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-8">
            PipeFlow é o CRM visual que sua equipe vai realmente usar. Pipeline Kanban,
            gestão de leads e métricas em tempo real — tudo em um lugar simples e acessível.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 px-8 text-base rounded-xl"
              )}
            >
              Começar grátis
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#como-funciona"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 px-8 text-base rounded-xl"
              )}
            >
              Ver como funciona
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem cartão de crédito · Setup em 2 minutos · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Tudo que sua equipe precisa
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas sem a complexidade dos CRMs tradicionais.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Simples de começar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Do cadastro ao primeiro negócio fechado em menos de 5 minutos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-border" />
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative text-center flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="flex size-20 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/5">
                      <Icon className="size-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step.number.replace("0", "")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6 max-w-xs">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Preços transparentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece de graça. Faça upgrade quando sua equipe crescer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-background p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Free</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">R$0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Para freelancers e times pequenos começando.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {freePlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="size-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 justify-center text-sm")}
              >
                Criar conta grátis
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-primary bg-background p-8 flex flex-col relative shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Mais popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">R$49</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Para times em crescimento que precisam de mais.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {proPlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle className="size-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "default" }), "w-full h-11 justify-center text-sm")}
              >
                Começar com Pro
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-primary/5 border border-primary/20 px-8 py-16 sm:px-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Pronto para transformar suas vendas?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Junte-se a times de vendas que usam PipeFlow para fechar mais negócios todos os dias.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-12 px-8 text-base rounded-xl"
                )}
              >
                Criar conta grátis
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
