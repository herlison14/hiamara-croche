import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchProdutoosAction } from '@/lib/produtos-actions'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'

export async function VitrineDestaque() {
  let produtos = await fetchProdutoosAction({ destaque: true, limite: 8 })
  // Fallback: se não houver destaques marcados, mostra os 8 mais recentes
  if (produtos.length === 0) {
    produtos = await fetchProdutoosAction({ limite: 8 })
  }
  if (produtos.length === 0) return null

  return (
    <section id="vitrine" className="bg-creme-50 py-20 md:py-28">
      <div className="container-wide">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Selecionados</p>
            <h2 className="display-lg">
              Peças em <span className="italic text-rosa-500">destaque</span>.
            </h2>
            <p className="mt-4 text-texto-medio font-light text-base md:text-lg">
              Uma seleção curada do que mais sai — feita à mão, em lotes
              pequenos. Quando acaba, refazemos com calma.
            </p>
          </div>
          <Link
            href="/produtos"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-texto-escuro hover:text-rosa-500 transition-colors font-medium self-start md:self-end"
          >
            Ver toda a coleção
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
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
