'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Produto, ItemCarrinho } from './types'

interface CartState {
  items: ItemCarrinho[]
  addItem: (produto: Produto, quantidade?: number, variante?: Record<string, string>) => void
  removeItem: (produtoId: string, variante?: Record<string, string>) => void
  updateQuantidade: (produtoId: string, quantidade: number, variante?: Record<string, string>) => void
  clearCart: () => void
  total: () => number
  subtotal: () => number
  frete: () => number
  totalItems: () => number
}

function varianteKey(variante?: Record<string, string>) {
  if (!variante) return ''
  return Object.entries(variante).sort().map(([k, v]) => `${k}:${v}`).join('|')
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (produto, quantidade = 1, variante) => {
        set((state) => {
          const key = varianteKey(variante)
          const existing = state.items.find(
            (i) => i.produto.id === produto.id && varianteKey(i.variante_selecionada) === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.produto.id === produto.id && varianteKey(i.variante_selecionada) === key
                  ? { ...i, quantidade: i.quantidade + quantidade }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { produto, quantidade, variante_selecionada: variante }],
          }
        })
      },

      removeItem: (produtoId, variante) => {
        const key = varianteKey(variante)
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.produto.id === produtoId && varianteKey(i.variante_selecionada) === key)
          ),
        }))
      },

      updateQuantidade: (produtoId, quantidade, variante) => {
        const key = varianteKey(variante)
        if (quantidade <= 0) {
          get().removeItem(produtoId, variante)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.produto.id === produtoId && varianteKey(i.variante_selecionada) === key
              ? { ...i, quantidade }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const preco = i.produto.preco_promocional ?? i.produto.preco
          return sum + preco * i.quantidade
        }, 0),

      frete: () => {
        const sub = get().subtotal()
        return sub >= 150 ? 0 : 15
      },

      total: () => get().subtotal() + get().frete(),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantidade, 0),
    }),
    { name: 'hiamara-cart' }
  )
)
