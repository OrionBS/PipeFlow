import { getDeals } from "@/actions/deals"
import { getLeads } from "@/actions/leads"
import { getWorkspaceOwners } from "@/lib/members"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { PipelineClient } from "@/components/kanban/PipelineClient"

export default async function PipelinePage() {
  const workspaceId = await getCurrentWorkspaceId()

  const [deals, { leads }, owners] = await Promise.all([
    getDeals(),
    getLeads({ pageSize: 500 }),
    getWorkspaceOwners(workspaceId).catch(() => [] as import("@/lib/members").Owner[]),
  ])

  return (
    <div className="flex flex-col h-full min-w-0">
      <PipelineClient initialDeals={deals} leads={leads} owners={owners} />
    </div>
  )
}
