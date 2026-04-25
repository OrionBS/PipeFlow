-- =============================================================================
-- 006_create_subscriptions.sql
-- Tabela dedicada para rastrear assinaturas Stripe desacoplada de workspaces.
-- workspaces.plan continua sendo a fonte de verdade para controle de acesso;
-- esta tabela armazena o histórico e detalhes completos do ciclo de vida Stripe.
-- =============================================================================

create table public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  workspace_id            uuid        not null references public.workspaces (id) on delete cascade,
  stripe_customer_id      text        not null,
  stripe_subscription_id  text        not null,
  stripe_price_id         text        not null,
  status                  text        not null
                            check (status in (
                              'active', 'canceled', 'incomplete',
                              'incomplete_expired', 'past_due',
                              'trialing', 'unpaid'
                            )),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean     not null default false,
  canceled_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint subscriptions_stripe_customer_unique      unique (stripe_customer_id),
  constraint subscriptions_stripe_subscription_unique  unique (stripe_subscription_id)
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create index on public.subscriptions (workspace_id);
create index on public.subscriptions (stripe_subscription_id);
create index on public.subscriptions (status);
