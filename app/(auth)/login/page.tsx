"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/actions/auth"

type FieldErrors = { email?: string; password?: string; form?: string }

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email.trim()) {
    errors.email = "E-mail obrigatório."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "E-mail inválido."
  }
  if (!password) {
    errors.password = "Senha obrigatória."
  } else if (password.length < 8) {
    errors.password = "A senha deve ter pelo menos 8 caracteres."
  }
  return errors
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(email, password)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    const result = await login(email, password)
    if (result && "error" in result) {
      setErrors({ form: result.error })
      setLoading(false)
    }
    // On success, `login` server action calls redirect() — no need to handle here
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Entrar na sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Criar conta grátis
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            disabled={loading}
            aria-invalid={!!errors.email}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            disabled={loading}
            aria-invalid={!!errors.password}
            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </>
  )
}
