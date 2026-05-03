import { Suspense } from 'react'
import { ProdutosClient } from '@/components/ProdutosClient'
import { getCategorias } from '@/lib/supabase'

export const metadata = { title: 'Catálogo — HIAMARA CROCHÊ' }

interface Props {
  searchParams: Promise<{ categoria?: string; abas?: string; busca?: string }>
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, abas, busca } = await searchParams
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
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* HEADER MINIMALISTA */}
      <div className="pt-32 pb-16 px-6 text-center bg-white">
        <h1 className="text-5xl md:text-7xl font-light text-black tracking-tighter">
          {categoria ? categoriasFiltered.find(c => c.slug === categoria)?.nome || 'Catálogo' : 'Catálogo Completo'}
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-light max-w-2xl mx-auto">
          Explore texturas e formatos elaborados meticulosamente para entregar excelência em cada trama.
        </p>
      </div>

      {/* ABAS INTEGRADAS (STICKY + GLASSMORPHISM) */}
      <div className="sticky top-[72px] z-40 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-8 overflow-x-auto no-scrollbar py-4">
            <div className="flex gap-8">
              <a
                href="/produtos"
                className={`flex-shrink-0 text-sm font-medium uppercase tracking-widest transition-all ${
                  !categoria
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-400 hover:text-black pb-1 border-b-2 border-transparent'
                }`}
              >
                Todas as Peças
              </a>
              {categoriasFiltered.map((cat) => (
                <a
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className={`flex-shrink-0 text-sm font-medium uppercase tracking-widest transition-all ${
                    categoria === cat.slug
                      ? 'text-black border-b-2 border-black pb-1'
                      : 'text-gray-400 hover:text-black pb-1 border-b-2 border-transparent'
                  }`}
                >
                  {cat.nome}
                </a>
              ))}
            </div>

            {/* BARRA DE BUSCA INTEGRADA NAS ABAS */}
            <form className="hidden lg:block relative min-w-[250px]">
              <input
                name="busca"
                defaultValue={busca}
                placeholder="Pesquisar estilo..."
                className="w-full px-0 py-2 bg-transparent border-b border-gray-300 text-sm focus:outline-none focus:border-black text-black placeholder-gray-400 transition-colors"
              />
            </form>
          </div>
        </div>
      </div>

      {/* BUSCA MOBILE */}
      <div className="lg:hidden px-6 py-4 bg-white border-b border-gray-200">
        <form>
          <input
            name="busca"
            defaultValue={busca}
            placeholder="Pesquisar estilo..."
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
          />
        </form>
      </div>

      {/* GRID DE PRODUTOS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse" />
            ))}
          </div>
        }>
          <ProdutosClient categoria={categoria} abaInicial={abas || 'todos'} />
        </Suspense>
      </div>
    </div>
  )
}
