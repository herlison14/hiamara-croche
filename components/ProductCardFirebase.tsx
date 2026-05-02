'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Produto } from '@/lib/firebase-helpers'

interface ProductCardProps {
  produto: Produto
}

export function ProductCardFirebase({ produto }: ProductCardProps) {
  const primeiraImagem = produto.fotos?.[0]?.url

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.2 }}>
      <Link href={`/produto/${produto.slug}`}>
        <div className="group relative flex flex-col bg-white border border-creme-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
          {/* Imagem do Produto */}
          <div className="relative overflow-hidden bg-creme-100 aspect-[4/5]">
            {primeiraImagem ? (
              <img
                src={primeiraImagem}
                alt={produto.nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-creme-100 to-rosa-100 flex items-center justify-center">
                <span
                  className="text-6xl font-light text-rosa-300"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  {produto.nome[0]?.toUpperCase() || '🧶'}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {produto.destaque && (
                <span className="px-3 py-1 bg-rosa-400 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                  Destaque
                </span>
              )}
              {produto.novo && (
                <span className="px-3 py-1 bg-amber-400 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                  Novo
                </span>
              )}
              {produto.mais_vendido && (
                <span className="px-3 py-1 bg-texto-escuro text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                  Top Vendido
                </span>
              )}
            </div>

            {/* Botão Ver Detalhes */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="m-3 bg-gradient-to-r from-rosa-400 to-rosa-500 hover:from-rosa-500 hover:to-rosa-600 text-white text-center text-xs font-semibold uppercase tracking-widest py-3 rounded-lg transition-colors">
                Ver Detalhes
              </div>
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="p-4 space-y-3 flex-1 flex flex-col">
            {/* Categoria */}
            <span className="text-xs font-bold uppercase tracking-widest text-rosa-400">
              {produto.categoria}
            </span>

            {/* Nome */}
            <h3
              className="font-light text-texto-escuro leading-tight line-clamp-2"
              style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}
            >
              {produto.nome}
            </h3>

            {/* Preço */}
            <div className="mt-auto pt-2">
              <p
                className="text-xl font-light text-rosa-500"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* Descrição resumida */}
            <p className="text-xs text-texto-medio line-clamp-2 mt-2">
              {produto.descricao}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
