import { Suspense } from 'react'
import { ProdutosUnificado } from '@/components/ProdutosUnificado'
import { getCategorias } from '@/lib/supabase'

export const metadata = { title: 'Catálogo — HIAMARA CROCHÊ' }

interface Props {
  searchParams: Promise<{ categoria?: string; busca?: string }>
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, busca } = await searchParams
  const categorias = await getCategorias().catch(() => [])

  // Nomenclaturas modernas em fallback
  const CATS_FALLBACK = [
    { id: '1', slug: 'vestuario', nome: 'Vestuário Premium', ativo: true },
    { id: '2', slug: 'amigurumi', nome: 'Amigurumi & Colecionáveis', ativo: true },
    { id: '3', slug: 'decoracao', nome: 'Home & Decor', ativo: true },
    { id: '4', slug: 'acessorios', nome: 'Acessórios', ativo: true },
  ]

  const categoriasFiltered = categorias && categorias.length > 0 ? categorias : CATS_FALLBACK

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER UNIFICADO */}
      <div className="pt-32 pb-16 px-6 text-center bg-white">
        <h1 className="text-6xl md:text-8xl font-light text-black tracking-tighter mb-6">
          Catálogo Completo
        </h1>
        <p className="text-gray-600 text-lg font-light max-w-3xl mx-auto leading-relaxed">
          Explore nossa coleção unificada de peças artesanais em crochê.
          Cada produto é confeccionado com dedicação e carinho para você.
        </p>
      </div>

      {/* BARRA DE NAVEGAÇÃO STICKY SIMPLES */}
      <div className="sticky top-[72px] z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8 overflow-x-auto">
            <div className="flex gap-12 overflow-x-auto no-scrollbar">
              <a
                href="/produtos"
                className="flex-shrink-0 text-sm font-semibold uppercase tracking-widest text-black hover:text-gray-600 transition-colors pb-2 border-b-2 border-black"
              >
                Todos os Produtos
              </a>
              {categoriasFiltered.map((cat) => (
                <a
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="flex-shrink-0 text-sm font-medium uppercase tracking-widest text-gray-500 hover:text-black transition-colors pb-2 border-b-2 border-transparent hover:border-gray-300"
                >
                  {cat.nome}
                </a>
              ))}
            </div>

            {/* BARRA DE BUSCA */}
            <form className="hidden lg:block relative min-w-[280px]">
              <input
                name="busca"
                defaultValue={busca}
                placeholder="Pesquisar..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-gray-300 text-black placeholder-gray-400"
              />
            </form>
          </div>
        </div>
      </div>

      {/* BARRA DE BUSCA MOBILE */}
      <div className="lg:hidden px-6 py-4 bg-white border-b border-gray-200">
        <form>
          <input
            name="busca"
            defaultValue={busca}
            placeholder="Pesquisar produtos..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-gray-300 text-black"
          />
        </form>
      </div>

      {/* GRID DE PRODUTOS UNIFICADO */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        }>
          <ProdutosUnificado categoria={categoria} />
        </Suspense>
      </div>
    </div>
  )
}
