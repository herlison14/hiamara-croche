# Design System: HIAMARA CROCHÊ
**Projeto:** Loja Virtual de Artesanato em Crochê  
**Stack:** Next.js 15 App Router + Tailwind CSS + Supabase  
**Versão:** 1.0 — Abril 2026

---

## 1. Visual Theme & Atmosphere

**Espírito:** *Delicadeza Artesanal Contemporânea*

A HIAMARA CROCHÊ traduz o calor do artesanato feito à mão em uma experiência digital poética e atual. O design evoca uma manhã suave de primavera: pétalas de flores reais desfocadas ao fundo, texturas orgânicas, e a leveza do fio creme entre os dedos. Não é um layout genérico — é um **ambiente sensorial**.

- **Densidade:** Arejada, com espaços brancos generosos que respeitam cada peça
- **Textura:** Sutil ruído de linho/algodão nos fundos, nunca chapado
- **Movimento:** Transições suaves (fade + slide), sem agressividade
- **Fotografia:** Flores reais (rosas, peônias, jasmins) com opacity 15–25% como textura de fundo; produtos em luz natural

---

## 2. Color Palette & Roles

### Cores Primárias

| Nome Descritivo | Hex | Papel Funcional |
|---|---|---|
| **Creme Puro — Leite Quente** | `#FDFAF5` | Fundo principal de todas as páginas |
| **Creme Marfim — Algodão Cru** | `#F5EFE6` | Fundo de seções alternadas, cards |
| **Creme Dourado — Mel Claro** | `#EDE0CD` | Bordas suaves, divisores, hover de cards |

### Cores de Destaque (Rosa)

| Nome Descritivo | Hex | Papel Funcional |
|---|---|---|
| **Rosa Névoa — Petala Suave** | `#F4C5CB` | Badges, tags, acentos decorativos |
| **Rosa Blush — Coração Quente** | `#E8A0A8` | Botões secundários, ícones ativos |
| **Rosa Antigo — Amor Profundo** | `#C97A84` | Botão primário CTA, links ativos |
| **Rosa Vinho Suave — Peônia** | `#A85A65` | Hover de botão principal, preços |

### Cores Neutras

| Nome Descritivo | Hex | Papel Funcional |
|---|---|---|
| **Cinza Quente — Fumaça de Linho** | `#8A7B7B` | Texto secundário, placeholders |
| **Castanho Velado — Terra Antiga** | `#5C4A4A` | Texto de corpo, descrições |
| **Chocolate Amargo — Noite de Lã** | `#3D2B2B` | Títulos, headings, texto forte |

### Overlay de Flores (Background)
- Flores reais (peônias, rosas silvestres): `opacity: 0.12` a `0.20`
- Mix-blend-mode: `multiply` sobre fundo creme
- Sempre desfocadas: `blur(2px)` a `blur(4px)`

---

## 3. Typography Rules

### Fontes
```
Heading / Display: 'Cormorant Garamond' — serif, elegante, feminino
Subheading: 'Cormorant Garamond' italic
Body / UI: 'DM Sans' — sans-serif, limpo, moderno
Accents / Prices: 'Cormorant Garamond' bold
```

### Hierarquia
- **H1 (Hero):** Cormorant Garamond, 56–72px, weight 300, letter-spacing -0.02em, cor `#3D2B2B`
- **H2 (Seção):** Cormorant Garamond, 36–44px, weight 400, cor `#5C4A4A`
- **H3 (Card):** Cormorant Garamond, 22–26px, weight 500
- **Body:** DM Sans, 15–16px, weight 400, line-height 1.7, cor `#5C4A4A`
- **Preço:** Cormorant Garamond, 20px, weight 600, cor `#A85A65`
- **Label/Badge:** DM Sans, 11px, uppercase, letter-spacing 0.12em

---

## 4. Component Stylings

### Botões

**Primário (CTA):**
- Fundo sólido `#C97A84` → hover `#A85A65`
- Texto branco, DM Sans, 14px, uppercase, letter-spacing 0.08em
- Borda: nenhuma. Cantos: levemente arredondados (6px)
- Padding: `12px 32px`
- Sombra suave: `0 4px 16px rgba(168, 90, 101, 0.25)`
- Transição: 300ms ease

**Secundário:**
- Fundo transparente, borda `1.5px solid #C97A84`, texto `#C97A84`
- Hover: fundo `#F4C5CB`, borda mantida

