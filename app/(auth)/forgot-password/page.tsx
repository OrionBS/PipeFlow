"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) { setEmailError("E-mail obrigatório."); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("E-mail inválido."); return }
    setEmailError("")
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    // Always show success to avoid email enumeration
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-500/10">
          <svg className="size-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verifique seu e-mail</h1>
        <p className="text-sm text-muted-foreground">
          Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
        </p>
        <Link href="/login" className="block text-sm text-primary hover:underline font-medium">
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Esqueceu a senha?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
            disabled={loading}
            aria-invalid={!!emailError}
            className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {emailError && <p className="text-xs text-destructive">{emailError}</p>}
        </div>

        <Button
          type="submit"
          className="w-full h-10 font-bold transition-all duration-200"
          disabled={loading}
          style={{
            background: loading ? "rgba(202,255,51,0.5)" : "#CAFF33",
            color: "#0C0C0E",
            border: "none",
            fontFamily: "var(--font-syne, sans-serif)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de redefinição"
          )}
        </Button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Voltar para o login
          </Link>
        </div>
      </form>
    </>
  )
}
