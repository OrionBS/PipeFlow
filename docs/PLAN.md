# PipeFlow CRM — Plano de Execução

> Estratégia: **UI primeiro, backend depois.**
> Cada milestone é um incremento testável. Interfaces são construídas com dados mock antes de qualquer integração com Supabase ou Stripe. O backend é conectado milestone por milestone após a UI estar aprovada.

---

## Visão Geral dos Milestones

| # | Nome | Branch | Fase | Status |
|---|---|---|---|---|
| M0 | Setup & Scaffolding | `main` | Fundação | ✅ Concluído |
| M1 | Landing Page | `feat/landing-page` | UI | ✅ Concluído |
| M2 | App Shell & Auth Pages | `feat/app-shell` | UI | ✅ Concluído |
| M3 | Leads UI | `feat/leads-ui` | UI | ✅ Concluído |
| M4 | Pipeline Kanban UI | `feat/pipeline-ui` | UI | ✅ Concluído |
| M5 | Dashboard & Settings UI | `feat/dashboard-ui` | UI | ✅ Concluído |
| M6 | Auth & Banco de Dados | `feat/auth-database` | Backend | ✅ Concluído |
| M7 | Leads Backend | `feat/leads-backend` | Backend | 🔄 Próximo |
| M8 | Pipeline Backend | `feat/pipeline-backend` | Backend | ⏳ Pendente |
| M9 | Dashboard Backend | `feat/dashboard-backend` | Backend | ⏳ Pendente |
| M10 | Multi-workspace & Colaboração | `feat/workspaces` | Backend | ⏳ Pendente |
| M11 | Monetização (Stripe) | `feat/stripe` | Backend | ⏳ Pendente |
| M12 | Deploy & Produção | `feat/production` | Launch | ⏳ Pendente |

---

## M0 — Setup & Scaffolding

**Branch:** `main`
**Objetivo:** Repositório funcionando localmente com toda a toolchain configurada, estrutura de pastas definida e deploy inicial no Vercel (preview vazia).

### Entregas

- [x] Criar projeto Next.js 14 com App Router e TypeScript strict (`npx create-next-app@latest`)
- [x] Configurar Tailwind CSS v3
- [x] Instalar e inicializar shadcn/ui (`npx shadcn-ui@latest init`) com tema slate
- [x] Configurar fonte Inter via `next/font`
- [x] Criar estrutura de pastas conforme `CLAUDE.md`: `app/`, `components/`, `lib/`, `types/`, `docs/`
- [x] Criar `lib/utils.ts` com `cn()` e `formatCurrency()`
- [x] Criar `types/index.ts` com interfaces: `Workspace`, `Lead`, `Deal`, `Activity`, `Member`, `Plan`
- [x] Criar `.env.local` com todas as variáveis (valores vazios)
- [x] Criar `.env.example` com as mesmas variáveis (para o repo)
- [x] Configurar `.gitignore` (incluir `.env.local`)
- [x] Inicializar repositório Git e subir para GitHub
- [x] Linkar projeto ao Vercel e fazer primeiro deploy

**Commit final:** `chore: project scaffolding — Next.js 14, Tailwind, shadcn/ui, folder structure`

---

## M1 — Landing Page

**Branch:** `feat/landing-page`
**Objetivo:** Página pública `/` completamente construída e visualmente aprovada, sem nenhuma integração de backend.

### Entregas

- [x] Criar `app/page.tsx` com layout da landing page
- [x] Seção **Hero:** headline, subtítulo, CTA "Começar grátis" e "Ver demo"
- [x] Seção **Funcionalidades:** grid de 6 cards com ícones (Pipeline Kanban, Gestão de Leads, Dashboard, Multi-empresa, Atividades, Planos)
- [x] Seção **Como funciona:** passo a passo visual (3 etapas)
- [x] Seção **Planos & Preços:** cards Free vs Pro com lista de features e botão de CTA
- [x] Seção **CTA final:** banner de conversão com botão
- [x] `components/landing/Navbar.tsx` — header público com logo e links
- [x] `components/landing/Footer.tsx` — rodapé com links e copyright
- [x] Responsivo (mobile-first)
- [x] Dark mode funcionando

