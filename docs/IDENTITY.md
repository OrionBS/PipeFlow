# PipeFlow — Identidade Visual

## Referência aprovada
Screenshot da landing page aprovada: fundo preto, tipografia bold, acento verde limão.

## Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| Background | `#000000` | Fundo geral da landing page e auth |
| Surface | `#0A0A0A` / `#111111` | Cards, painéis, mock UI |
| Accent / Primary | `#C8FF00` | CTAs, highlights, texto de destaque, bordas ativas |
| Text Primary | `#FFFFFF` | Títulos e corpo principal |
| Text Secondary | `#888888` / `#666666` | Subtítulos, labels, rodapé |
| Success | `#22C55E` (green-500) | Barras de pipeline "Fechado ✓" |
| Warning / Negotiation | `#F97316` (orange-400) | Barra "Negociação" |
| Info / New | `#3B82F6` (blue-500) | Barra "Novo" |
| Cyan / Contacted | `#06B6D4` (cyan-400) | Barra "Contato" |
| Proposal | `#A3E635` (lime-400) | Barra "Proposta" |
| Total highlight | `#C8FF00` | Valor total do pipeline |

## Tipografia

| Elemento | Estilo |
|---|---|
| Headline principal | Extra-bold / Black, uppercase ou sentence case, tamanho ~80–96px |
| Corpo | Regular, ~18px, line-height relaxado |
| Labels (mock UI) | Uppercase, tracking wide, ~10–11px, peso semibold |
| Fonte base | Inter (Google Fonts) |

## Tom e voz

- Tagline: **"Vendas em fluxo contínuo"**
- Subtítulo: "Gerencie leads, negócios e equipe num CRM que respeita a velocidade do seu time. Pipeline visual. Multi-empresa. Sem fricção."
- Badge: "● CRM DE VENDAS MULTI-EMPRESA" (ponto verde + uppercase)
- CTAs: "Começar grátis →" (fundo `#C8FF00`, texto preto) | "Ver funcionalidades" (ghost/outline)
- Rodapé de confiança: "— Sem cartão de crédito · Plano grátis para sempre"

## Mock UI (hero)

- Fundo do card: `#111111` com borda sutil
- Header do card: texto monospace/code — `pipeline — workspace: acme-corp`
- Três dots coloridos (vermelho, amarelo, verde) no canto superior esquerdo
- Estágios: NOVO, CONTATO, PROPOSTA, NEGOCIAÇÃO, FECHADO ✓
- Cada estágio: label uppercase à esquerda, barra colorida no centro, valor R$ + contagem à direita
- Total pipeline destacado em `#C8FF00` no rodapé do card

## Layout da hero section

- Duas colunas: texto à esquerda (~50%), mock UI à direita (~50%)
- Navbar: logo "P PipeFlow —" à esquerda, links centro, "Entrar" + CTA à direita
- Navbar fundo transparente sobre o dark background
- Padding generoso, alinhamento vertical centralizado

## Regras de uso

- O verde `#C8FF00` é exclusivo para elementos de ação e destaque — não usar como fundo de seções grandes
- Fundo sempre escuro (`#000000` ou muito próximo) na landing e auth
- Dentro do app (dashboard, kanban) pode usar slate/gray escuro com o mesmo acento verde
- Nunca misturar com paletas claras (white background) nas páginas públicas
