'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Scissors, Sparkles, Package } from 'lucide-react'
import { PROCESSO_IMAGE } from '@/lib/showcaseImages'

const easing = [0.16, 1, 0.3, 1] as const

const steps = [
  {
    icon: Heart,
    titulo: 'Escolha do fio',
    descricao:
      'Fios de algodão pima e mistos selecionados pela maciez, brilho e durabilidade.',
  },
  {
    icon: Scissors,
    titulo: 'Confecção à mão',
    descricao:
      'Cada peça é tecida ponto a ponto, em ritmo artesanal — sem máquina, sem pressa.',
  },
  {
    icon: Sparkles,
    titulo: 'Acabamento',
    descricao:
      'Revisão de tensão, bloqueio e finalização para garantir caimento e durabilidade.',
  },
  {
    icon: Package,
    titulo: 'Embalagem afetiva',
    descricao:
      'Sua peça chega envolvida com cuidado, pronta para presentear ou estrear.',
  },
]

export function NossoProcesso() {
  return (
    <section className="bg-creme-100 py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 paper-grain opacity-60 pointer-events-none" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Imagem */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: easing }}
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg">
              <Image
                src={PROCESSO_IMAGE}
                alt="Detalhe artesanal de peça de crochê"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            {/* Cartela flutuante */}
            <motion.div
              className="absolute -bottom-6 -right-4 md:-right-10 bg-creme-50 border border-creme-200 rounded-2xl px-6 py-5 shadow-md max-w-[240px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: easing }}
            >
              <p className="eyebrow text-rosa-400 mb-2">Em média</p>
              <p className="font-display text-3xl text-texto-escuro font-light leading-none">
                7–14 dias
              </p>
              <p className="text-xs text-texto-medio mt-2">
                de produção para cada peça artesanal
              </p>
            </motion.div>
          </motion.div>

          {/* Steps */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easing }}
            >
              <p className="eyebrow mb-4">O processo</p>
              <h2 className="display-lg">
                Do fio ao seu colo, com{' '}
                <span className="italic text-rosa-500">tempo</span>.
              </h2>
              <p className="mt-5 text-texto-medio max-w-xl font-light leading-relaxed">
                Trabalhamos no ritmo do artesanato — nada de produção em massa.
                Você acompanha cada etapa e recebe uma peça que carrega a
                história de quem a fez.
              </p>
            </motion.div>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.titulo}
                    className="group relative bg-creme-50 border border-creme-200 rounded-2xl p-6 hover:border-rosa-300 hover:shadow-md transition-all duration-500 ease-out-expo"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: easing }}
                  >
                    <div className="absolute top-5 right-5 text-rosa-100 group-hover:text-rosa-300 transition-colors duration-500 font-display text-4xl leading-none font-light">
                      0{i + 1}
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-rosa-50 text-rosa-500 flex items-center justify-center mb-4 group-hover:bg-rosa-100 transition-colors">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-texto-escuro mb-2 font-medium">
                      {step.titulo}
                    </h3>
                    <p className="text-sm text-texto-medio leading-relaxed font-light">
                      {step.descricao}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