**Commit final:** `feat: landing page — hero, features, pricing, CTA sections`

---

## M2 — App Shell & Auth Pages

**Branch:** `feat/app-shell`
**Objetivo:** Shell completo da aplicação autenticada (sidebar, header, navegação) e páginas de auth construídas com UI estática — sem lógica de autenticação real.

### Entregas

**App Shell**
- [x] `app/(app)/layout.tsx` — layout com sidebar fixa e área de conteúdo
- [x] `components/layout/Sidebar.tsx` — navegação: Dashboard, Leads, Pipeline, Atividades, Configurações
- [x] `components/layout/WorkspaceSwitcher.tsx` — dropdown com workspaces mock e opção "Criar workspace"
- [x] `components/layout/UserMenu.tsx` — avatar, nome, plano atual, logout
- [x] `components/layout/TopBar.tsx` — breadcrumb e busca global (UI)
- [x] Indicador visual do plano ativo (badge Free/Pro na sidebar)
- [x] Navegação ativa destacada na sidebar

**Auth Pages**
- [x] `app/(auth)/login/page.tsx` — formulário e-mail + senha, link "Esqueci a senha"
- [x] `app/(auth)/register/page.tsx` — formulário nome + e-mail + senha
- [x] `app/(auth)/onboarding/page.tsx` — fluxo de 2 etapas: criar workspace (nome + slug) → convidar membros (pular disponível)
- [x] `app/(auth)/invite/[token]/page.tsx` — página de aceite de convite

**Geral**
- [x] Responsivo no mobile (sidebar colapsável)
- [x] Tema dark/light consistente

**Commit final:** `feat: app shell (sidebar, workspace switcher) and auth pages UI`

---

## M3 — Leads UI

**Branch:** `feat/leads-ui`
**Objetivo:** Módulo de leads completo com dados mock — listagem, filtros, formulário e página de detalhe com timeline de atividades.

### Entregas

**Listagem**
- [x] `app/(app)/leads/page.tsx` — página principal de leads
- [x] `components/leads/LeadTable.tsx` — tabela com colunas: nome, empresa, e-mail, status, responsável, data
- [x] `components/leads/LeadFilters.tsx` — filtros por status, responsável, data (Select + DatePicker)
- [x] `components/leads/LeadSearch.tsx` — busca em tempo real por nome/empresa/e-mail
- [x] Paginação (UI)
- [x] Botão "Novo Lead" abre modal

**Formulário**
- [x] `components/leads/LeadForm.tsx` — campos: nome*, e-mail*, telefone, empresa, cargo, status, responsável
- [x] Validação de campos obrigatórios (visual)
- [x] Modal de criação e edição usando `Dialog` do shadcn/ui

**Detalhe do Lead**
- [x] `app/(app)/leads/[id]/page.tsx` — página de detalhe
- [x] `components/leads/LeadProfile.tsx` — bloco com todos os dados do lead e botão editar
- [x] `components/leads/ActivityTimeline.tsx` — timeline cronológica com tipo de atividade (ícone), autor, descrição e data
- [x] `components/leads/ActivityForm.tsx` — formulário inline: tipo (ligação/e-mail/reunião/nota), descrição, data
- [x] Negócios vinculados ao lead (lista lateral)
- [x] Mock data com pelo menos 5 leads e atividades variadas (expandido para 15 leads, 27 atividades, todos os status cobertos)

**Commit final:** `feat: leads UI — list, filters, form, detail page, activity timeline`

---

## M4 — Pipeline Kanban UI

**Branch:** `feat/pipeline-ui`
**Objetivo:** Board Kanban completamente funcional visualmente com drag-and-drop entre colunas — sem persistência de dados.

### Entregas

