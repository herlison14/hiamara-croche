import { fetchProdutoosAction } from '@/lib/produtos-actions'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'

interface ProdutosRelacionadosProps {
  categoria: string
  excludeSlug: string
}

export async function ProdutosRelacionados({
  categoria,
  excludeSlug,
}: ProdutosRelacionadosProps) {
  let produtos = await fetchProdutoosAction({ categoria })
  produtos = produtos.filter((p) => p.slug !== excludeSlug).slice(0, 4)

  if (produtos.length === 0) return null

  return (
    <section className="bg-creme-100 py-20 md:py-28 border-t border-creme-200">
      <div className="container-wide">
        <header className="mb-10">
          <p className="eyebrow mb-3">Você também pode gostar</p>
          <h2 className="display-md">
            Mais peças em{' '}
            <span className="italic text-rosa-500">{categoria}</span>.
          </h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {produtos.map((produto) => (
            <ProductCardFirebase key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </section>
  )
}
