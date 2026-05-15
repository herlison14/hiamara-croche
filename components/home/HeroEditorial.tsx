'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { HERO_COLLAGE } from '@/lib/showcaseImages'

const easing = [0.16, 1, 0.3, 1] as const

export function HeroEditorial() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const yLarge = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yMedium = useTransform(scrollYProgress, [0, 1], [0, -140])
  const ySmall = useTransform(scrollYProgress, [0, 1], [0, -180])
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0.2])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-creme-50 pt-24 pb-20 md:pt-32 md:pb-32"
    >
      {/* Texturas decorativas */}
      <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-rosa-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-terra-200/30 blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Coluna texto */}
          <motion.div
            className="lg:col-span-6 relative z-10"
            style={{ y: headingY, opacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: easing }}
          >
            <motion.div
              className="ornament mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="eyebrow whitespace-nowrap text-rosa-400">
                Coleção 2026 · Edição Artesanal
              </span>
            </motion.div>

            <h1 className="display-xl">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.15, ease: easing }}
              >
                Crochê que
              </motion.span>
              <motion.span
                className="block italic text-rosa-500 font-display"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: easing }}
              >
                acolhe.
              </motion.span>
            </h1>

            <motion.p
              className="mt-7 max-w-md text-base md:text-lg text-texto-medio leading-relaxed font-light"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: easing }}
            >
              Peças únicas, feitas à mão com fios selecionados e o ritmo
              de quem ama o ofício. Cada ponto carrega cuidado, cada
              criação carrega uma história — a sua começa aqui.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: easing }}
            >
              <Link href="/produtos" className="btn-primary group">
                Explorar coleção
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link href="/categorias" className="btn-ghost">
                Ver categorias
              </Link>
            </motion.div>

            {/* Mini stats — feito à mão, peças únicas, envio */}
            <motion.div
              className="mt-12 grid grid-cols-3 max-w-md gap-6 border-t border-creme-200 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.85 }}
            >
              {[
                { kpi: '100%', label: 'Feito à mão' },
                { kpi: 'Único', label: 'Cada peça' },
                { kpi: 'Brasil', label: 'Envio nacional' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl text-texto-escuro font-light">
                    {s.kpi}
                  </div>
                  <div className="text-[0.65rem] uppercase tracking-[0.18em] text-texto-claro mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Coluna colagem */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[5/6] md:aspect-[6/7]">
              {/* Imagem grande dominante */}
              <motion.div
                className="absolute top-0 right-0 w-[70%] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: 60, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.2, ease: easing }}
                style={{ y: yLarge }}
              >
                <Image
                  src={HERO_COLLAGE[0]}
                  alt="Blusa de crochê artesanal premium"
                  fill
                  priority
                  sizes="(max-width: 1024px) 70vw, 35vw"
                  className="object-cover ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-rosa-400/10 via-transparent to-creme-50/0" />
              </motion.div>

              {/* Imagem média esquerda */}
              <motion.div
                className="absolute bottom-0 left-0 w-[58%] aspect-square rounded-[1.75rem] overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 80, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.4, ease: easing }}
                style={{ y: yMedium }}
              >
                <Image
                  src={HERO_COLLAGE[1]}
                  alt="Amigurumi colecionável em crochê"
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Imagem pequena central */}
              <motion.div
                className="absolute top-[45%] left-[42%] w-[34%] aspect-[3/4] rounded-2xl overflow-hidden shadow-rosa ring-4 ring-creme-50"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: easing }}
                style={{ y: ySmall }}
              >
                <Image
                  src={HERO_COLLAGE[2]}
                  alt="Bolsa de crochê com cores premium"
                  fill
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Etiqueta flutuante */}
              <motion.div
                className="absolute top-[8%] -left-2 md:-left-6 bg-creme-50/95 backdrop-blur-md border border-creme-200 px-4 py-3 rounded-2xl shadow-md max-w-[180px]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1, ease: easing }}
              >
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-rosa-400 font-medium">
                  Edição
                </p>
                <p className="font-display text-base text-texto-escuro mt-1 leading-tight">
                  Coleção Primavera
                </p>
                <div className="h-px w-6 bg-rosa-300 mt-2" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-texto-claro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.25em]">
          Role para descobrir
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-rosa-300 to-transparent"
          animate={{ scaleY: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}
