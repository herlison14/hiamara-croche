'use client'

import { useState } from 'react'
import { Check, ShoppingBag, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
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

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  if (semEstoque) {
    return (
      <button
        disabled
        className={cn(
          'w-full font-medium uppercase tracking-widest border border-[#EDE0CD] text-[#8A7B7B] rounded-md cursor-not-allowed',
          sizes[size],
          className
        )}
      >
        Sob Encomenda
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={cn(
        'w-full flex items-center justify-center gap-2 font-medium uppercase tracking-widest rounded-md transition-all duration-300',
        sizes[size],
        state === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-[#C97A84] hover:bg-[#A85A65] text-white shadow-[0_4px_16px_rgba(168,90,101,0.25)] hover:shadow-[0_6px_20px_rgba(168,90,101,0.35)] active:scale-95',
        className
      )}
    >
      {state === 'loading' && <Loader2 size={16} className="animate-spin" />}
      {state === 'success' && <Check size={16} />}
      {state === 'idle' && <ShoppingBag size={16} />}
      {state === 'loading' && 'Adicionando...'}
      {state === 'success' && 'Adicionado!'}
      {state === 'idle' && 'Adicionar ao Carrinho'}
    </button>
  )
}
