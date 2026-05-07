import Link from 'next/link'
import { CinematicProductCard } from './cinematicProductCard'
import { StaggerContainer, StaggerItem } from './cinematicTransition'
import { fetchProdutoosAction } from '@/lib/produtos-actions'

export async function ProdutosColecao() {
  const produtos = await fetchProdutoosAction({ destaque: true, limite: 4 })

  if (produtos.length === 0) return null

  return (
    <StaggerContainer staggerDelay={0.15}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtos.map((produto, index) => (
          <StaggerItem key={produto.id}>
            <CinematicProductCard
              slug={produto.slug}
              name={produto.nome}
              image={produto.fotos?.[0]?.url ?? ''}
              price={produto.preco}
              category={produto.categoria}
              index={index}
            />
          </StaggerItem>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/produtos"
          className="inline-block bg-rosa-400 hover:bg-rosa-500 text-white px-10 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors"
        >
          Ver Toda a Coleção →
        </Link>
      </div>
    </StaggerContainer>
  )
}
