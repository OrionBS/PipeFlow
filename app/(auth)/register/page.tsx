"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/actions/auth"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) {
    errors.name = "Nome obrigatório."
  } else if (name.trim().length < 2) {
    errors.name = "Nome muito curto."
  }
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
  if (!confirmPassword) {
    errors.confirmPassword = "Confirme sua senha."
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = "As senhas não coincidem."
  }
  return errors
}

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  function clearError(field: keyof FieldErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(name, email, password, confirmPassword)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    const result = await register(name, email, password)
    if (result?.error) {
      setErrors({ form: result.error })
      setLoading(false)
    }
    // On success, `register` server action calls redirect() — no need to handle here
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Criar sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Entrar
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
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            autoComplete="name"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError("name") }}
            disabled={loading}
            aria-invalid={!!errors.name}
            className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError("email") }}
            disabled={loading}
            aria-invalid={!!errors.email}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError("password") }}
            disabled={loading}
            aria-invalid={!!errors.password}
            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword") }}
            disabled={loading}
            aria-invalid={!!errors.confirmPassword}
            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground leading-5">
          Ao criar uma conta você concorda com os{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
      </form>
    </>
  )
}
