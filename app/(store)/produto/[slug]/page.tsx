import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Sparkles,
  Heart,
  Truck,
  Package,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { fetchProdutoosAction, type Produto as FirebaseProduto } from '@/lib/produtos-actions'
import { AddToCartButton } from '@/components/store/AddToCartButton'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProdutosRelacionados } from '@/components/store/ProdutosRelacionados'
import type { Produto } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

function toStoreProduto(p: FirebaseProduto): Produto {
  return {
    id: p.id,
    nome: p.nome,
    slug: p.slug,
    descricao: p.descricao || null,
    preco: p.preco,
    preco_promocional: null,
    categoria_id: null,
    imagens: p.fotos?.map((f) => f.url) ?? [],
    imagem_principal: p.fotos?.[0]?.url ?? null,
    estoque: 1,
    ativo: p.ativo,
    destaque: p.destaque ?? false,
    mais_vendido: p.mais_vendido ?? false,
    variantes: [],
    tags: [],
    peso_gramas: null,
    tempo_producao_dias: 7,
    criado_em: p.criado_em ?? new Date().toISOString(),
    atualizado_em: p.criado_em ?? new Date().toISOString(),
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const produtos = await fetchProdutoosAction({})
  const produto = produtos.find((p) => p.slug === slug)
  if (!produto) return { title: 'Produto não encontrado' }
  return {
    title: `${produto.nome} — Hiamara Crochê`,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params
  const produtos = await fetchProdutoosAction({})
  const produto = produtos.find((p) => p.slug === slug)
  if (!produto) notFound()

  const storeProduto = toStoreProduto(produto)
  const precoFormatado = produto.preco.toFixed(2).replace('.', ',')
  const parcelaSugerida = (produto.preco / 3).toFixed(2).replace('.', ',')

  return (
    <div className="min-h-screen bg-creme-50">
      {/* Breadcrumb */}
      <div className="container-wide pt-6 md:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-texto-claro flex-wrap"
        >
          <Link href="/" className="hover:text-rosa-500 transition-colors uppercase tracking-[0.18em]">
            Início
          </Link>
          <ChevronRight size={12} className="text-creme-300" />
          <Link href="/produtos" className="hover:text-rosa-500 transition-colors uppercase tracking-[0.18em]">
            Produtos
          </Link>
          <ChevronRight size={12} className="text-creme-300" />
          <Link
            href={`/produtos?categoria=${produto.categoria}`}
            className="hover:text-rosa-500 transition-colors uppercase tracking-[0.18em]"
          >
            {produto.categoria}
          </Link>
          <ChevronRight size={12} className="text-creme-300" />
          <span className="text-texto-medio truncate max-w-[200px]">{produto.nome}</span>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="container-wide py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Galeria */}
          <div className="lg:col-span-7">
            {produto.fotos && produto.fotos.length > 0 ? (
              <ProductGallery fotos={produto.fotos} />
            ) : (
              <div className="aspect-square rounded-3xl bg-creme-100 flex items-center justify-center">
                <span className="font-display text-8xl font-light text-rosa-200">
                  {produto.nome[0]}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-5">
              <Link
                href={`/produtos?categoria=${produto.categoria}`}
                className="inline-block px-3 py-1.5 bg-rosa-50 text-rosa-500 text-[0.65rem] font-semibold uppercase tracking-[0.2em] rounded-full hover:bg-rosa-100 transition-colors"
              >
                {produto.categoria}
              </Link>
              {produto.destaque && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-creme-100 text-texto-escuro text-[0.65rem] font-semibold uppercase tracking-[0.2em] rounded-full">
                  <Sparkles size={10} /> Destaque
                </span>
              )}
              {produto.novo && (
                <span className="inline-block px-3 py-1.5 bg-creme-100 text-texto-escuro text-[0.65rem] font-semibold uppercase tracking-[0.2em] rounded-full">
                  Novo
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-texto-escuro leading-[1.05] tracking-tight">
              {produto.nome}
            </h1>

            <div className="mt-8 pb-8 border-b border-creme-200">
              <p className="font-display text-4xl md:text-5xl text-rosa-500 font-light">
                R$ {precoFormatado}
              </p>
              <p className="text-xs text-texto-claro mt-2 uppercase tracking-[0.15em]">
                ou 3x de R$ {parcelaSugerida} sem juros
              </p>
            </div>

            {/* Descrição */}
            {produto.descricao && (
              <div className="mt-8 space-y-3">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-rosa-400 font-medium">
                  Sobre a peça
                </p>
                <p className="text-texto-medio leading-relaxed font-light">
                  {produto.descricao}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-10 space-y-3">
              <AddToCartButton produto={storeProduto} size="lg" className="w-full" />
              <a
                href={`https://wa.me/5521997927927?text=${encodeURIComponent(
                  `Olá! Tenho interesse na peça: ${produto.nome}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-4 border border-creme-200 hover:border-rosa-400 hover:text-rosa-500 text-texto-escuro font-medium uppercase tracking-[0.18em] text-xs rounded-md transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-10 grid grid-cols-2 gap-4 pt-8 border-t border-creme-200">
              {[
                { icon: Heart, titulo: 'Feito à mão', sub: 'Cada peça é única' },
                { icon: Truck, titulo: 'Envio Brasil', sub: 'Via Correios/Sedex' },
                { icon: Clock, titulo: 'Produção', sub: '7–14 dias úteis' },
                { icon: Package, titulo: 'Embalagem', sub: 'Pronta para presentear' },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.titulo} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rosa-50 text-rosa-500 flex items-center justify-center shrink-0">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-texto-escuro">{t.titulo}</p>
                      <p className="text-[0.7rem] text-texto-claro font-light leading-tight mt-0.5">
                        {t.sub}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 text-xs text-texto-medio hover:text-rosa-500 uppercase tracking-[0.18em] transition-colors group"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                Voltar para o catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
      <Suspense fallback={null}>
        <ProdutosRelacionados
          categoria={produto.categoria}
          excludeSlug={produto.slug}
        />
      </Suspense>
    </div>
  )
}
