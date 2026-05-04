import { notFound } from "next/navigation"
import { getLeadById, getDealsByLead } from "@/actions/leads"
import { getActivitiesByLead } from "@/actions/activities"
import { getWorkspaceOwners } from "@/lib/members"
import { getCurrentWorkspaceId } from "@/lib/workspace"
import { LeadDetailClient } from "@/components/leads/LeadDetailClient"

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workspaceId = await getCurrentWorkspaceId()

  const [lead, activities, deals, owners] = await Promise.all([
    getLeadById(id),
    getActivitiesByLead(id),
    getDealsByLead(id),
    getWorkspaceOwners(workspaceId),
  ])

  if (!lead) notFound()

  return (
    <LeadDetailClient
      lead={lead}
      activities={activities}
      deals={deals}
      owners={owners}
    />
  )
}
