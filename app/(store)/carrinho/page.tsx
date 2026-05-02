'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total, totalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FDFAF5] flex flex-col items-center justify-center px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-[#F5EFE6] rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-[#C97A84]" />
        </div>
        <h2 className="text-3xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
          Seu carrinho está vazio
        </h2>
        <p className="text-[#8A7B7B]">Explore nossas peças artesanais e encontre algo especial</p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
        >
          Ver Produtos <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const subtotal = total()
  const freteGratis = subtotal >= 150
  const frete = freteGratis ? 0 : 25
  const totalFinal = subtotal + frete

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light text-[#3D2B2B] mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
          Meu Carrinho <span className="text-2xl text-[#8A7B7B]">({totalItems()} {totalItems() === 1 ? 'item' : 'itens'})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const key = `${item.produto.id}__${JSON.stringify(item.variante_selecionada ?? {})}`
              const img = item.produto.imagem_principal ?? item.produto.imagens?.[0]
              const precoUnitario = item.produto.preco_promocional ?? item.produto.preco

              return (
                <div key={key} className="flex gap-4 bg-white border border-[#EDE0CD] rounded-2xl p-4">
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5EFE6]">
                    {img ? (
                      <Image src={img} alt={item.produto.nome} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl text-[#C97A84]">
                        {item.produto.nome[0]}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-medium text-[#3D2B2B] line-clamp-2" style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px' }}>
                      {item.produto.nome}
                    </h3>

                    {item.variante_selecionada && Object.keys(item.variante_selecionada).length > 0 && (
                      <p className="text-xs text-[#8A7B7B]">
                        {Object.entries(item.variante_selecionada).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}

                    <p className="text-lg font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                      R$ {(precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border border-[#EDE0CD] rounded-lg">
                        <button
                          onClick={() => updateQuantity(key, item.quantidade - 1)}
                          className="p-2 text-[#8A7B7B] hover:text-[#C97A84] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#3D2B2B]">{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(key, item.quantidade + 1)}
                          className="p-2 text-[#8A7B7B] hover:text-[#C97A84] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(key)}
                        className="p-2 text-[#8A7B7B] hover:text-red-400 transition-colors"
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
            <div className="bg-white border border-[#EDE0CD] rounded-2xl p-6 space-y-4 sticky top-24">
              <h3 className="text-xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
                Resumo do Pedido
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#5C4A4A]">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C4A4A]">Frete</span>
                  <span className={freteGratis ? 'text-green-600 font-medium' : 'text-[#5C4A4A]'}>
                    {freteGratis ? 'Grátis ✓' : `R$ ${frete.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {!freteGratis && (
                  <p className="text-xs text-[#8A7B7B]">
                    Faltam R$ {(150 - subtotal).toFixed(2).replace('.', ',')} para frete grátis
                  </p>
                )}
              </div>

              <div className="border-t border-[#EDE0CD] pt-4 flex justify-between">
                <span className="font-medium text-[#3D2B2B]">Total</span>
                <span className="text-xl font-semibold text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                  R$ {totalFinal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center px-6 py-3.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300 shadow-[0_4px_16px_rgba(168,90,101,0.25)]"
              >
                Finalizar Compra
              </Link>
              <Link
                href="/produtos"
                className="block text-center text-sm text-[#8A7B7B] hover:text-[#C97A84] transition-colors"
              >
                Continuar Comprando
              </Link>

              <div className="text-xs text-[#8A7B7B] space-y-1 border-t border-[#EDE0CD] pt-4">
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
