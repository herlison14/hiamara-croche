'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Badge } from './Badge'
import type { Produto } from '@/lib/produtos-actions'

interface ProductCardProps {
  produto: Produto
  priority?: boolean
  className?: string
}

export function ProductCard({ produto, priority = false, className }: ProductCardProps) {
  const primeiraImagem = produto.fotos?.[0]?.url

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={cn('group', className)}
    >
      <Link href={`/produto/${produto.slug}`} className="block">
        <article className="flex flex-col bg-creme-50 border border-creme-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-350">
          <div className="relative overflow-hidden bg-creme-100 aspect-[4/5]">
            {primeiraImagem ? (
              <Image
                src={primeiraImagem}
                alt={produto.nome}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-creme-100 to-rosa-100 flex items-center justify-center">
                <span className="font-display text-6xl font-light text-rosa-300">
                  {produto.nome[0]?.toUpperCase() ?? '🧶'}
                </span>
              </div>
            )}

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {produto.destaque    && <Badge variant="destaque">Destaque</Badge>}
              {produto.novo        && <Badge variant="novo">Novo</Badge>}
              {produto.mais_vendido && <Badge variant="top">Top</Badge>}
            </div>

            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="m-3 bg-rosa-400 hover:bg-rosa-500 text-white text-center font-sans text-[11px] font-semibold uppercase tracking-[0.08em] py-3 rounded-lg transition-colors">
                Ver Detalhes
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-rosa-400">
              {produto.categoria}
            </span>
            <h3 className="font-display text-lg font-light text-texto-escuro leading-tight line-clamp-2">
              {produto.nome}
            </h3>
            {produto.descricao && (
              <p className="font-sans text-xs text-texto-claro line-clamp-2 leading-relaxed">
                {produto.descricao}
              </p>
            )}
            <p className="font-display text-xl font-semibold text-rosa-500 mt-auto pt-2">
              R$ {produto.preco.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
