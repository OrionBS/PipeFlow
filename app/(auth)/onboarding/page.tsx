"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [workspaceName, setWorkspaceName] = useState("")
  const slug = slugify(workspaceName)

  return (
    <>
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            {s > 1 && <div className="w-10 h-px bg-border" />}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                  step >= s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {s}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  step >= s ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {s === 1 ? "Workspace" : "Membros"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Crie seu workspace</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              O workspace é o espaço da sua empresa ou projeto.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (workspaceName.trim()) setStep(2)
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="workspace-name">Nome do workspace</Label>
              <Input
                id="workspace-name"
                placeholder="Ex: Minha Empresa"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              {slug && (
                <p className="text-xs text-muted-foreground">
                  URL:{" "}
                  <span className="font-mono text-foreground/80">
                    pipeflow.app/{slug}
                  </span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10"
              disabled={!workspaceName.trim()}
            >
              Continuar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Convide sua equipe</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Você pode convidar membros depois, nas configurações.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">E-mail do membro</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colega@empresa.com"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="default">
                  Adicionar
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-10">
              Acessar workspace
              <ArrowRight className="ml-2 size-4" />
            </Button>

            <Button type="button" variant="ghost" className="w-full h-10 text-muted-foreground">
              Pular por enquanto
            </Button>
          </form>
        </>
      )}
    </>
  )
}
