export type Plan = "free" | "pro"

export type WorkspaceRole = "admin" | "member"

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted"

export type DealStage =
  | "new_lead"
  | "contacted"
  | "proposal_sent"
  | "negotiation"
  | "closed_won"
  | "closed_lost"

export type ActivityType = "call" | "email" | "meeting" | "note"

export type MemberStatus = "active" | "invited" | "removed"

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Member {
  id: string
  workspace_id: string
  user_id: string | null
  role: WorkspaceRole
  invited_email: string | null
  status: MemberStatus
  created_at: string
}

export interface Lead {
  id: string
  workspace_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  role: string | null
  status: LeadStatus
  owner_id: string | null
  created_at: string
}

export interface Deal {
  id: string
  workspace_id: string
  lead_id: string
  title: string
  value: number
  stage: DealStage
  owner_id: string | null
  deadline: string | null
  created_at: string
}

export interface Activity {
  id: string
  workspace_id: string
  lead_id: string
  type: ActivityType
  description: string
  author_id: string
  date: string
  created_at: string
}

export interface Invite {
  id: string
  workspace_id: string
  email: string
  token: string
  role: WorkspaceRole
  expires_at: string
  accepted_at: string | null
}
