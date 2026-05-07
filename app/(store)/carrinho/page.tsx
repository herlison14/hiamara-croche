'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total, totalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-creme-50 flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-creme-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-rosa-400" />
        </div>
        <h2 className="font-display text-3xl font-light text-texto-escuro">
          Seu carrinho está vazio
        </h2>
        <p className="text-texto-claro">Explore nossas peças artesanais e encontre algo especial</p>
        <Button asChild size="md">
          <Link href="/produtos" className="inline-flex items-center gap-2">
            Ver Produtos <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    )
  }

  const subtotal = total()
  const freteGratis = subtotal >= 150
  const frete = freteGratis ? 0 : 25
  const totalFinal = subtotal + frete

  return (
    <div className="min-h-screen bg-creme-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-light text-texto-escuro mb-8">
          Meu Carrinho{' '}
          <span className="text-2xl text-texto-claro">
            ({totalItems()} {totalItems() === 1 ? 'item' : 'itens'})
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const key = `${item.produto.id}__${JSON.stringify(item.variante_selecionada ?? {})}`
              const img = item.produto.imagem_principal ?? item.produto.imagens?.[0]
              const precoUnitario = item.produto.preco_promocional ?? item.produto.preco

              return (
                <div key={key} className="flex gap-4 bg-creme-50 border border-creme-200 rounded-2xl p-4">
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-creme-100">
                    {img ? (
                      <Image src={img} alt={item.produto.nome} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-display text-3xl text-rosa-400">
                        {item.produto.nome[0]}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-display text-lg font-medium text-texto-escuro line-clamp-2">
                      {item.produto.nome}
                    </h3>

                    {item.variante_selecionada && Object.keys(item.variante_selecionada).length > 0 && (
                      <p className="text-xs text-texto-claro">
                        {Object.entries(item.variante_selecionada).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}

                    <p className="font-display text-lg font-semibold text-rosa-500">
                      R$ {(precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border border-creme-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(key, item.quantidade - 1)}
                          className="p-2 text-texto-claro hover:text-rosa-400 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-texto-escuro">{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantidade + 1)}
                          className="p-2 text-texto-claro hover:text-rosa-400 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(key)}
                        className="p-2 text-texto-claro hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6 space-y-4 sticky top-24">
              <h3 className="font-display text-xl font-light text-texto-escuro">
                Resumo do Pedido
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-texto-medio">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-texto-medio">Frete</span>
                  <span className={freteGratis ? 'text-rosa-500 font-medium' : 'text-texto-medio'}>
                    {freteGratis ? 'Grátis ✓' : `R$ ${frete.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {!freteGratis && (
                  <p className="text-xs text-texto-claro">
                    Faltam R$ {(150 - subtotal).toFixed(2).replace('.', ',')} para frete grátis
                  </p>
                )}
              </div>

              <div className="border-t border-creme-200 pt-4 flex justify-between">
                <span className="font-medium text-texto-escuro">Total</span>
                <span className="font-display text-xl font-semibold text-rosa-500">
                  R$ {totalFinal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <Button asChild size="md" className="w-full">
                <Link href="/checkout">Finalizar Compra</Link>
              </Button>
              <Link
                href="/produtos"
                className="block text-center text-sm text-texto-claro hover:text-rosa-400 transition-colors"
              >
                Continuar Comprando
              </Link>

              <div className="text-xs text-texto-claro space-y-1 border-t border-creme-200 pt-4">
                <p>✓ Pagamento via PIX</p>
                <p>✓ Peças 100% artesanais</p>
                <p>✓ Prazo de produção: ~7 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
