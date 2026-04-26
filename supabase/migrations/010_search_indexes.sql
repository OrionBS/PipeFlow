-- =============================================================================
-- 010_search_indexes.sql
-- Índices para busca textual (M8) e lookup exato.
-- pg_trgm + GIN permite ILIKE '%...%' sem full table scan.
-- =============================================================================

create extension if not exists pg_trgm;

-- Busca por nome e empresa do lead (LeadSearch em M8)
create index if not exists leads_name_trgm_idx
  on public.leads using gin (name gin_trgm_ops);

create index if not exists leads_company_trgm_idx
  on public.leads using gin (company gin_trgm_ops);

-- Busca por título do deal (filtro no KanbanBoard em M8)
create index if not exists deals_title_trgm_idx
  on public.deals using gin (title gin_trgm_ops);

-- Lookup exato por e-mail dentro do workspace (unicidade + convite)
create index if not exists leads_workspace_email_idx
  on public.leads (workspace_id, email);
