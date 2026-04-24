import Link from "next/link"
import { Building2, UserPlus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InvitePageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Building2 className="size-7 text-primary" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Você foi convidado!</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-6">
        <span className="font-medium text-foreground">Carlos Mendes</span> convidou você
        para colaborar no workspace{" "}
        <span className="font-medium text-foreground">Acme Corp</span> no PipeFlow.
      </p>

      <div className="mt-8 space-y-3">
        <Link
          href="/register"
          className={cn(buttonVariants({ variant: "default" }), "w-full h-10 justify-center")}
        >
          <UserPlus className="mr-2 size-4" />
          Criar conta e aceitar convite
        </Link>

        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline" }), "w-full h-10 justify-center")}
        >
          Já tenho conta — entrar
        </Link>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Token: <span className="font-mono">{token}</span>
      </p>
    </div>
  )
}
