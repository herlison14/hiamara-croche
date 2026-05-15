'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Produto } from '@/lib/produtos-actions'

interface ProductCardProps {
  produto: Produto
  priority?: boolean
}

export function ProductCardFirebase({ produto, priority }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const fotos = produto.fotos ?? []
  const primeira = fotos[0]?.url
  const segunda = fotos[1]?.url ?? primeira

  return (
    <Link
      href={`/produto/${produto.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group block"
    >
      <article className="relative flex flex-col">
        {/* Imagem */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-creme-100">
          {primeira ? (
            <>
              <Image
                src={primeira}
                alt={produto.nome}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-[1.2s] ease-out-expo ${
                  hovered && segunda !== primeira ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:scale-[1.04]'
                }`}
              />
              {segunda !== primeira && (
                <Image
                  src={segunda}
                  alt={produto.nome}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-opacity duration-[1.2s] ease-out-expo ${
                    hovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-creme-100 via-rosa-50 to-creme-200 flex items-center justify-center">
              <span className="font-display text-7xl font-light text-rosa-200">
                {produto.nome[0]?.toUpperCase() || '✦'}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {produto.novo && (
              <span className="px-2.5 py-1 bg-creme-50/95 backdrop-blur text-rosa-500 text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-full shadow-xs">
                Novo
              </span>
            )}
            {produto.mais_vendido && (
              <span className="px-2.5 py-1 bg-texto-escuro/90 backdrop-blur text-creme-50 text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-full">
                Top
              </span>
            )}
            {produto.destaque && (
              <span className="px-2.5 py-1 bg-rosa-400 text-white text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-full shadow-rosa">
                Destaque
              </span>
            )}
          </div>

          {/* Hover overlay com CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-texto-escuro/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-creme-50/95 backdrop-blur flex items-center justify-center text-texto-escuro opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-expo shadow-md">
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 px-1 flex flex-col gap-1.5">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-rosa-400 font-medium">
            {produto.categoria}
          </p>
          <h3 className="font-display text-lg md:text-xl font-medium text-texto-escuro leading-tight line-clamp-2 group-hover:text-rosa-500 transition-colors duration-300">
            {produto.nome}
          </h3>
          <p className="font-display text-base text-texto-medio font-light mt-0.5">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </article>
    </Link>
  )
}
