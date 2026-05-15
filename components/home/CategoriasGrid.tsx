'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIAS_VITRINE } from '@/lib/showcaseImages'

const easing = [0.16, 1, 0.3, 1] as const

export function CategoriasGrid() {
  return (
    <section id="categorias" className="bg-creme-50 py-20 md:py-28">
      <div className="container-wide">
        <header className="max-w-2xl mb-14 md:mb-20">
          <p className="eyebrow mb-4">Coleções</p>
          <h2 className="display-lg">
            Explore por <span className="italic text-rosa-500">categoria</span>.
          </h2>
          <p className="mt-5 text-base md:text-lg text-texto-medio font-light leading-relaxed">
            Da blusa rendada ao amigurumi colecionável — cada categoria foi
            pensada para um momento da sua casa, do seu look ou do seu presente.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 auto-rows-[12rem] md:auto-rows-[15rem]">
          {CATEGORIAS_VITRINE.map((cat, i) => {
            const span = cat.destaque
              ? 'md:col-span-3 md:row-span-2'
              : i === 1
                ? 'md:col-span-3 md:row-span-1'
                : i === 4
                  ? 'md:col-span-4 md:row-span-1'
                  : 'md:col-span-2 md:row-span-1'

            return (
              <motion.div
                key={cat.id}
                className={`${span} relative`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: easing }}
              >
                <Link
                  href={cat.href}
                  className="group block relative w-full h-full overflow-hidden rounded-3xl bg-creme-100 shadow-sm hover:shadow-lg transition-shadow duration-500"
                >
                  <Image
                    src={cat.imagem}
                    alt={cat.imagemAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
                  />

                  {/* Gradiente legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-texto-escuro/65 via-texto-escuro/10 to-transparent" />

                  {/* Hover sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rosa-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Conteúdo */}
                  <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-white">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-rosa-100 mb-2">
                      Categoria
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
                      {cat.nome}
                    </h3>
                    <p className="hidden md:block mt-2 text-sm text-creme-100/85 font-light max-w-xs">
                      {cat.descricao}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-creme-50">
                      Ver peças
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
