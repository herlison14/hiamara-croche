# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run lint     # ESLint
npx tsc --noEmit # Checagem de tipos TypeScript (sem gerar arquivos)
```

Não há suite de testes automatizados — use Playwright (`@playwright/test`) se precisar adicionar E2E.

## Arquitetura

### Stack

- **Next.js 16** com App Router (RSC por padrão)
- **React 19** + **TypeScript 5** strict
- **Tailwind CSS 3** + **shadcn/ui** (Radix primitives + CVA)
- **Framer Motion** + **GSAP** para animações
- **Zustand 5** para estado do carrinho (persistido em localStorage como `hiamara-cart`)

### Duas fontes de dados em paralelo

O projeto usa **dois backends de produto** simultaneamente — isso é intencional:

| Backend | Usado para | Acesso |
|---|---|---|
| **Supabase** (PostgreSQL) | Pedidos, categorias, admin, fotos, configurações | `lib/supabase.ts` — helpers tipados |
| **Firebase Firestore** | Catálogo de produtos da loja | `lib/produtos-actions.ts` — Server Action via REST |

`fetchProdutoosAction` (note o typo com dois "o" — não corrigir, é usado amplamente) é a Server Action que busca produtos do Firestore via REST API diretamente, sem o SDK do Firebase client-side.

Os componentes `ProductCardFirebase` e `useFirebaseProdutos` usam o Firestore. Os componentes `ProductCard` (store) e helpers de `lib/supabase.ts` usam o Supabase.

### Estrutura de rotas

```
app/
├── page.tsx                          # Homepage pública (sem layout store)
├── (store)/                          # Layout com Header + Footer
│   ├── produtos/                     # Catálogo com TabsFiltro + nav de categorias
│   ├── produto/[slug]/               # Detalhe do produto
│   ├── carrinho/                     # Carrinho (client component, Zustand)
│   ├── checkout/                     # Checkout 3 etapas (dados → endereço → PIX)
│   └── pedido/[numero]/              # Rastreamento de pedido
├── categorias/                       # Vitrine de categorias (fora do store layout)
├── admin/                            # Painel protegido por cookie `admin_token=valid`
│   ├── login/
│   ├── produtos/                     # CRUD de produtos
│   ├── produtos/[id]/fotos/          # Upload de fotos
│   └── pedidos/                      # Gestão de pedidos
└── api/                              # Route Handlers
    ├── produtos/                     # CRUD via Supabase service role
    ├── pedidos/                      # Criação e consulta de pedidos
    ├── pagamento/pix/                # Gera QR Code Mercado Pago
    ├── pagamento/webhook/            # Webhook de confirmação de pagamento
    ├── admin/auth                    # Login/logout admin (seta cookie)
    └── admin/stats                   # Métricas do dashboard
```

### Autenticação admin

Sem JWT nem NextAuth. O admin faz POST em `/api/admin/auth` com `ADMIN_SECRET`; a API seta o cookie `admin_token=valid`. O `app/admin/layout.tsx` lê esse cookie via `cookies()` e redireciona para `/admin/login` se ausente.

### Fluxo de pagamento

1. Checkout cria pedido via `POST /api/pedidos`
2. Em seguida chama `POST /api/pagamento/pix` → gera QR Code no Mercado Pago
3. `PixQRCode` + `usePixPolling` ficam em polling até o webhook confirmar
4. `POST /api/pagamento/webhook` atualiza o status do pedido no Supabase

### Componentes UI base (`components/ui/`)

Todos construídos sobre Radix + CVA, seguindo o padrão shadcn/ui:
`button`, `card`, `badge`, `input`, `textarea`, `label`, `separator`, `select`, `sheet`, `tabs`

Para adicionar novos componentes shadcn: `npx shadcn@latest add <componente>` (o `components.json` já está configurado).

### Componente de abas de produto

`TabsFiltro` (em `components/TabsFiltro.tsx`) é o único componente de filtragem de produtos — substitui versões anteriores. Aceita `categoria?` e `abaInicial?`, busca do Firebase via `fetchProdutoosAction` e filtra client-side nas abas Todos / Destaques / Novidades / Mais Vendidos.

## Design System

Nunca usar cores hardcoded ou `text-gray-*` / `bg-white` / `bg-rose-*`. Usar sempre os tokens do projeto:

```
Fundo:     bg-creme-50 / bg-creme-100 / bg-creme-200
Borda:     border-creme-200
Texto:     text-texto-escuro / text-texto-medio / text-texto-claro
Destaque:  text-rosa-400 / bg-rosa-400  (primário)
           text-rosa-500 / bg-rosa-500  (hover / preços)
           bg-rosa-100 / text-rosa-500  (badges / sucesso)
Fonte display: classe `font-display` (Cormorant Garamond)
Fonte corpo:   `font-sans` (DM Sans, padrão)
```

Tokens shadcn mapeados: `primary` = rosa-400, `background` = creme-50, `border` = creme-200, `muted` = creme-100, `foreground` = texto-escuro.

## Variáveis de ambiente necessárias

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_PUBLIC_KEY
NEXT_PUBLIC_SITE_URL
ADMIN_SECRET
```

Copie `.env.local.example` para `.env.local` e preencha antes de rodar.
