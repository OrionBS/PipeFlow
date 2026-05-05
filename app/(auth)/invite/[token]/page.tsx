import { redirect } from "next/navigation"
import Link from "next/link"
import { Building2, UserPlus, AlertTriangle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createServiceClient } from "@/lib/supabase/service"
import { createClient } from "@/lib/supabase/server"
import { acceptInvite } from "@/actions/settings"

interface InvitePageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params
  const service = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: invite } = await (service as any)
    .from("workspace_invites")
    .select("id, email, role, expires_at, accepted_at, workspace_id, workspace:workspaces(name), inviter:invited_by(id)")
    .eq("token", token)
    .maybeSingle() as {
      data: {
        id: string
        email: string
        role: string
        expires_at: string
        accepted_at: string | null
        workspace_id: string
        workspace: { name: string } | null
        inviter: { id: string } | null
      } | null
    }

  // Token inválido
  if (!invite) {
    return (
      <ErrorCard
        icon={<AlertTriangle className="size-7 text-destructive" />}
        title="Convite inválido"
        description="Este link de convite não existe ou já foi removido."
      />
    )
  }

  // Convite já aceito
  if (invite.accepted_at) {
    return (
      <ErrorCard
        icon={<Building2 className="size-7 text-primary" />}
        title="Convite já aceito"
        description={`Este convite para ${invite.workspace?.name ?? "o workspace"} já foi aceito anteriormente.`}
        action={<Link href="/dashboard" className={cn(buttonVariants({ variant: "default" }), "w-full h-10 justify-center")}>Ir para o dashboard</Link>}
      />
    )
  }

  // Convite expirado
  if (new Date(invite.expires_at) < new Date()) {
    return (
      <ErrorCard
        icon={<AlertTriangle className="size-7 text-destructive" />}
        title="Convite expirado"
        description="Este convite expirou. Peça ao admin do workspace para enviar um novo."
      />
    )
  }

  // Resolve nome do invitador
  let inviterName = "Alguém"
  if (invite.inviter?.id) {
    const { data: inviterUser } = await service.auth.admin.getUserById(invite.inviter.id)
    inviterName = (inviterUser?.user?.user_metadata?.full_name as string | undefined)
      ?? inviterUser?.user?.email
      ?? "Alguém"
  }

  const workspaceName = invite.workspace?.name ?? "um workspace"

  // Verifica se o usuário já está logado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se logado, pode aceitar direto via form action
  if (user) {
    async function handleAccept() {
      "use server"
      const result = await acceptInvite(token)
      if (!result?.error) redirect("/dashboard")
    }

    const wrongEmail = user.email !== invite.email

    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Você foi convidado!</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-6">
          <span className="font-medium text-foreground">{inviterName}</span> convidou você
          para colaborar em{" "}
          <span className="font-medium text-foreground">{workspaceName}</span> no PipeFlow.
        </p>

        {wrongEmail ? (
          <div className="mt-6 rounded-xl p-4 text-sm text-left" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
            Este convite é para <strong>{invite.email}</strong>. Você está logado como <strong>{user.email}</strong>.
            Faça logout e entre com o e-mail correto.
          </div>
        ) : (
          <form action={handleAccept} className="mt-8">
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "default" }), "w-full h-10 justify-center")}
            >
              <UserPlus className="mr-2 size-4" />
              Aceitar e entrar em {workspaceName}
            </button>
          </form>
        )}
      </div>
    )
  }

  // Não logado — redireciona para register ou login com token na query
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Building2 className="size-7 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Você foi convidado!</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-6">
        <span className="font-medium text-foreground">{inviterName}</span> convidou você
        para colaborar em{" "}
        <span className="font-medium text-foreground">{workspaceName}</span> no PipeFlow.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        O convite é para: <span className="font-mono text-foreground">{invite.email}</span>
      </p>

      <div className="mt-8 space-y-3">
        <Link
          href={`/register?invite=${token}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full h-10 justify-center")}
        >
          <UserPlus className="mr-2 size-4" />
          Criar conta e aceitar convite
        </Link>

        <Link
          href={`/login?invite=${token}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full h-10 justify-center")}
        >
          Já tenho conta — entrar
        </Link>
      </div>
    </div>
  )
}

function ErrorCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-muted/20">
        {icon}
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-6">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
