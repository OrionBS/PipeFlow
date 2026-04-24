import { Phone, Mail, Users, StickyNote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Activity, ActivityType } from "@/types"

const TYPE_CONFIG: Record<
  ActivityType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  call: {
    label: "Ligação",
    icon: <Phone className="h-3.5 w-3.5" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  },
  email: {
    label: "E-mail",
    icon: <Mail className="h-3.5 w-3.5" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  },
  meeting: {
    label: "Reunião",
    icon: <Users className="h-3.5 w-3.5" />,
    color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  },
  note: {
    label: "Nota",
    icon: <StickyNote className="h-3.5 w-3.5" />,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
}

interface Author {
  id: string
  name: string
}

interface ActivityTimelineProps {
  activities: Activity[]
  authors: Author[]
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function ActivityTimeline({ activities, authors }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada ainda.
      </p>
    )
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <ol className="space-y-0">
      {sorted.map((activity, i) => {
        const config = TYPE_CONFIG[activity.type]
        const authorName =
          authors.find((a) => a.id === activity.author_id)?.name ?? "—"
        const isLast = i === sorted.length - 1

        return (
          <li key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  config.color
                )}
              >
                {config.icon}
              </span>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>

            <div className={cn("pb-5 min-w-0", isLast && "pb-0")}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{authorName}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <time className="text-xs text-muted-foreground">
                  {formatDateTime(activity.date)}
                </time>
              </div>
              <p className="mt-1 text-sm leading-relaxed">{activity.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { TYPE_CONFIG }
