'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { HERO_COLLAGE } from '@/lib/showcaseImages'

const easing = [0.16, 1, 0.3, 1] as const

export function CtaFinal() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-creme-50">
      <div className="container-wide relative">
        <motion.div
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-rosa-400 via-rosa-500 to-rosa-600 p-10 md:p-16 lg:p-20 shadow-rosa"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: easing }}
        >
          {/* Imagem de fundo lateral */}
          <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 opacity-30">
            <Image
              src={HERO_COLLAGE[3]}
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rosa-600 via-rosa-500/60 to-transparent" />
          </div>

          {/* Decoração — círculos */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-creme-50/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rosa-700/40 blur-2xl" />

          <div className="relative max-w-xl text-creme-50">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-rosa-100 font-medium mb-4">
              Encomenda personalizada
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Quer uma peça{' '}
              <span className="italic">só sua</span>?
            </h2>
            <p className="mt-5 text-base md:text-lg text-creme-100/90 font-light leading-relaxed">
              Cores, tamanho, modelo. Fazemos sob medida — fale com a gente
              pelo WhatsApp e desenhamos a peça do seu jeito.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/5521997927927"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-creme-50 text-rosa-500 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-creme-100 transition-colors duration-300 shadow-lg"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Falar no WhatsApp
              </a>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 text-creme-50 px-2 py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:text-rosa-100 transition-colors group"
              >
                Ou veja o catálogo
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