- [x] Instalar `@dnd-kit/core` e `@dnd-kit/sortable`
- [x] `app/(app)/pipeline/page.tsx` — página do pipeline
- [x] `components/kanban/KanbanBoard.tsx` — container principal com DndContext
- [x] `components/kanban/KanbanColumn.tsx` — coluna por etapa com título, valor total e contador de cards
- [x] `components/kanban/DealCard.tsx` — card com título do negócio, valor (R$), lead vinculado, responsável (avatar), prazo e indicador de atraso
- [x] 6 colunas: Novo Lead → Contato Realizado → Proposta Enviada → Negociação → Fechado Ganho → Fechado Perdido
- [x] Drag-and-drop entre colunas (estado local, sem backend)
- [x] Colunas "Fechado Ganho" e "Fechado Perdido" com cores distintas (verde/vermelho)
- [x] Modal "Novo Negócio" — campos: título, valor, lead, responsável, prazo, etapa inicial
- [x] Modal de detalhe do negócio ao clicar no card
- [x] Mock data com pelo menos 8 negócios distribuídos nas colunas (12 negócios, 15 leads)
- [x] Scroll horizontal no mobile

**Commit final:** `feat: kanban pipeline UI — columns, deal cards, drag-and-drop`

---

## M5 — Dashboard & Settings UI

**Branch:** `feat/dashboard-ui`
**Objetivo:** Dashboard de métricas com gráficos e todas as telas de configurações — tudo com dados estáticos.

### Entregas

**Dashboard**
- [x] Instalar `recharts`
- [x] `app/(app)/dashboard/page.tsx`
- [x] `components/dashboard/MetricCard.tsx` — card com título, valor, variação percentual e ícone
- [x] 4 metric cards: Total de Leads, Negócios Abertos, Valor do Pipeline (R$), Taxa de Conversão (%)
- [x] `components/dashboard/FunnelChart.tsx` — gráfico de funil por etapa do pipeline (Recharts)
- [x] `components/dashboard/DealsDeadlineList.tsx` — lista de negócios com prazo próximo (próximos 7 dias)
- [x] Filtro de período no dashboard (últimos 7d / 30d / 90d) — UI apenas

**Settings**
- [x] `app/(app)/settings/page.tsx` — hub de configurações com menu lateral
- [x] `app/(app)/settings/workspace/page.tsx` — nome, logo (upload UI), slug do workspace
- [x] `app/(app)/settings/members/page.tsx` — tabela de membros com papel (Admin/Membro) e botão remover; formulário de convite por e-mail
- [x] `app/(app)/settings/billing/page.tsx` — plano atual, uso (leads X/50, membros X/2 para Free), botão "Fazer upgrade" e link "Gerenciar assinatura"
- [x] `app/(app)/settings/profile/page.tsx` — nome, e-mail, avatar, alterar senha

**Commit final:** `feat: dashboard UI (metrics, funnel chart) and settings pages`

---

## M6 — Auth & Banco de Dados

**Branch:** `feat/auth-database`
**Objetivo:** Supabase configurado, schema completo com RLS, autenticação funcionando de ponta a ponta — login, registro, onboarding persistindo workspace real.

### Entregas

**Supabase Setup**
- [x] Criar projeto no Supabase e preencher variáveis de ambiente
- [x] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [x] Criar `lib/supabase/client.ts` (browser) e `lib/supabase/server.ts` (server + cookies)
- [x] Criar `proxy.ts` (antes `middleware.ts`) — proteger rotas `/(app)` e redirecionar para `/login` (migrado para convenção Next.js 16)

**Schema SQL**
- [x] Tabela `workspaces` — id, name, slug, plan, stripe_customer_id, stripe_subscription_id, created_at
- [x] Tabela `members` — id, workspace_id, user_id, role (`admin`|`member`), invited_email, status, created_at
- [x] Tabela `leads` — id, workspace_id, name, email, phone, company, role, status, owner_id, created_at
- [x] Tabela `deals` — id, workspace_id, lead_id, title, value, stage, owner_id, deadline, created_at
- [x] Tabela `activities` — id, workspace_id, lead_id, type, description, author_id, date, created_at
- [x] Tabela `invites` — id, workspace_id, email, token, role, expires_at, accepted_at

