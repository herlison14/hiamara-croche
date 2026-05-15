import { Suspense } from 'react'
import Link from 'next/link'
import { TabsFiltro } from '@/components/TabsFiltro'
import { fetchProdutoosAction } from '@/lib/produtos-actions'

export const metadata = {
  title: 'Catálogo Completo — Hiamara Crochê',
  description:
    'Explore todas as peças artesanais em crochê da Hiamara. Blusas, bolsas, amigurumis e mais — feitas à mão, sob medida.',
}

interface Props {
  searchParams: Promise<{ categoria?: string; busca?: string }>
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria, busca } = await searchParams
  const produtos = await fetchProdutoosAction({})
  const categorias = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))].sort()

  return (
    <div className="min-h-screen bg-creme-50">
      {/* Header editorial */}
      <section className="relative overflow-hidden bg-creme-50 pt-16 md:pt-24 pb-10 md:pb-14 border-b border-creme-200">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-rosa-100/40 blur-3xl pointer-events-none" />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Catálogo</p>
            <h1 className="display-xl">
              Todas as nossas{' '}
              <span className="italic text-rosa-500">peças</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-texto-medio font-light leading-relaxed max-w-2xl">
              Da blusa rendada ao amigurumi colecionável. Filtre por
              categoria, navegue pelas abas ou pesquise o que estiver buscando.
            </p>
          </div>
        </div>
      </section>

      {/* Barra de navegação por categoria (sticky) */}
      <div className="sticky top-16 md:top-20 z-40 bg-creme-50/95 backdrop-blur-xl border-b border-creme-200">
        <div className="container-wide py-3.5">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <Link
              href="/produtos"
              className={`whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] py-1 px-1 transition-colors ${
                !categoria
                  ? 'text-rosa-500 font-semibold border-b-2 border-rosa-400'
                  : 'text-texto-claro hover:text-texto-escuro border-b-2 border-transparent'
              }`}
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={`/produtos?categoria=${cat}`}
                className={`whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] py-1 px-1 transition-colors ${
                  categoria === cat
                    ? 'text-rosa-500 font-semibold border-b-2 border-rosa-400'
                    : 'text-texto-claro hover:text-texto-escuro border-b-2 border-transparent'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros + grid */}
      <div className="container-wide py-12 md:py-16">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-creme-100 rounded-2xl shimmer" />
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
