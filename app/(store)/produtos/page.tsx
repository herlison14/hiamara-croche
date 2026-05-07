import { Suspense } from 'react'
import { TabsFiltro } from '@/components/TabsFiltro'
import { fetchProdutoosAction } from '@/lib/produtos-actions'

export const metadata = { title: 'Catálogo — HIAMARA CROCHÊ' }

interface Props {
  searchParams: Promise<{ categoria?: string; busca?: string }>
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, busca } = await searchParams
  const produtos = await fetchProdutoosAction({})
  const categorias = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))]
    .sort()
    .map((cat) => ({ id: cat, slug: cat.toLowerCase(), nome: cat }))

  return (
    <div className="min-h-screen bg-creme-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-rosa-100/30 to-creme-50 pt-32 pb-12 px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-rosa-400 mb-4">
          Coleção
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-light text-texto-escuro tracking-tight mb-4">
          Catálogo Completo
        </h1>
        <p className="text-texto-medio text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Peças artesanais em crochê, confeccionadas com dedicação e carinho para você.
        </p>
      </div>

      {/* Barra de navegação por categoria */}
      <div className="sticky top-[64px] z-40 w-full bg-creme-50/95 backdrop-blur-sm border-b border-creme-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              <a
                href="/produtos"
                className={[
                  'flex-shrink-0 text-xs font-medium uppercase tracking-widest pb-1 transition-colors',
                  !categoria
                    ? 'text-rosa-400 border-b-2 border-rosa-400'
                    : 'text-texto-claro hover:text-texto-escuro border-b-2 border-transparent',
                ].join(' ')}
              >
                Todos
              </a>
              {categorias.map((cat) => (
                <a
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className={[
                    'flex-shrink-0 text-xs font-medium uppercase tracking-widest pb-1 transition-colors',
                    categoria === cat.slug
                      ? 'text-rosa-400 border-b-2 border-rosa-400'
                      : 'text-texto-claro hover:text-texto-escuro border-b-2 border-transparent',
                  ].join(' ')}
                >
                  {cat.nome}
                </a>
              ))}
            </div>

            {/* Busca */}
            <form className="hidden lg:block relative min-w-[240px]">
              <input
                name="busca"
                defaultValue={busca}
                placeholder="Pesquisar..."
                className="w-full px-4 py-2 bg-creme-100 border border-creme-200 rounded-lg text-sm text-texto-medio placeholder-texto-claro focus:outline-none focus:border-rosa-300 focus:ring-1 focus:ring-rosa-200 transition-colors"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Busca mobile */}
      <div className="lg:hidden px-6 py-3 bg-creme-50 border-b border-creme-200">
        <form>
          <input
            name="busca"
            defaultValue={busca}
            placeholder="Pesquisar produtos..."
            className="w-full px-4 py-2.5 bg-creme-100 border border-creme-200 rounded-lg text-sm text-texto-medio placeholder-texto-claro focus:outline-none focus:border-rosa-300 focus:ring-1 focus:ring-rosa-200 transition-colors"
          />
        </form>
      </div>

      {/* Grid com abas */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-creme-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          <TabsFiltro categoria={categoria} busca={busca} />
        </Suspense>
      </div>
    </div>
  )
}
