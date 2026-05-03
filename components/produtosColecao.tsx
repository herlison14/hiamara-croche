import Link from 'next/link'
import { CinematicProductCard } from './cinematicProductCard'
import { StaggerContainer, StaggerItem } from './cinematicTransition'
import { categoriasData } from '@/lib/produtos-data'

// Pega o primeiro produto de cada categoria para vitrine da home
const produtosDestaque = categoriasData
  .filter((cat) => cat.produtos.length > 0)
  .slice(0, 4)
  .map((cat) => cat.produtos[0])

export function ProdutosColecao() {
  return (
    <StaggerContainer staggerDelay={0.15}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtosDestaque.map((produto, index) => (
          <StaggerItem key={produto.id}>
            <CinematicProductCard
              id={produto.id}
              name={produto.nome}
              image={`/produtos/${produto.imagem}`}
              price={produto.preco}
              category={produto.categoria}
              index={index}
            />
          </StaggerItem>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/categorias"
          className="inline-block bg-rosa-400 hover:bg-rosa-500 text-white px-10 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors"
        >
          Ver Toda a Coleção →
        </Link>
      </div>
    </StaggerContainer>
  )
}
