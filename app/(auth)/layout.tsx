import Link from "next/link"
import { KanbanSquare } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 text-foreground hover:text-primary transition-colors"
        >
          <KanbanSquare className="size-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">PipeFlow</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
