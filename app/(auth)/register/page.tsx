import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
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

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" placeholder="Seu nome" autoComplete="name" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full h-10">
          Criar conta
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