**RLS Policies**
- [x] Policies em todas as tabelas: acesso restrito a membros do mesmo workspace (`007_rls_policies.sql`)
- [x] Policy especial em `invites`: leitura por token público (para aceite de convite)
- [x] RPC `create_workspace_with_admin` — transação atômica para bootstrap do workspace (`008_create_workspace_rpc.sql`)
- [x] Fix escalação de privilégio em membros (`009_fix_member_escalation.sql`)
- [x] Índices trigram GIN para busca textual (`010_search_indexes.sql`)

**Supabase Extras**
- [x] Criar `lib/supabase/service.ts` — client com service role key (bypass RLS para operações de sistema)
- [x] Criar `app/auth/callback/route.ts` — handler PKCE para email confirmation

**Auth**
- [x] Login com e-mail/senha (Supabase Auth) — `actions/auth.ts`
- [x] Registro com criação automática de perfil — `actions/auth.ts`
- [x] Onboarding: criar workspace → criar membro admin → redirecionar para dashboard — `actions/workspace.ts`
- [x] Logout funcionando
- [x] Persistência de sessão via cookies (SSR)
- [x] Middleware protegendo todas as rotas `/(app)`
- [x] Páginas de login, register e onboarding conectadas às Server Actions reais

**Commit final:** `feat: database schema, RLS policies, and TypeScript types (M6) (#10)` ✅

---

## M7 — Leads Backend

**Branch:** `feat/leads-backend`
**Objetivo:** Módulo de leads conectado ao Supabase — CRUD real, filtros, busca e timeline de atividades persistidas.

> **Prerequisito:** ~~Renomear `middleware.ts` → `proxy.ts`~~ ✅ Feito (Next.js 16 exige export `proxy`, não `middleware`).

### Entregas

**Workspace context (base de tudo)**
- [ ] Criar `lib/workspace.ts` — helper `getCurrentWorkspaceId()` que lê o cookie `pipeflow_workspace_id`
- [ ] Criar `lib/limits.ts` — funções `canAddLead(workspaceId)` e `canAddMember(workspaceId)` que retornam `{allowed, current, limit}`
- [ ] Criar `lib/roles.ts` — funções `isAdmin(workspaceId)` e `getMemberRole(workspaceId)` para RBAC em Server Actions

**Server Actions — Leads** (`actions/leads.ts`)
- [ ] `createLeadAction(payload)` — valida Zod, checa `canAddLead()`, insere no banco, revalida cache
- [ ] `updateLeadAction(id, payload)` — valida, atualiza, revalida
- [ ] `deleteLeadAction(id)` — verifica ownership no workspace, deleta
- [ ] `getLeads(filters?)` — query com filtros de status, busca por nome/empresa (ILIKE usando índices trigram), paginação

**Server Actions — Atividades** (`actions/activities.ts`)
- [ ] `createActivityAction(leadId, payload)` — cria atividade vinculada ao lead
- [ ] `getActivitiesByLead(leadId)` — lista cronológica de atividades

**Integração UI**
- [ ] Substituir mock data em `app/(app)/leads/page.tsx` por `getLeads()` real
- [ ] `LeadTable` renderiza dados reais (Server Component)
- [ ] `LeadSearch` e `LeadFilters` passam params para query no banco (URL search params)
- [ ] `LeadForm` chama `createLeadAction` / `updateLeadAction` com loading e error states
- [ ] Página de detalhe `app/(app)/leads/[id]/page.tsx` carrega lead + atividades reais
- [ ] `ActivityForm` persiste via `createActivityAction`
- [ ] Selector "Responsável" populado com membros reais do workspace
- [ ] Barra de uso no topo da listagem: "X/50 leads usados" (visível só no plano Free)

**Error handling**
- [ ] Limite de leads atingido → toast com mensagem e link para upgrade
- [ ] Operações proibidas para `member` (ex: deletar lead de outro) retornam erro 403 amigável
- [ ] Loading states (skeleton) em todas as listas

