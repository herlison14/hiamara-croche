import { Suspense } from 'react'
import { ProductCard } from '@/components/store/ProductCard'
import { CategoryHero } from '@/components/categoryHero'
import { ProdutosClient } from '@/components/ProdutosClient'
import { getProdutosFirebase, getCategorias } from '@/lib/firebase-helpers'

export const metadata = { title: 'Produtos — HIAMARA CROCHÊ' }

const ICONES: Record<string, string> = {
  'bonecos': '🧸', 'bolsas': '👜', 'roupas': '👗',
}

interface Props {
  searchParams: Promise<{ categoria?: string; abas?: string; busca?: string }>
}

async function ProdutoGrid({ categoria, abas, busca }: { categoria?: string; abas?: string; busca?: string }) {
  const todos = await getProdutosFirebase({ categoria }).catch(() => [])

  let filtrados = busca
    ? todos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : todos

  if (filtrados.length === 0) {
    return (
      <div className="col-span-full text-center py-20 space-y-4">
        <div className="text-5xl">🧶</div>
        <p className="text-xl font-light text-texto-escuro" style={{ fontFamily: 'Cormorant Garamond' }}>
          Nenhum produto encontrado
        </p>
        <p className="text-texto-medio text-sm">Tente outro filtro ou busca</p>
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
  const { categoria, abas, busca } = await searchParams
  const categorias = await getCategorias().catch(() => [])

  const CATS_FALLBACK = [
    { id: '1', slug: 'bonecos', nome: 'Bonecos', ativo: true, ordem: 0 },
    { id: '2', slug: 'bolsas', nome: 'Bolsas', ativo: true, ordem: 1 },
    { id: '3', slug: 'roupas', nome: 'Roupas', ativo: true, ordem: 2 },
  ]

  const categoriasFiltered = categorias && categorias.length > 0 ? categorias : CATS_FALLBACK

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
        {/* Filtros */}
        <div className="flex flex-col gap-6 mb-12">
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

          {/* Search */}
          <form className="flex-1">
            <input
              name="busca"
              defaultValue={busca}
              placeholder="Buscar produto..."
              className="w-full px-4 py-3 bg-white border border-creme-300 rounded-lg text-sm focus:outline-none focus:border-rosa-400 focus:ring-2 focus:ring-rosa-100 text-texto-escuro"
            />
          </form>
        </div>

        {/* Produtos com Abas Client-Side */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-creme-200 animate-pulse" />
            ))}
          </div>
        }>
          <ProdutosClient categoria={categoria} abaInicial={abas || 'todos'} />
        </Suspense>
      </div>
    </div>
  )
}
