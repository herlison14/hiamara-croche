# 🎨 Sistema de Categorias Interativo - HIAMARA CROCHÊ

## 📋 Estrutura Implementada

### Página Principal: `/categorias`
- **URL:** `https://hiamara-croche.vercel.app/categorias`
- Grid responsivo com 6 categorias principais
- Cada categoria é um card clicável
- Modal com carrossel ao clicar

---

## 🏷️ Categorias Disponíveis

### 1. **Blusas** (8 produtos)
- Blusa Amarela Summer - R$ 89,90
- Blusa Premium Designs - R$ 129,90
- Blusa Rosa Pastel - R$ 99,90
- Blusa Turquesa Rendada - R$ 119,90
- E mais 4 variações

### 2. **Bolsas** (6 produtos)
- Bolsa Flores Brancas - R$ 79,90
- Bolsa Multicolor - R$ 89,90
- Bolsa Premium Cores - R$ 119,90
- Bolsa Sacola Grande - R$ 99,90
- E mais 2 variações

### 3. **Amigurumi** (8 produtos)
- Amigurumi Anime Diversos - R$ 49,90
- Amigurumi Personagens Variados - R$ 54,90
- Amigurumi Naruto Ninja - R$ 59,90
- Amigurumi Boneco Rosa - **SOB CONSULTA**
- E mais 4 variações

### 4. **Cozinha** (8 produtos)
- Jogo Cozinha Floral - R$ 69,90
- Jogo Cozinha Multicolor - R$ 79,90
- Jogo Cozinha Verde Branco - R$ 74,90
- Acessório Banheiro Cozinha - R$ 34,90
- Tapete Cozinha - R$ 89,90
- E mais 3 variações

### 5. **Decoração** (4+ produtos)
- Home Decor - R$ 59,90
- Decorativo - R$ 44,90
- E mais itens

### 6. **Acessórios** (Coleção)
- Acessórios variados - **SOB CONSULTA**

---

## 🎯 Funcionalidades

### Card de Categoria
```
┌─────────────────────────┐
│  [IMAGEM DO PRODUTO]    │ ← Primeira imagem da categoria
├─────────────────────────┤
│ [CATEGORIA]             │
│ Nome do Produto         │
│ Descrição...            │
│ R$ XX,XX ou SOB CONSULTA│
│                         │
│  [VER DETALHES]         │
│  X itens disponíveis    │
└─────────────────────────┘
```

### Modal com Carrossel
```
┌─────────────────────────────────────────┐
│ Categorias              [X]              │
├─────────────────────────────────────────┤
│                                         │
│  [IMAGEM]  │  Nome Produto              │
│            │  Descrição                 │
│            │  Materiais: ...            │
│            │  Tamanhos: P M G GG        │
│            │  Preço: R$ XX,XX           │
│            │                            │
│            │  [Adicionar ao Carrinho]   │
│            │                            │
│  < ● ● ● ● ● >                         │
│       2 de 5                            │
└─────────────────────────────────────────┘
```

### Controles do Carrossel
- ⬅️ **Voltar** - Produto anterior
- 🔘 **Indicadores** - Clique para ir direto a um produto
- ➡️ **Avançar** - Próximo produto
- Mostra "X de Y" na base
- Suporta navegação por clique nos indicadores

---

## 🎬 Animações & Interações

✨ **Framer Motion**
- Entrada suave dos cards (fade-in + slide-up)
- Transições do carrossel
- Modal com scale-up animation
- Hover effects nos botões

🖱️ **Interatividade**
- Cards clicáveis para abrir modal
- Navegação intuitiva do carrossel
- Indicadores com progresso visual
- Responsivo (mobile, tablet, desktop)

---

## 💾 Dados Estruturados

### `lib/produtos-data.ts`
- **CategoriaData** interface
- **ProdutoData** interface
- Array de categorias com produtos aninhados
- Mapeamento de imagens → produtos
- Preços e metadados

### Estrutura JSON
```typescript
{
  id: 'blusa',
  nomeExibicao: 'Blusas',
  descricao: 'Blusas e tops em crochê',
  produtos: [
    {
      id: 'blusa-amarela-1',
      nome: 'Blusa Amarela Summer',
      descricao: '...',
      categoria: 'blusa',
      preco: 89.90,
      imagem: 'blusa_amarela-summer_1_pro.png',
      materiais: 'Fio 100% algodão',
      tamanhos: ['P', 'M', 'G', 'GG']
    },
    // ... mais produtos
  ]
}
```

---

## 🔌 Componentes Utilizados

### CategoriaCarrossel.tsx
- Modal com Framer Motion
- Carrossel de navegação
- Formatação de preços
- Indicadores interativos
- Responsivo com grid

### Dependências
```
- framer-motion (animações)
- lucide-react (ícones)
- next/image (otimização de imagens)
```

---

## 🚀 Deploy & Performance

✅ **Vercel Deployment**
- Auto-deploy via git push
- CDN global com cache otimizado
- Imagens servidas de `/produtos/`
- Build estático (SSG)

📊 **SEO Otimizado**
- Metadata dinâmica
- Open Graph ready
- Structured data compatible

---

## 📱 Responsividade

| Dispositivo | Grid | Layout |
|------------|------|--------|
| Mobile | 1 coluna | Stack vertical |
| Tablet | 2 colunas | 2x3 grid |
| Desktop | 3 colunas | 2x3 grid |

---

## 🎨 Design System

**Cores**
- Rosa primária: `#f43f5e` (rose-500)
- Rosa escura: `#be123c` (rose-600)
- Fundo: `#faf5f0` (rose-50)
- Texto: `#1f2937` (gray-800)

**Tipografia**
- Títulos: Cormorant Garamond (light)
- Corpo: DM Sans (regular)

**Espaçamento**
- Padding categoria: `p-6`
- Gap grid: `gap-8`
- Border radius: `rounded-2xl`

---

## 🔄 Fluxo de Integração Futura

1. ✅ Categorias criadas
2. ✅ Carrossel implementado
3. ⏳ Conectar com Firestore
4. ⏳ Atualizar preços dinamicamente
5. ⏳ Adicionar filtros por tamanho/cor
6. ⏳ Sistema de carrinho
7. ⏳ Checkout integrado

---

## 📞 Modificações Fáceis

### Adicionar Novo Produto
```typescript
// Em lib/produtos-data.ts
{
  id: 'blusa-nova',
  nome: 'Nova Blusa',
  descricao: 'Descrição...',
  categoria: 'blusa',
  preco: 99.90,
  imagem: 'blusa_nova_pro.png',
  materiais: 'Fio 100% algodão'
}
```

### Mudar Preço
```typescript
preco: 89.90  // ou null para "SOB CONSULTA"
```

### Adicionar Tamanhos
```typescript
tamanhos: ['P', 'M', 'G', 'GG']
```

---

## ✨ Destaques

🎯 **100% Interativo**
- Sem recarregamentos
- Navegação suave

🖼️ **Imagens Otimizadas**
- WebP automático
- Lazy loading
- Responsive

🎭 **Animações Premium**
- Framer Motion
- Transições suaves

📱 **Mobile-First**
- Touch-friendly
- Responsive design
- Performance otimizada

---

## 📊 Estatísticas

- **Total de Categorias:** 6
- **Total de Produtos:** 35+
- **Produtos sem Preço:** Alguns (aparecem como "SOB CONSULTA")
- **Imagens:** Todas as 154 imagens processadas disponíveis
- **Peso da Página:** ~150KB (otimizado)

---

**Desenvolvido com ❤️ para HIAMARA CROCHÊ**
