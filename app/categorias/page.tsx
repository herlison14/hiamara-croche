import { Metadata } from 'next'
import { CategoriaCarrossel } from '@/components/CategoriaCarrossel'
import { categoriasData } from '@/lib/produtos-data'

export const metadata: Metadata = {
  title: 'Categorias — HIAMARA CROCHÊ',
  description: 'Explore nossas categorias de produtos em crochê'
}

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-rose-50 to-white pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-black tracking-tight mb-6">
            Nossas Categorias
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Explore nossa coleção completa de peças em crochê. Cada categoria contém produtos artesanais únicos, confeccionados com dedicação e carinho.
          </p>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriasData.map((categoria) => (
            <CategoriaCarrossel
              key={categoria.id}
              categoria={categoria}
            />
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-rose-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light text-black mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-gray-600 mb-8">
            Oferecemos produtos personalizados. Entre em contato conosco para consultar sobre criações customizadas.
          </p>
          <button className="rounded-lg bg-rose-500 px-8 py-3 font-bold text-white transition-colors hover:bg-rose-600">
            Fale Conosco
          </button>
        </div>
      </div>
    </div>
  )
}
