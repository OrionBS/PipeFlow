import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
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

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email" />
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
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>

        <Button type="submit" className="w-full h-10">
          Entrar
        </Button>
      </form>
    </>
  )
}
