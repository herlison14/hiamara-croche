import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Produto } from '@/lib/types'

interface ProductCardProps {
  produto: Produto
  variant?: 'default' | 'compact' | 'featured'
}

export function ProductCard({ produto, variant = 'default' }: ProductCardProps) {
  const temPromocao = produto.preco_promocional != null && produto.preco_promocional < produto.preco
  const semEstoque = produto.estoque === 0

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className={cn(
        'group relative flex flex-col bg-[#FDFAF5] border border-[#EDE0CD] rounded-2xl overflow-hidden',
        'shadow-[0_2px_12px_rgba(61,43,43,0.06)] hover:shadow-[0_8px_32px_rgba(61,43,43,0.12)]',
        'transition-all duration-350 hover:-translate-y-1',
        variant === 'featured' && 'md:col-span-1 md:row-span-1'
      )}
    >
      <div className={cn(
        'relative overflow-hidden bg-[#F5EFE6]',
        variant === 'compact' ? 'aspect-square' : 'aspect-[4/5]'
      )}>
        {produto.imagem_principal ? (
          <Image
            src={produto.imagem_principal}
            alt={produto.nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] to-[#F4C5CB] flex items-center justify-center">
            <span className="text-5xl font-light text-[#C97A84]" style={{ fontFamily: 'Cormorant Garamond' }}>
              {produto.nome[0]?.toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {produto.destaque && (
            <span className="px-2.5 py-0.5 bg-[#C97A84] text-white text-[10px] font-medium uppercase tracking-wider rounded-full">
              Destaque
            </span>
          )}
          {produto.mais_vendido && (
            <span className="px-2.5 py-0.5 bg-[#3D2B2B] text-white text-[10px] font-medium uppercase tracking-wider rounded-full">
              Mais Vendido
            </span>
          )}
          {semEstoque && (
            <span className="px-2.5 py-0.5 bg-white/90 text-[#8A7B7B] text-[10px] font-medium uppercase tracking-wider rounded-full">
              Sob Encomenda
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="m-3 bg-[#C97A84] hover:bg-[#A85A65] text-white text-center text-xs font-medium uppercase tracking-widest py-2.5 rounded-lg">
            Ver Detalhes
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col">
        {produto.categoria && (
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#C97A84]">
            {produto.categoria.nome}
          </span>
        )}

        <h3 className="font-light text-[#3D2B2B] leading-snug line-clamp-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: variant === 'compact' ? '16px' : '18px' }}>
          {produto.nome}
        </h3>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            {temPromocao ? (
              <>
                <p className="text-xs text-[#8A7B7B] line-through">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-lg font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                  R$ {produto.preco_promocional!.toFixed(2).replace('.', ',')}
                </p>
              </>
            ) : (
              <p className="text-lg font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>

          {produto.tempo_producao_dias > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-[#8A7B7B]">
              <Clock size={11} />
              <span>{produto.tempo_producao_dias}d</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
