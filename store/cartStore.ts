import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Produto } from '@/lib/types'

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
  variante_selecionada?: Record<string, string>
}

interface CartStore {
  items: ItemCarrinho[]
  addItem: (item: ItemCarrinho) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantidade: number) => void
  clearCart: () => void
  total: () => number
  totalItems: () => number
}

function itemKey(item: ItemCarrinho) {
  return `${item.produto.id}__${JSON.stringify(item.variante_selecionada ?? {})}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (novoItem) => {
        const key = itemKey(novoItem)
        set((state) => {
          const existing = state.items.find((i) => itemKey(i) === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key
                  ? { ...i, quantidade: i.quantidade + novoItem.quantidade }
                  : i
              ),
            }
          }
          return { items: [...state.items, novoItem] }
        })
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== key),
        }))
      },

      updateQuantity: (key, quantidade) => {
        if (quantidade <= 0) {
          get().removeItem(key)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i) === key ? { ...i, quantidade } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + (i.produto.preco_promocional ?? i.produto.preco) * i.quantidade,
          0
        ),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantidade, 0),
    }),
    { name: 'hiamara-cart' }
  )
)
