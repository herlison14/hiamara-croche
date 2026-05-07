import { Metadata } from 'next'
import { CategoriaCarrossel } from '@/components/CategoriaCarrossel'
import { fetchProdutoosAction } from '@/lib/produtos-actions'
import type { CategoriaData, ProdutoData } from '@/lib/produtos-data'

export const metadata: Metadata = {
  title: 'Categorias — HIAMARA CROCHÊ',
  description: 'Explore nossas categorias de produtos em crochê'
}

export default async function CategoriasPage() {
  const produtos = await fetchProdutoosAction({})

  const categoriaMap = new Map<string, ProdutoData[]>()
  for (const p of produtos) {
    if (!p.ativo) continue
    const cat = p.categoria
    if (!categoriaMap.has(cat)) categoriaMap.set(cat, [])
    categoriaMap.get(cat)!.push({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      categoria: p.categoria,
      preco: p.preco,
      imagem: p.fotos?.[0]?.url ?? '',
    })
  }

  const categorias: CategoriaData[] = [...categoriaMap.entries()].map(([nome, prods]) => ({
    id: nome.toLowerCase(),
    nome: nome.toLowerCase(),
    nomeExibicao: nome,
    descricao: `Produtos da categoria ${nome}`,
    produtos: prods,
  }))

  return (
    <div className="min-h-screen bg-creme-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-rosa-100/40 to-creme-50 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-rosa-400 mb-4">
            Explorar
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-texto-escuro tracking-tight mb-6">
            Nossas Categorias
          </h1>
          <p className="text-lg text-texto-medio max-w-2xl leading-relaxed font-light">
            Explore nossa coleção completa de peças em crochê. Cada categoria contém
            produtos artesanais únicos, confeccionados com dedicação e carinho.
          </p>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {categorias.length === 0 ? (
          <p className="text-center text-texto-medio py-20">Carregando categorias...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((categoria) => (
              <CategoriaCarrossel
                key={categoria.id}
                categoria={categoria}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Final */}
      <div className="bg-creme-100 border-t border-creme-200 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-light text-texto-escuro mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-texto-medio mb-8 font-light">
            Oferecemos produtos personalizados. Entre em contato para consultar
            sobre criações customizadas.
          </p>
          <a
            href="https://wa.me/5521997927927"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-rosa-400 hover:bg-rosa-500 px-8 py-3 font-medium text-white uppercase tracking-widest text-sm transition-colors"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </div>
  )
}
