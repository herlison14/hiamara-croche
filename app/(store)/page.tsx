import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { FlowerBackground } from '@/components/layout/FlowerBackground'
import { ProductCard } from '@/components/store/ProductCard'
import { getProdutos, getCategorias } from '@/lib/supabase'

const ICONES_CATEGORIAS: Record<string, string> = {
  'roupas':         '👗',
  'peluccias':      '🧸',
  'tapetes':        '🪡',
  'cortinas':       '🪟',
  'bolsas-tiaras':  '👜',
  'bebe-infantil':  '🍼',
  'decoracao-casa': '🏡',
  'kits-presentes': '🎁',
  'acessorios':     '💍',
  'novidades':      '✨',
}

const CATEGORIAS_FALLBACK = [
  { id: '1', slug: 'roupas',         nome: 'Roupas',          descricao: 'Vestidos, blusas e conjuntos' },
  { id: '2', slug: 'peluccias',      nome: 'Pelúcias',        descricao: 'Amigurumi e bichinhos de crochê' },
  { id: '3', slug: 'tapetes',        nome: 'Tapetes',         descricao: 'Para sala, quarto e cozinha' },
  { id: '4', slug: 'cortinas',       nome: 'Cortinas',        descricao: 'Painéis decorativos em crochê' },
  { id: '5', slug: 'bolsas-tiaras',  nome: 'Bolsas & Tiaras', descricao: 'Acessórios fashion artesanais' },
  { id: '6', slug: 'bebe-infantil',  nome: 'Bebê & Infantil', descricao: 'Enxoval e presentes para bebê' },
  { id: '7', slug: 'decoracao-casa', nome: 'Decoração Casa',  descricao: 'Almofadas, vasos e luminárias' },
  { id: '8', slug: 'kits-presentes', nome: 'Kits Presentes',  descricao: 'Presenteie com amor e estilo' },
]

export const metadata = {
  title: 'HIAMARA CROCHÊ — Peças artesanais feitas com amor',
  description: 'Roupas e bonecos de crochê artesanais únicos, feitos à mão com fios de qualidade. Peças exclusivas, sob encomenda.',
}

export default async function HomePage() {
  const [destaques, maisVendidos, categorias] = await Promise.all([
    getProdutos({ destaque: true, limite: 6 }).catch(() => []),
    getProdutos({ mais_vendido: true, limite: 6 }).catch(() => []),
    getCategorias().catch(() => []),
  ])

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FDFAF5]">
        <FlowerBackground image="/flowers/roses-bg.webp" opacity={0.13} />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F4C5CB] text-[#A85A65] text-xs font-medium uppercase tracking-widest rounded-full">
            <Sparkles size={12} /> Artesanal
          </span>
          <h1
            className="text-5xl sm:text-7xl font-light text-[#3D2B2B] leading-none tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond' }}
          >
            HIAMARA
            <br />
            <em className="font-normal">CROCHÊ</em>
          </h1>
          <p className="text-lg text-[#5C4A4A] leading-relaxed max-w-xl mx-auto">
            Peças únicas feitas à mão com amor e dedicação. Cada fio carregado de cuidado, cada peça uma obra de arte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300 shadow-[0_4px_16px_rgba(168,90,101,0.25)] hover:shadow-[0_6px_24px_rgba(168,90,101,0.35)]"
            >
              Ver Coleção <ArrowRight size={16} />
            </Link>
            <Link
              href="#historia"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#C97A84] text-[#C97A84] hover:bg-[#F4C5CB] text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
            >
              Nossa História
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-0.5 h-8 bg-[#EDE0CD] mx-auto rounded-full" />
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 px-6 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
              Explore por Categoria
            </h2>
            <p className="text-[#8A7B7B] mt-2 text-sm">Cada setor, uma arte diferente feita à mão</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(categorias.length > 0 ? categorias : CATEGORIAS_FALLBACK).map((cat) => {
              const icon = ICONES_CATEGORIAS[cat.slug] ?? '✨'
              return (
                <Link
                  key={cat.id ?? cat.slug}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="group flex flex-col items-center justify-center p-6 bg-[#FDFAF5] border border-[#EDE0CD] rounded-2xl text-center hover:border-[#C97A84] hover:shadow-[0_8px_32px_rgba(61,43,43,0.10)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F4C5CB] flex items-center justify-center mb-3 group-hover:bg-[#C97A84] transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl leading-none">{icon}</span>
                  </div>
                  <h3 className="font-medium text-[#3D2B2B] text-sm leading-tight">{cat.nome}</h3>
                  {cat.descricao && (
                    <p className="text-[10px] text-[#8A7B7B] mt-1.5 line-clamp-2 leading-snug">{cat.descricao}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      {destaques.length > 0 && (
        <section className="py-20 px-6 bg-[#FDFAF5]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
                Peças em Destaque
              </h2>
              <p className="text-[#8A7B7B] mt-2">Selecionadas com carinho para você</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {destaques.map((p) => <ProductCard key={p.id} produto={p} />)}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#C97A84] text-[#C97A84] hover:bg-[#C97A84] hover:text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
              >
                Ver Todos os Produtos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* MAIS VENDIDOS */}
      {maisVendidos.length > 0 && (
        <section className="py-20 px-6 bg-[#F5EFE6] overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-light text-[#3D2B2B] mb-12" style={{ fontFamily: 'Cormorant Garamond' }}>
              Mais Amados
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 scroll-smooth snap-x">
              {maisVendidos.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-64 snap-start">
                  <ProductCard produto={p} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOBRE / HISTÓRIA */}
      <section id="historia" className="relative py-24 px-6 bg-[#FDFAF5] overflow-hidden">
        <FlowerBackground image="/flowers/peony-bg.webp" opacity={0.08} />
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-medium uppercase tracking-widest text-[#C97A84]">Nossa História</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3D2B2B] leading-tight" style={{ fontFamily: 'Cormorant Garamond' }}>
              Cada peça tem<br /><em>uma história</em>
            </h2>
            <p className="text-[#5C4A4A] leading-relaxed">
              A HIAMARA CROCHÊ nasceu do amor ao artesanato e da vontade de criar peças únicas que atravessam gerações. Cada agulhada é um gesto de carinho, cada fio escolhido com atenção e cada peça entregue com orgulho.
            </p>
            <p className="text-[#5C4A4A] leading-relaxed">
              Trabalhamos com materiais de alta qualidade — fios de algodão, acrílico premium e linhas especiais — para garantir beleza e durabilidade em cada criação.
            </p>
            <div className="flex gap-8 pt-2">
              {[['100%', 'Artesanal'], ['7 dias', 'Prazo Médio'], ['♥', 'Com Amor']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-light text-[#C97A84]" style={{ fontFamily: 'Cormorant Garamond' }}>{n}</p>
                  <p className="text-xs text-[#8A7B7B] uppercase tracking-wider mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#F5EFE6] to-[#F4C5CB] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl opacity-20">🧶</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl bg-[#C97A84] flex items-center justify-center shadow-lg">
              <span className="text-white text-center text-xs font-medium leading-tight px-2">Feito<br />à Mão</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
