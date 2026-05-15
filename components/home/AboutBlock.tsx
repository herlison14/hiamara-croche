'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ABOUT_IMAGE } from '@/lib/showcaseImages'

const easing = [0.16, 1, 0.3, 1] as const

export function AboutBlock() {
  return (
    <section className="bg-creme-50 py-20 md:py-32">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Texto */}
          <motion.div
            className="lg:col-span-6 order-2 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: easing }}
          >
            <p className="eyebrow mb-5">Nossa história</p>
            <h2 className="display-lg">
              Crochê é{' '}
              <span className="italic text-rosa-500">memória</span> em forma
              de ponto.
            </h2>

            <div className="mt-7 space-y-5 text-texto-medio font-light leading-relaxed text-base md:text-lg max-w-xl">
              <p>
                A Hiamara Crochê nasceu da vontade de transformar uma técnica
                herdada em peças que conversam com o presente. Aqui, cada
                blusa, bolsa ou amigurumi sai do mesmo lugar: mãos que
                aprenderam a criar com calma.
              </p>
              <p>
                Trabalhamos com fios selecionados, lotes pequenos e nenhum
                automatismo. Você compra direto de quem faz — e leva pra casa
                uma peça que ninguém mais tem igual.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/produtos" className="btn-primary group">
                Ver o catálogo
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <a
                href="https://www.instagram.com/hiamaracroche"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-texto-escuro hover:text-rosa-500 underline underline-offset-4 transition-colors"
              >
                @hiamaracroche
              </a>
            </div>
          </motion.div>

          {/* Imagem */}
          <motion.div
            className="lg:col-span-6 order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: easing }}
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
              <Image
                src={ABOUT_IMAGE}
                alt="Peça artesanal Hiamara Crochê"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Carimbo decorativo */}
            <motion.div
              className="absolute -bottom-6 -left-4 md:-left-10 w-32 h-32 md:w-40 md:h-40 rounded-full border border-rosa-300 bg-creme-50/95 backdrop-blur-md flex items-center justify-center text-center shadow-md"
              initial={{ rotate: -15, opacity: 0 }}
              whileInView={{ rotate: -8, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: easing }}
            >
              <div>
                <p className="text-[0.55rem] uppercase tracking-[0.22em] text-rosa-400 font-medium">
                  Hiamara
                </p>
                <p className="font-display italic text-xl md:text-2xl text-texto-escuro mt-1 leading-none">
                  Crochê
                </p>
                <p className="text-[0.55rem] uppercase tracking-[0.22em] text-rosa-400 font-medium mt-1">
                  Artesanal
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
