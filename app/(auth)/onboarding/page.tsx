"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createWorkspace } from "@/actions/workspace"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1
  const [workspaceName, setWorkspaceName] = useState("")
  const [nameError, setNameError] = useState("")
  const [formError, setFormError] = useState("")
  const [loadingStep1, setLoadingStep1] = useState(false)

  // Step 2
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState("")
  const [invites, setInvites] = useState<string[]>([])
  const [loadingStep2, setLoadingStep2] = useState(false)

  const slug = slugify(workspaceName)

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!workspaceName.trim()) {
      setNameError("Nome do workspace obrigatório.")
      return
    }
    if (workspaceName.trim().length < 2) {
      setNameError("Nome muito curto.")
      return
    }
    setNameError("")
    setFormError("")
    setLoadingStep1(true)

    const result = await createWorkspace(workspaceName.trim(), slug)
    if (result?.error) {
      setFormError(result.error)
      setLoadingStep1(false)
      return
    }
    setLoadingStep1(false)
    setStep(2)
  }

  function handleAddInvite() {
    const trimmed = inviteEmail.trim()
    if (!trimmed) { setInviteError("Digite um e-mail."); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setInviteError("E-mail inválido."); return }
    if (invites.includes(trimmed)) { setInviteError("E-mail já adicionado."); return }
    setInvites((prev) => [...prev, trimmed])
    setInviteEmail("")
    setInviteError("")
  }

  function handleRemoveInvite(email: string) {
    setInvites((prev) => prev.filter((e) => e !== email))
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setLoadingStep2(true)
    // Invite flow is implemented in M10 — skip for now
    router.push("/dashboard")
  }

  return (
    <>
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {([1, 2] as const).map((s) => (
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
                  "text-sm font-medium transition-colors",
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

          <form className="space-y-4" onSubmit={handleStep1} noValidate>
            {formError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="workspace-name">Nome do workspace</Label>
              <Input
                id="workspace-name"
                placeholder="Ex: Minha Empresa"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value)
                  if (nameError) setNameError("")
                  if (formError) setFormError("")
                }}
                disabled={loadingStep1}
                aria-invalid={!!nameError}
                className={nameError ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : slug ? (
                <p className="text-xs text-muted-foreground">
                  URL:{" "}
                  <span className="font-mono text-foreground/80">pipeflow.app/{slug}</span>
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full h-10" disabled={loadingStep1}>
              {loadingStep1 ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
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

          <form className="space-y-4" onSubmit={handleStep2} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">E-mail do membro</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colega@empresa.com"
                  className={cn(
                    "flex-1",
                    inviteError ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    if (inviteError) setInviteError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleAddInvite() }
                  }}
                  disabled={loadingStep2}
                />
                <Button type="button" variant="outline" onClick={handleAddInvite} disabled={loadingStep2}>
                  <Plus className="size-4" />
                </Button>
              </div>
              {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
            </div>

            {invites.length > 0 && (
              <ul className="space-y-1.5">
                {invites.map((email) => (
                  <li
                    key={email}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground truncate">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvite(email)}
                      className="ml-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label={`Remover ${email}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button type="submit" className="w-full h-10" disabled={loadingStep2}>
              {loadingStep2 ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Acessando...
                </>
              ) : (
                <>
                  Acessar workspace
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 text-muted-foreground"
              onClick={() => router.push("/dashboard")}
              disabled={loadingStep2}
            >
              Pular por enquanto
            </Button>
          </form>
        </>
      )}
    </>
  )
}