**Ghost / Texto:**
- Sem fundo, sem borda, texto `#C97A84`, underline suave no hover

### Cards de Produto
- Fundo: `#FDFAF5`
- Borda: `1px solid #EDE0CD`
- Cantos: generosamente arredondados (16px)
- Sombra em repouso: `0 2px 12px rgba(61, 43, 43, 0.06)`
- Sombra hover: `0 8px 32px rgba(61, 43, 43, 0.12)` + elevação leve `translateY(-4px)`
- Imagem: ratio 4:5, object-fit cover, cantos 12px 12px 0 0
- Transição: 350ms cubic-bezier(0.4, 0, 0.2, 1)

### Inputs / Formulários
- Fundo: `#FDFAF5`
- Borda: `1.5px solid #EDE0CD`
- Foco: borda `#C97A84`, sombra `0 0 0 3px rgba(201, 122, 132, 0.15)`
- Cantos: 8px
- Placeholder: `#8A7B7B`
- Label: DM Sans, 12px, uppercase, letter-spacing 0.1em, cor `#8A7B7B`

### Badges / Tags de Categoria
- Fundo: `#F4C5CB`
- Texto: `#A85A65`, 11px, uppercase, letter-spacing 0.1em
- Cantos: pill-shaped (full rounded)
- Padding: `4px 12px`

### Navigation / Header
- Fundo: `rgba(253, 250, 245, 0.95)` com `backdrop-filter: blur(12px)`
- Borda inferior: `1px solid #EDE0CD`
- Sticky no scroll
- Logo: Cormorant Garamond, 26px, `#3D2B2B`

### Overlay de Flores (Componente Reutilizável)
```css
.flower-bg {
  position: absolute;
  inset: 0;
  background-image: url('/flowers/[nome].webp');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  filter: blur(3px);
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

---

## 5. Layout Principles

### Grid & Espaçamento
- **Container máximo:** 1280px, padding lateral 24px (mobile) → 48px (desktop)
- **Grid de produtos:** 2 colunas (mobile) → 3 colunas (tablet) → 4 colunas (desktop)
- **Gap entre cards:** 24px
- **Seções:** padding vertical 80px (desktop) / 48px (mobile)
- **Whitespace:** Generoso. Deixar o produto respirar. Nada de densidade excessiva.

### Hierarquia Visual de Página
1. **Hero:** Full-viewport, flores ao fundo, texto centralizado grande
2. **Categorias:** Chips horizontais com scroll ou grid 2x2
3. **Destaques:** Grid 3 produtos com um card maior em destaque
4. **Sobre / História:** Split layout — texto à esquerda, imagem artesanal à direita
5. **Novidades / Mais Vendidos:** Carrossel com scroll horizontal
6. **Footer:** Creme escuro, links simples, instagram, whatsapp

### Micro-interações
- Cards: elevação suave no hover
- Botão: ripple muito sutil + scale 0.98 no click
- Imagem do produto: zoom suave (scale 1.04) ao hover no card
- Adicionado ao carrinho: animação de "voo" do produto até o ícone do carrinho

### Mobile-First
- Touch targets mínimos: 48px
- Bottom navigation em mobile (Home, Produtos, Carrinho, Admin)
- Swipe gestures no carrossel de produtos

---

## 6. Identidade Visual & Logo

**Nome:** HIAMARA CROCHÊ  
**Slogan sugerido:** *"Feito à mão, entregue com amor"*  
**Logo:** Cormorant Garamond italic em `#3D2B2B`, com um detalhe de laço/nó de crochê SVG acima ou ao lado  
**Ícone:** Agulha de crochê estilizada em `#C97A84`

---

## 7. Tokens CSS (Tailwind Custom Config)

```js
// tailwind.config.ts
colors: {
  creme: {
    50:  '#FDFAF5',
    100: '#F5EFE6',
    200: '#EDE0CD',
    300: '#E0CCBA',
  },
  rosa: {
    100: '#F4C5CB',
    200: '#E8A0A8',
    300: '#D98089',
    400: '#C97A84',
    500: '#A85A65',
    600: '#8A4450',
  },
  texto: {
    claro:   '#8A7B7B',
    medio:   '#5C4A4A',
    escuro:  '#3D2B2B',
  }
}
```
