import { Suspense } from "react"
import { getLeads } from "@/actions/leads"
import { getWorkspaceOwners } from "@/lib/members"
import { canAddLead } from "@/lib/limits"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { createClient } from "@/lib/supabase/server"
import { LeadsPageClient } from "@/components/leads/LeadsPageClient"
import type { LeadStatus } from "@/types"

const PAGE_SIZE = 10

interface SearchParams {
  q?: string
  status?: string
  owner?: string
  page?: string
}

async function LeadsContent({ searchParams }: { searchParams: SearchParams }) {
  const workspaceId = await getCurrentWorkspaceId()

  const search = searchParams.q ?? ""
  const status = (searchParams.status ?? "all") as LeadStatus | "all"
  const owner = searchParams.owner ?? "all"
  const page = Math.max(1, Number(searchParams.page ?? "1"))

  const [{ leads, total }, owners, limitCheck, supabase] = await Promise.all([
    getLeads({ search, status, owner_id: owner, page, pageSize: PAGE_SIZE }),
    getWorkspaceOwners(workspaceId).catch(() => [] as import("@/lib/members").Owner[]),
    canAddLead(workspaceId),
    createClient(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ws } = await (supabase as any)
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .single() as { data: { plan: string } | null }

  return (
    <LeadsPageClient
      leads={leads}
      total={total}
      owners={owners}
      currentSearch={search}
      currentStatus={status}
      currentOwner={owner}
      currentPage={page}
      pageSize={PAGE_SIZE}
      plan={ws?.plan ?? "free"}
      leadCount={limitCheck.current}
      leadLimit={limitCheck.limit === Infinity ? 50 : limitCheck.limit}
    />
  )
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <Suspense>
      <LeadsContent searchParams={params} />
    </Suspense>
  )
}
