import Link from 'next/link'
import { fetchProdutoosAction } from '@/lib/produtos-actions'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const produtos = await fetchProdutoosAction({})
  const produto = produtos.find(p => p.slug === slug)

  if (!produto) {
    return { title: 'Produto não encontrado' }
  }

  return {
    title: `${produto.nome} — HIAMARA CROCHÊ`,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params
  const produtos = await fetchProdutoosAction({})
  const produto = produtos.find(p => p.slug === slug)

  if (!produto) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-creme-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-texto-medio">
          <Link href="/" className="hover:text-rosa-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-rosa-400 transition-colors">Produtos</Link>
          <span>/</span>
          <span className="text-texto-escuro font-medium">{produto.nome}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            {produto.fotos?.[0] && (
              <div className="aspect-square rounded-2xl overflow-hidden bg-creme-100">
                <img
                  src={produto.fotos[0].url}
                  alt={produto.fotos[0].alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-rosa-100 text-rosa-600 text-xs font-bold uppercase tracking-widest rounded-full">
                {produto.categoria}
              </span>
            </div>

            <div>
              <h1
                className="text-4xl md:text-5xl font-light text-texto-escuro leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {produto.nome}
              </h1>
            </div>

            <div className="border-t border-b border-creme-200 py-6">
              <p
                className="text-4xl font-light text-rosa-500"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-texto-escuro">Descrição</h3>
              <p className="text-texto-medio leading-relaxed">
                {produto.descricao}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full py-4 bg-gradient-to-r from-rosa-400 to-rosa-500 hover:from-rosa-500 hover:to-rosa-600 text-white font-semibold uppercase tracking-widest rounded-lg transition-all duration-300">
                Adicionar ao Carrinho
              </button>
              <Link
                href="/produtos"
                className="block w-full py-4 border-2 border-rosa-400 text-rosa-400 hover:bg-rosa-50 font-semibold uppercase tracking-widest rounded-lg transition-all duration-300 text-center"
              >
                Ver Mais Produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
