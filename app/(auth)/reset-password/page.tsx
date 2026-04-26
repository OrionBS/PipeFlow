"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!password) errs.password = "Senha obrigatória."
    else if (password.length < 8) errs.password = "Mínimo 8 caracteres."
    if (!confirm) errs.confirm = "Confirme a senha."
    else if (confirm !== password) errs.confirm = "As senhas não coincidem."
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrors({ form: "Erro ao redefinir senha. O link pode ter expirado." })
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Redefinir senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite sua nova senha abaixo.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
            disabled={loading}
            aria-invalid={!!errors.password}
            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })) }}
            disabled={loading}
            aria-invalid={!!errors.confirm}
            className={errors.confirm ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
        </div>

        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar nova senha"
          )}
        </Button>
      </form>
    </>
  )
}
