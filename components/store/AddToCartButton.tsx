'use client'

import { useState } from 'react'
import { Check, ShoppingBag, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import toast from 'react-hot-toast'
import type { Produto } from '@/lib/types'

interface AddToCartButtonProps {
  produto: Produto
  variante?: Record<string, string>
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AddToCartButton({ produto, variante, className, size = 'md' }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')

  const semEstoque = produto.estoque === 0

  const handleClick = async () => {
    if (semEstoque || state !== 'idle') return
    setState('loading')
    await new Promise((r) => setTimeout(r, 300))
    addItem({ produto, quantidade: 1, variante_selecionada: variante })
    toast.success(`${produto.nome} adicionado ao carrinho!`, { icon: '🛍️' })
    setState('success')
    setTimeout(() => setState('idle'), 1800)
  }

  if (semEstoque) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={cn('w-full cursor-not-allowed', className)}
      >
        Sob Encomenda
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={state !== 'idle'}
      size={size}
      className={cn(
        'w-full',
        state === 'success' && 'bg-green-500 hover:bg-green-500 shadow-none',
        className
      )}
    >
      {state === 'loading' && <Loader2 className="animate-spin" />}
      {state === 'success' && <Check />}
      {state === 'idle' && <ShoppingBag />}
      {state === 'loading' && 'Adicionando...'}
      {state === 'success' && 'Adicionado!'}
      {state === 'idle' && 'Adicionar ao Carrinho'}
    </Button>
  )
}
