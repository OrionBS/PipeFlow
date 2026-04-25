// Types for PipeFlow CRM — kept in sync with supabase/migrations/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type PlanType      = 'free' | 'pro'
export type WorkspaceRole = 'admin' | 'member'
export type MemberStatus  = 'active' | 'invited' | 'removed'
export type LeadStatus    = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
export type DealStage     = 'new_lead' | 'contacted' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost'
export type ActivityType  = 'call' | 'email' | 'meeting' | 'note'
export type SubscriptionStatus =
  | 'active' | 'canceled' | 'incomplete'
  | 'incomplete_expired' | 'past_due'
  | 'trialing' | 'unpaid'

// ---------------------------------------------------------------------------
// Row types — shape exata retornada pelo Supabase client
// ---------------------------------------------------------------------------

export interface WorkspaceRow {
  id: string
  name: string
  slug: string
  plan: PlanType
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface WorkspaceMemberRow {
  id: string
  workspace_id: string
  user_id: string | null
  role: WorkspaceRole
  invited_email: string | null
  status: MemberStatus
  created_at: string
  updated_at: string
}

export interface LeadRow {
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
  updated_at: string
}

export interface DealRow {
  id: string
  workspace_id: string
  lead_id: string
  title: string
  value: number
  stage: DealStage
  position: number
  owner_id: string | null
  deadline: string | null
  created_at: string
  updated_at: string
}

export interface ActivityRow {
  id: string
  workspace_id: string
  lead_id: string
  type: ActivityType
  description: string
  author_id: string
  occurred_at: string
  created_at: string
}

export interface SubscriptionRow {
  id: string
  workspace_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Insert types
// ---------------------------------------------------------------------------

export type WorkspaceInsert = Omit<WorkspaceRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  plan?: PlanType
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
}

export type WorkspaceMemberInsert = Omit<WorkspaceMemberRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  role?: WorkspaceRole
  status?: MemberStatus
  user_id?: string | null
  invited_email?: string | null
}

export type LeadInsert = Omit<LeadRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  status?: LeadStatus
  phone?: string | null
  company?: string | null
  role?: string | null
  owner_id?: string | null
}

export type DealInsert = Omit<DealRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  stage?: DealStage
  value?: number
  position?: number
  owner_id?: string | null
  deadline?: string | null
}

export type ActivityInsert = Omit<ActivityRow, 'id' | 'created_at'>

export type SubscriptionInsert = Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  current_period_start?: string | null
  current_period_end?: string | null
  canceled_at?: string | null
}

// ---------------------------------------------------------------------------
// Update types
// ---------------------------------------------------------------------------

export type WorkspaceUpdate       = Partial<Omit<WorkspaceRow,       'id' | 'created_at'>>
export type WorkspaceMemberUpdate = Partial<Omit<WorkspaceMemberRow, 'id' | 'created_at' | 'workspace_id'>>
export type LeadUpdate            = Partial<Omit<LeadRow,            'id' | 'created_at' | 'workspace_id'>>
export type DealUpdate            = Partial<Omit<DealRow,            'id' | 'created_at' | 'workspace_id'>>
export type ActivityUpdate        = Partial<Omit<ActivityRow,        'id' | 'created_at' | 'workspace_id'>>
export type SubscriptionUpdate    = Partial<Omit<SubscriptionRow,    'id' | 'created_at'>>

// ---------------------------------------------------------------------------
// Database — tipo raiz para createClient<Database>()
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row:    WorkspaceRow
        Insert: WorkspaceInsert
        Update: WorkspaceUpdate
      }
      workspace_members: {
        Row:    WorkspaceMemberRow
        Insert: WorkspaceMemberInsert
        Update: WorkspaceMemberUpdate
      }
      leads: {
        Row:    LeadRow
        Insert: LeadInsert
        Update: LeadUpdate
      }
      deals: {
        Row:    DealRow
        Insert: DealInsert
        Update: DealUpdate
      }
      activities: {
        Row:    ActivityRow
        Insert: ActivityInsert
        Update: ActivityUpdate
      }
      subscriptions: {
        Row:    SubscriptionRow
        Insert: SubscriptionInsert
        Update: SubscriptionUpdate
      }
    }
    Views: Record<string, never>
    Functions: {
      my_workspace_ids: {
        Args:    Record<string, never>
        Returns: string[]
      }
    }
    Enums: {
      plan_type:           PlanType
      workspace_role:      WorkspaceRole
      member_status:       MemberStatus
      lead_status:         LeadStatus
      deal_stage:          DealStage
      activity_type:       ActivityType
      subscription_status: SubscriptionStatus
    }
  }
}
