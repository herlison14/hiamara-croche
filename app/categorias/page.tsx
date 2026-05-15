import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { fetchProdutoosAction } from '@/lib/produtos-actions'
import { CATEGORIAS_VITRINE } from '@/lib/showcaseImages'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Categorias — Hiamara Crochê',
  description:
    'Explore as categorias de produtos artesanais em crochê: blusas, bolsas, amigurumis, decoração e mais.',
}

export default async function CategoriasPage() {
  const produtos = await fetchProdutoosAction({})

  // Conta produtos por categoria normalizada (case-insensitive)
  const countMap = new Map<string, number>()
  for (const p of produtos) {
    if (!p.ativo || !p.categoria) continue
    const key = p.categoria.toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  return (
    <main className="min-h-screen bg-creme-50">
      {/* Header editorial */}
      <section className="relative overflow-hidden bg-creme-50 pt-16 md:pt-24 pb-12 md:pb-16 border-b border-creme-200">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-rosa-100/40 blur-3xl pointer-events-none" />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Explore</p>
            <h1 className="display-xl">
              Coleções por{' '}
              <span className="italic text-rosa-500">categoria</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-texto-medio font-light leading-relaxed max-w-2xl">
              Da blusa rendada à bolsa estruturada, do amigurumi colecionável
              à decoração afetiva. Tudo o que sai das nossas mãos, organizado
              do seu jeito.
            </p>
          </div>
        </div>
      </section>

      {/* Grid editorial */}
      <section className="bg-creme-50 py-16 md:py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6 auto-rows-[16rem] md:auto-rows-[22rem]">
            {CATEGORIAS_VITRINE.map((cat, i) => {
              // Tentativa de match com a contagem (slug case-insensitive)
              const count =
                countMap.get(cat.nome.toLowerCase()) ??
                countMap.get(cat.id.toLowerCase()) ??
                0
              const span = cat.destaque
                ? 'md:col-span-3 md:row-span-2'
                : i === 1
                  ? 'md:col-span-3'
                  : i === 4
                    ? 'md:col-span-4'
                    : 'md:col-span-2'

              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={`${span} group relative overflow-hidden rounded-3xl bg-creme-100 shadow-sm hover:shadow-xl transition-shadow duration-700 ease-out-expo`}
                >
                  <Image
                    src={cat.imagem}
                    alt={cat.imagemAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-texto-escuro/70 via-texto-escuro/15 to-transparent" />

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white">
                    <div className="self-end px-3 py-1 rounded-full bg-creme-50/95 text-rosa-500 text-[0.6rem] font-semibold uppercase tracking-[0.2em]">
                      {count > 0 ? `${count} ${count === 1 ? 'peça' : 'peças'}` : 'Em breve'}
                    </div>

                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-rosa-100 mb-2">
                        Categoria
                      </p>
                      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                        {cat.nome}
                      </h2>
                      <p className="hidden md:block mt-2 text-sm text-creme-100/90 font-light max-w-md">
                        {cat.descricao}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-creme-50">
                        Explorar
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final personalizado */}
      <section className="bg-creme-100 border-t border-creme-200 py-20 md:py-24">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-4">Encomenda sob medida</p>
            <h2 className="display-md">
              Não encontrou o que procura?
            </h2>
            <p className="mt-5 text-texto-medio font-light leading-relaxed">
              Fazemos peças personalizadas — cores, tamanhos, motivos.
              Conte sua ideia e a gente desenha junto.
            </p>
            <a
              href="https://wa.me/5521997927927"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 btn-primary group"
            >
              <MessageCircle size={16} strokeWidth={1.75} />
              Falar com a artesã
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