**Commit final:** `feat: leads backend — CRUD, activity timeline, plan limits`

---

## M8 — Pipeline Backend

**Branch:** `feat/pipeline-backend`
**Objetivo:** Pipeline Kanban conectado ao banco — negócios criados, editados e movidos entre etapas com persistência real.

### Entregas

**Server Actions — Deals** (`actions/deals.ts`)
- [ ] `createDealAction(payload)` — cria negócio com lead, valor, stage, owner, deadline
- [ ] `updateDealAction(id, payload)` — edita negócio
- [ ] `deleteDealAction(id)` — remove negócio
- [ ] `moveDealAction(id, newStage, newPosition)` — persiste mudança de etapa + posição após drag-and-drop

**Integração UI**
- [ ] Substituir mock data no `KanbanBoard` por dados reais do Supabase
- [ ] Drag-and-drop chama `moveDealAction` com optimistic UI (atualiza estado local antes da confirmação do banco)
- [ ] Modal de criação com seletor de leads reais do workspace
- [ ] Modal de detalhe do negócio editável e com botão de deletar
- [ ] `DealCard` popula nome/empresa do lead vinculado
- [ ] Borda vermelha no card quando `deadline < today`
- [ ] Loading states e error handling

**Commit final:** `feat: pipeline backend — deals CRUD, stage persistence, optimistic DnD`

---

## M9 — Dashboard Backend

**Branch:** `feat/dashboard-backend`
**Objetivo:** Métricas reais calculadas do banco de dados, gráfico de funil com dados reais do pipeline.

### Entregas

- [ ] Query agregada: total de leads do workspace
- [ ] Query agregada: negócios abertos (excluindo closed_won e closed_lost)
- [ ] Query agregada: soma de valor dos negócios abertos
- [ ] Query agregada: taxa de conversão (closed_won / total deals)
- [ ] Query por etapa: contagem de negócios para o gráfico de funil
- [ ] Query: deals com deadline nos próximos 7 dias do usuário logado
- [ ] Filtro de período funcional (7d / 30d / 90d) alterando as queries
- [ ] Cache das queries com `unstable_cache` do Next.js (revalidação a cada 60s)

**Commit final:** `feat: dashboard backend — real metrics, funnel chart, deadline alerts`

---

## M10 — Multi-workspace & Colaboração

**Branch:** `feat/workspaces`
**Objetivo:** Sistema multi-workspace completo — criação, alternância, convite por e-mail, papéis e controle de acesso.

### Entregas

**Workspaces**
- [ ] Usuário pode criar múltiplos workspaces
- [ ] `WorkspaceSwitcher` carrega workspaces reais do usuário logado
- [ ] Alternância de workspace muda contexto de todos os dados (sem reload de página)
- [ ] workspace_id atual salvo em cookie de sessão

**Convites**
- [ ] Instalar `resend`
- [ ] Server Action `inviteMember` — cria registro em `invites`, envia e-mail via Resend
- [ ] Template de e-mail de convite com link de aceite
- [ ] `app/(auth)/invite/[token]/page.tsx` — valida token, cria membership, redireciona para o workspace

**Papéis e Permissões**
- [ ] Hook `useWorkspaceRole` — retorna papel do usuário no workspace atual
- [ ] Proteção de ações Admin-only (remover membro, editar workspace, gerenciar billing)
- [ ] Membro não pode editar configurações do workspace
- [ ] Botão remover membro funcional com confirmação

**Commit final:** `feat: multi-workspace, member invites via email, role-based access`

---

## M11 — Monetização (Stripe)

**Branch:** `feat/stripe`
**Objetivo:** Plano Free com limites aplicados, upgrade para Pro via Stripe Checkout e gerenciamento de assinatura via Customer Portal.

### Entregas

**Stripe Setup**
- [ ] Instalar `stripe`
- [ ] Criar `lib/stripe.ts` — instância do Stripe SDK
- [ ] Criar produto e preço no Stripe Dashboard (R$49/mês recorrente)
- [ ] Preencher `STRIPE_PRO_PRICE_ID` no `.env.local`

