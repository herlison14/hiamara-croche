import { Suspense } from 'react'
import { ProductCard } from '@/components/store/ProductCard'
import { getCategorias, getProdutos } from '@/lib/supabase'

export const metadata = { title: 'Produtos — HIAMARA CROCHÊ' }

const ICONES: Record<string, string> = {
  'roupas': '👗', 'peluccias': '🧸', 'tapetes': '🪡', 'cortinas': '🪟',
  'bolsas-tiaras': '👜', 'bebe-infantil': '🍼', 'decoracao-casa': '🏡',
  'kits-presentes': '🎁', 'acessorios': '💍', 'novidades': '✨',
}

const CATS_FALLBACK = [
  { id: '1', slug: 'roupas',         nome: 'Roupas' },
  { id: '2', slug: 'peluccias',      nome: 'Pelúcias' },
  { id: '3', slug: 'tapetes',        nome: 'Tapetes' },
  { id: '4', slug: 'cortinas',       nome: 'Cortinas' },
  { id: '5', slug: 'bolsas-tiaras',  nome: 'Bolsas & Tiaras' },
  { id: '6', slug: 'bebe-infantil',  nome: 'Bebê & Infantil' },
  { id: '7', slug: 'decoracao-casa', nome: 'Decoração Casa' },
  { id: '8', slug: 'kits-presentes', nome: 'Kits Presentes' },
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
  const categorias = await getCategorias().catch(() => [])

  const ordens = [
    { value: '', label: 'Mais Recentes' },
    { value: 'preco_asc', label: 'Menor Preço' },
    { value: 'preco_desc', label: 'Maior Preço' },
    { value: 'mais_vendido', label: 'Mais Vendidos' },
  ]

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <div className="bg-[#F5EFE6] py-12 px-6 text-center">
        <h1 className="text-5xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
          {categoria ? categorias.find((c) => c.slug === categoria)?.nome ?? 'Produtos' : 'Todos os Produtos'}
        </h1>
        <p className="text-[#8A7B7B] mt-2">Peças artesanais feitas à mão</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form className="flex-1">
            <input
              name="busca"
              defaultValue={busca}
              placeholder="Buscar produto..."
              className="w-full px-4 py-2.5 bg-white border border-[#EDE0CD] rounded-lg text-sm focus:outline-none focus:border-[#C97A84] text-[#5C4A4A]"
            />
          </form>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <a
              href="/produtos"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${!categoria ? 'bg-[#C97A84] text-white' : 'border border-[#EDE0CD] text-[#8A7B7B] hover:border-[#C97A84] hover:text-[#C97A84]'}`}
            >
              Todas
            </a>
            {categorias.map((cat) => (
              <a
                key={cat.id}
                href={`/produtos?categoria=${cat.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${categoria === cat.slug ? 'bg-[#C97A84] text-white' : 'border border-[#EDE0CD] text-[#8A7B7B] hover:border-[#C97A84] hover:text-[#C97A84]'}`}
              >
                {cat.nome}
              </a>
            ))}
          </div>

          <select
            name="ordem"
            defaultValue={ordem}
            className="px-4 py-2.5 bg-white border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]"
          >
            {ordens.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <Suspense fallback={
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-[#F5EFE6] animate-pulse" />
            ))
          }>
            <ProdutoGrid categoria={categoria} ordem={ordem} busca={busca} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
