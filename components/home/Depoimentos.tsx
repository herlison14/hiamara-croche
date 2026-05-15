'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const easing = [0.16, 1, 0.3, 1] as const

const depoimentos = [
  {
    texto:
      'Comprei a blusa rendada turquesa e fiquei impressionada com o acabamento. Cada ponto perfeito, cai lindo no corpo. Já é minha peça preferida do guarda-roupa.',
    nome: 'Mariana S.',
    cidade: 'São Paulo, SP',
    nota: 5,
  },
  {
    texto:
      'O amigurumi do Naruto chegou impecável e veio numa embalagem linda. Presenteei meu filho e ele não largou mais. Atendimento incrível, super atenciosa.',
    nome: 'Camila R.',
    cidade: 'Rio de Janeiro, RJ',
    nota: 5,
  },
  {
    texto:
      'A bolsa premium é uma obra de arte. Recebo elogios sempre que saio com ela. Vale cada real — peça artesanal de verdade, não tem comparação com industrial.',
    nome: 'Patrícia M.',
    cidade: 'Curitiba, PR',
    nota: 5,
  },
]

export function Depoimentos() {
  return (
    <section className="bg-creme-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-4">Quem usa, ama</p>
          <h2 className="display-lg">
            Histórias de quem leva{' '}
            <span className="italic text-rosa-500">Hiamara</span> pra casa.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {depoimentos.map((d, i) => (
            <motion.figure
              key={d.nome}
              className="group relative bg-creme-100/60 hover:bg-creme-50 border border-creme-200 rounded-3xl p-8 transition-all duration-700 ease-out-expo hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: easing }}
            >
              <Quote
                className="text-rosa-300 mb-5 group-hover:text-rosa-400 transition-colors duration-500"
                size={28}
                strokeWidth={1.5}
              />

              {/* Estrelas */}
              <div className="flex gap-0.5 mb-5" aria-label={`${d.nota} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`text-sm ${
                      idx < d.nota ? 'text-rosa-400' : 'text-creme-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <blockquote className="font-display text-lg md:text-xl text-texto-escuro font-light leading-snug italic">
                “{d.texto}”
              </blockquote>

              <figcaption className="mt-7 pt-5 border-t border-creme-200">
                <p className="font-medium text-sm text-texto-escuro">{d.nome}</p>
                <p className="text-xs text-texto-claro mt-0.5">{d.cidade}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
