# PipeFlow CRM — Claude Code Briefing

## Project Overview

PipeFlow CRM is a B2B SaaS web platform for sales pipeline management, targeting SMBs, freelancers, and sales teams. It provides a visual Kanban pipeline, lead/contact management, activity tracking, multi-workspace isolation, and subscription monetization.

Core value prop: simpler and cheaper than HubSpot/Pipedrive, with a freemium model accessible to businesses just starting out.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 + shadcn/ui |
| Styling | Tailwind CSS v3 |
| Language | TypeScript 5 (strict mode) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Multi-tenancy | Supabase RLS (Row Level Security) |
| Payments | Stripe (Checkout + Webhooks + Customer Portal) |
| Email | Resend |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Deploy | Vercel (frontend) + Supabase (backend) |

## Folder Structure

```
/
├── app/
│   ├── (auth)/              # Public auth routes: login, register, onboarding
│   ├── (app)/               # Authenticated CRM routes (workspace-scoped)
│   │   ├── dashboard/       # Metrics dashboard
│   │   ├── leads/           # Lead list + detail pages
│   │   ├── pipeline/        # Kanban board
│   │   ├── activities/      # Activity log
│   │   ├── settings/        # Workspace settings, members, billing
│   │   └── layout.tsx       # App shell: sidebar + workspace switcher
│   ├── api/
│   │   └── webhooks/        # Stripe webhook handler
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page (public)
├── components/
│   ├── ui/                  # shadcn/ui primitives (Button, Card, Dialog…)
│   ├── kanban/              # KanbanBoard, KanbanColumn, DealCard
│   ├── leads/               # LeadForm, LeadTable, ActivityTimeline
│   └── dashboard/           # MetricCard, FunnelChart
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client
│   │   └── server.ts        # Server Supabase client (cookies)
│   ├── stripe.ts            # Stripe SDK instance + helpers
│   └── utils.ts             # cn(), formatCurrency(), etc.
├── types/
│   └── index.ts             # Workspace, Lead, Deal, Activity, Member, Plan
└── docs/
    └── PRD.md               # Full product requirements document
```

## Conventions

- **Server Components by default.** Only add `"use client"` when the component needs browser APIs, event handlers, or React hooks.
- **TypeScript strict mode.** No `any`, no implicit returns, explicit return types on all functions exported from `lib/`.
- **Tailwind utility classes only.** No CSS modules, no inline styles. Use `cn()` from `lib/utils.ts` for conditional classes.
- **shadcn/ui for all UI primitives.** Install components via `npx shadcn-ui@latest add <component>`, never copy-paste from docs manually.
- **Supabase RLS enforces multi-tenancy.** Every table with workspace data must have RLS policies. Never filter by workspace_id in application code as the sole guard — always rely on RLS as the security layer.
- **No comments explaining what code does.** Only add a comment when the WHY is non-obvious (hidden constraint, workaround, invariant).
- **No `console.log` in production code.** Use structured error handling.

## Key Domain Concepts

| Concept | Description |
|---|---|
| `Workspace` | An isolated tenant (company or team). All data is scoped to a workspace. |
| `Lead` | A contact/prospect with name, email, phone, company, role, status. |
| `Deal` | A sales opportunity linked to a lead, with value (R$), stage, owner, and deadline. |
| `Activity` | A logged interaction: call, email, meeting, or note. Linked to a lead. |
| `Member` | A user's membership in a workspace, with role: `admin` or `member`. |
| `Plan` | Subscription tier: `free` (2 members, 50 leads) or `pro` (unlimited, R$49/mês). |

## Pipeline Stages

In order: `new_lead` → `contacted` → `proposal_sent` → `negotiation` → `closed_won` → `closed_lost`

## Monetization

- **Free:** up to 2 workspace members, up to 50 leads
- **Pro:** unlimited members and leads — R$49/mês
- Stripe Checkout for upgrade flow
- Stripe Customer Portal for subscription management
- Stripe Webhook (Supabase Edge Function) activates/deactivates Pro automatically on payment events

## Design Language

- Inspired by: Pipedrive (pipeline UX), HubSpot (layout density), DataCrazy (visual style)
- Palette: professional neutrals (slate/gray), accent in indigo or blue, success in green, danger in red
- Typography: clean sans-serif (Inter), data-dense tables, compact cards
- Kanban board is the primary UI metaphor — it should feel fast and tactile
- Dark mode support via Tailwind `dark:` classes and shadcn/ui theming

## Environment Variables

Create a `.env.local` file at the root with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Process

1. Build in milestones — each milestone is a working, testable increment
2. Core functionality first: auth → leads → pipeline → dashboard → multi-workspace → payments → landing page
3. Test each milestone before moving to the next
4. Deploy to Vercel early and keep the preview URL always green