**Checkout**
- [ ] Server Action `createCheckoutSession` — cria sessão Stripe com `workspace_id` nos metadata
- [ ] Botão "Fazer upgrade" na página de billing redireciona para Stripe Checkout
- [ ] Página de sucesso `app/(app)/settings/billing/success/page.tsx`
- [ ] Página de cancelamento redireciona de volta para billing

**Webhooks**
- [ ] `app/api/webhooks/stripe/route.ts` — handler de webhooks
- [ ] Evento `checkout.session.completed` → atualiza `workspaces.plan = 'pro'` e salva IDs do Stripe
- [ ] Evento `customer.subscription.deleted` → reverte `workspaces.plan = 'free'`
- [ ] Verificação de assinatura do webhook (`stripe.webhooks.constructEvent`)

**Customer Portal**
- [ ] Server Action `createPortalSession` — cria sessão do Customer Portal
- [ ] Botão "Gerenciar assinatura" na billing page redireciona para o portal

**Limites do plano Free (enforcement)**
- [ ] Criar `lib/plan-limits.ts` — funções `canAddLead()` e `canAddMember()`
- [ ] Server Actions de criação de lead e convite verificam limite antes de persistir
- [ ] UI mostra barra de progresso (ex: "32/50 leads usados")

**Commit final:** `feat: Stripe monetization — checkout, webhooks, customer portal, plan limits`

---

## M12 — Deploy & Produção

**Branch:** `feat/production`
**Objetivo:** Aplicação em produção com domínio configurado, variáveis de ambiente de produção, build limpo e checklist de launch concluído.

### Entregas

**Vercel**
- [ ] Configurar todas as variáveis de ambiente de produção no Vercel Dashboard
- [ ] Configurar domínio customizado (ou confirmar URL `*.vercel.app`)
- [ ] Verificar que build de produção (`next build`) passa sem erros ou warnings de TypeScript
- [ ] Configurar `NEXT_PUBLIC_APP_URL` com a URL de produção

**Supabase**
- [ ] Revisar todas as RLS policies no ambiente de produção
- [ ] Habilitar proteção contra e-mails não confirmados (Auth settings)
- [ ] Configurar URL de redirecionamento de auth para o domínio de produção
- [ ] Habilitar backups automáticos no Supabase

**Stripe**
- [ ] Trocar chaves de test por chaves de produção (`live`)
- [ ] Registrar URL de webhook de produção no Stripe Dashboard
- [ ] Testar fluxo de checkout com cartão real (pequena cobrança de teste)

**Checklist final**
- [ ] Fluxo completo: registro → onboarding → criar lead → mover no pipeline → dashboard atualizado
- [ ] Fluxo de convite: admin convida membro → e-mail chega → aceite → membro acessa workspace
- [ ] Fluxo de upgrade: Free com 50 leads → botão upgrade → checkout → Pro ativado
- [ ] Landing page acessível em `/` sem autenticação
- [ ] 404 page customizada
- [ ] Favicon e meta tags (título, descrição, OG image)

**Commit final:** `feat: production deploy — env vars, domain, auth config, launch checklist`

---

## Ordem de Dependências

```
M0 (scaffolding)
 └─ M1 (landing)
 └─ M2 (app shell UI)
     └─ M3 (leads UI)
     └─ M4 (pipeline UI)
     └─ M5 (dashboard UI)
         └─ M6 (auth + database)  ← ponto de virada: backend começa aqui
             └─ M7 (leads backend)
             └─ M8 (pipeline backend)
             └─ M9 (dashboard backend)
                 └─ M10 (workspaces + colaboração)
                     └─ M11 (stripe)
                         └─ M12 (produção)
```

---

## Regras de Merge

- Todo milestone é desenvolvido em sua branch própria
- Merge na `main` somente após testar o milestone localmente
- Vercel faz preview deploy automático de cada branch
- `main` deve sempre estar verde (build passando)
