import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        'group block',
        variant === 'featured' && 'md:col-span-1 md:row-span-1'
      )}
    >
      <Card className="overflow-hidden hover:shadow-[0_8px_32px_rgba(61,43,43,0.12)] transition-all duration-350 hover:-translate-y-1">
        <div className={cn(
          'relative overflow-hidden bg-secondary',
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
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-rosa-100 flex items-center justify-center">
              <span className="font-display text-5xl font-light text-primary">
                {produto.nome[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {produto.destaque && (
              <Badge variant="default">Destaque</Badge>
            )}
            {produto.mais_vendido && (
              <Badge variant="secondary">Mais Vendido</Badge>
            )}
            {semEstoque && (
              <Badge variant="muted">Sob Encomenda</Badge>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="m-3 bg-primary hover:bg-rosa-500 text-primary-foreground text-center text-xs font-medium uppercase tracking-widest py-2.5 rounded-lg transition-colors">
              Ver Detalhes
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col">
          {produto.categoria && (
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
              {produto.categoria.nome}
            </span>
          )}

          <h3 className={cn(
            'font-display font-light text-foreground leading-snug line-clamp-2',
            variant === 'compact' ? 'text-base' : 'text-lg'
          )}>
            {produto.nome}
          </h3>

          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <div>
              {temPromocao ? (
                <>
                  <p className="text-xs text-muted-foreground line-through">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="font-display text-lg font-semibold text-rosa-500">
                    R$ {produto.preco_promocional!.toFixed(2).replace('.', ',')}
                  </p>
                </>
              ) : (
                <p className="font-display text-lg font-semibold text-rosa-500">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>

            {produto.tempo_producao_dias > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={11} />
                <span>{produto.tempo_producao_dias}d</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
