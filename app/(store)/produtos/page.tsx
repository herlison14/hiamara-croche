import { Suspense } from 'react'
import { ProductCard } from '@/components/store/ProductCard'
import { CategoryHero } from '@/components/categoryHero'
import { ProductTabs } from '@/components/ProductTabs'
import { getCategorias, getProdutos } from '@/lib/supabase'

export const metadata = { title: 'Produtos — HIAMARA CROCHÊ' }

const ICONES: Record<string, string> = {
  'bonecos': '🧸', 'bolsas': '👜', 'roupas': '👗',
}

const CATS_FALLBACK = [
  { id: '1', slug: 'bonecos', nome: 'Bonecos' },
  { id: '2', slug: 'bolsas', nome: 'Bolsas' },
  { id: '3', slug: 'roupas', nome: 'Roupas' },
]

interface Props {
  searchParams: Promise<{ categoria?: string; ordem?: string; busca?: string }>
}

async function ProdutoGrid({ categoria, ordem, busca }: { categoria?: string; ordem?: string; busca?: string }) {
  const todos = await getProdutos({ categoria }).catch(() => [])

  let filtrados = busca
    ? todos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : todos

  if (ordem === 'preco_asc') filtrados = [...filtrados].sort((a, b) => a.preco - b.preco)
  else if (ordem === 'preco_desc') filtrados = [...filtrados].sort((a, b) => b.preco - a.preco)
  else if (ordem === 'mais_vendido') filtrados = filtrados.filter((p) => p.mais_vendido)

  if (filtrados.length === 0) {
    return (
      <div className="col-span-full text-center py-20 space-y-4">
        <div className="text-5xl">🧶</div>
        <p className="text-xl font-light text-[#5C4A4A]" style={{ fontFamily: 'Cormorant Garamond' }}>
          Nenhum produto encontrado
        </p>
        <p className="text-[#8A7B7B] text-sm">Tente outro filtro ou busca</p>
      </div>
    )
  }

  return (
    <>
      {filtrados.map((p) => <ProductCard key={p.id} produto={p} />)}
    </>
  )
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, ordem, busca } = await searchParams
  const categorias = await getCategorias().catch(() => CATS_FALLBACK)
  const categoriasFiltered = categorias.length > 0 ? categorias : CATS_FALLBACK

  const ordens = [
    { value: '', label: 'Mais Recentes' },
    { value: 'preco_asc', label: 'Menor Preço' },
    { value: 'preco_desc', label: 'Maior Preço' },
    { value: 'mais_vendido', label: 'Mais Vendidos' },
  ]

  return (
    <div className="min-h-screen bg-creme-50">
      {/* Category Hero - mostrado quando categoria selecionada */}
      {categoria && (
        <CategoryHero categoria={categoria} categorias={categoriasFiltered} />
      )}

      {/* Header padrão quando nenhuma categoria selecionada */}
      {!categoria && (
        <div className="bg-gradient-to-b from-creme-100 to-creme-50 py-16 px-6 text-center border-b border-creme-200">
          <h1 className="text-6xl md:text-7xl font-light text-texto-escuro" style={{ fontFamily: 'Cormorant Garamond' }}>
            Todos os Produtos
          </h1>
          <p className="text-texto-medio mt-4 font-light">Coleção completa de peças artesanais feitas à mão</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filtros - sticky no mobile */}
        <div className="flex flex-col gap-4 mb-12">
          {/* Categorias em destaque */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <a
              href="/produtos"
              className={`flex-shrink-0 px-5 py-3 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${!categoria ? 'bg-rosa-400 text-white shadow-lg' : 'bg-white border border-creme-300 text-texto-medio hover:border-rosa-300 hover:text-rosa-400'}`}
            >
              🧶 Todas
            </a>
            {categoriasFiltered.map((cat) => (
              <a
                key={cat.id}
                href={`/produtos?categoria=${cat.slug}`}
                className={`flex-shrink-0 px-5 py-3 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-2 ${categoria === cat.slug ? 'bg-rosa-400 text-white shadow-lg' : 'bg-white border border-creme-300 text-texto-medio hover:border-rosa-300 hover:text-rosa-400'}`}
              >
                <span>{ICONES[cat.slug] || '✨'}</span>
                {cat.nome}
              </a>
            ))}
          </div>

          {/* Search e Order */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form className="flex-1">
              <input
                name="busca"
                defaultValue={busca}
                placeholder="Buscar produto..."
                className="w-full px-4 py-3 bg-white border border-creme-300 rounded-lg text-sm focus:outline-none focus:border-rosa-400 focus:ring-2 focus:ring-rosa-100 text-texto-escuro"
              />
            </form>

            <select
              name="ordem"
              defaultValue={ordem}
              className="px-4 py-3 bg-white border border-creme-300 rounded-lg text-sm text-texto-escuro focus:outline-none focus:border-rosa-400 focus:ring-2 focus:ring-rosa-100"
            >
              {ordens.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <Suspense fallback={
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-creme-200 animate-pulse" />
            ))
          }>
            <ProdutoGrid categoria={categoria} ordem={ordem} busca={busca} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
