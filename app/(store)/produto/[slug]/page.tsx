'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { ProductImageGallery } from '@/components/store/ProductImageGallery'
import { VariantSelector } from '@/components/store/VariantSelector'
import { AddToCartButton } from '@/components/store/AddToCartButton'
import { ProductCard } from '@/components/store/ProductCard'
import { supabase } from '@/lib/supabase'
import type { Produto } from '@/lib/types'

export default function ProdutoPage({ params }: { params: { slug: string } }) {
  const [produto, setProduto] = useState<Produto | null>(null)
  const [relacionados, setRelacionados] = useState<Produto[]>([])
  const [variantes, setVariantes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('produtos')
        .select('*, categoria:categorias(*), fotos:produto_fotos(*)')
        .eq('slug', params.slug)
        .eq('ativo', true)
        .single()

      if (!data) { setLoading(false); return }
      setProduto(data as Produto)

      const init: Record<string, string> = {}
      if (data.variantes) {
        for (const v of data.variantes) {
          if (v.opcoes?.length) init[v.nome] = v.opcoes[0]
        }
      }
      setVariantes(init)

      if (data.categoria_id) {
        const { data: rel } = await supabase
          .from('produtos')
          .select('*, categoria:categorias(*)')
          .eq('ativo', true)
          .eq('categoria_id', data.categoria_id)
          .neq('id', data.id)
          .limit(4)
        setRelacionados((rel ?? []) as Produto[])
      }
      setLoading(false)
    }
    load()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C97A84] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!produto) return notFound()

  const imagens = [
    ...(produto.imagem_principal ? [produto.imagem_principal] : []),
    ...(produto.imagens ?? []),
    ...(produto.fotos?.map((f) => f.url) ?? []),
  ]

  const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome} — ${typeof window !== 'undefined' ? window.location.href : ''}`)}`

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8A7B7B] mb-8">
          <Link href="/" className="hover:text-[#C97A84]">Home</Link>
          <ChevronRight size={12} />
          <Link href="/produtos" className="hover:text-[#C97A84]">Produtos</Link>
          {produto.categoria && (
            <>
              <ChevronRight size={12} />
              <Link href={`/produtos?categoria=${produto.categoria.slug}`} className="hover:text-[#C97A84]">
                {produto.categoria.nome}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-[#5C4A4A] truncate max-w-40">{produto.nome}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          <ProductImageGallery imagens={imagens} nome={produto.nome} />

          <div className="space-y-6">
            {produto.categoria && (
              <span className="text-xs font-medium uppercase tracking-widest text-[#C97A84]">
                {produto.categoria.nome}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-light text-[#3D2B2B] leading-tight" style={{ fontFamily: 'Cormorant Garamond' }}>
              {produto.nome}
            </h1>

            <div className="flex items-baseline gap-3">
              {produto.preco_promocional && produto.preco_promocional < produto.preco ? (
                <>
                  <span className="text-3xl font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                    R$ {produto.preco_promocional.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-lg text-[#8A7B7B] line-through">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-[#8A7B7B] border-t border-b border-[#EDE0CD] py-4">
              <span>⏱ Produção em {produto.tempo_producao_dias} dias úteis</span>
              <span className="text-[#EDE0CD]">|</span>
              <span>🧶 100% Artesanal</span>
            </div>

            <VariantSelector variantes={produto.variantes} selecionado={variantes} onChange={setVariantes} />

            <div className="space-y-3 pt-2">
              <AddToCartButton produto={produto} variante={variantes} size="lg" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
              >
                <MessageCircle size={18} /> Comprar pelo WhatsApp
              </a>
            </div>

            {produto.descricao && (
              <div className="border-t border-[#EDE0CD] pt-6">
                <h3 className="text-lg font-medium text-[#3D2B2B] mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Descrição
                </h3>
                <p className="text-[#5C4A4A] leading-relaxed whitespace-pre-line">{produto.descricao}</p>
              </div>
            )}

            <div className="bg-[#F5EFE6] rounded-xl p-4 space-y-2 text-sm text-[#5C4A4A]">
              <p>✦ Peça artesanal única — pode haver pequenas variações</p>
              <p>✦ Pagamento via PIX ou WhatsApp</p>
              <p>✦ Entrega para todo o Brasil</p>
              {produto.peso_gramas && <p>✦ Peso aproximado: {produto.peso_gramas}g</p>}
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-light text-[#3D2B2B] mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
              Você Também Pode Gostar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relacionados.map((p) => <ProductCard key={p.id} produto={p} variant="compact" />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
