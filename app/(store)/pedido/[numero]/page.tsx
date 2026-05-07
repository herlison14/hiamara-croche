'use client'

import { useEffect, useState } from 'react'
import { OrderStatusTracker } from '@/components/store/OrderStatusTracker'
import { PixQRCode } from '@/components/store/PixQRCode'
import type { Pedido } from '@/lib/types'

export default function PedidoPage({ params, searchParams }: { params: { numero: string }; searchParams: { email?: string } }) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const email = searchParams.email ?? ''

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/pedidos?numero=${params.numero}&email=${encodeURIComponent(email)}`)
      if (res.ok) setPedido(await res.json())
      setLoading(false)
    }
    load()
  }, [params.numero, email])

  if (loading) {
    return (
      <div className="min-h-screen bg-creme-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rosa-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-creme-50 flex items-center justify-center text-center px-6">
        <div>
          <p className="font-display text-xl text-texto-medio">Pedido não encontrado</p>
          <p className="text-sm text-texto-claro mt-2">Verifique o número e o e-mail informado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creme-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-light text-texto-escuro">
            Pedido {pedido.numero}
          </h1>
          <p className="text-texto-claro mt-2">Olá, {pedido.cliente_nome}! Acompanhe seu pedido abaixo.</p>
        </div>

        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6">
          <h2 className="font-display text-lg font-medium text-texto-escuro mb-6">
            Status do Pedido
          </h2>
          <OrderStatusTracker status={pedido.status} />
        </div>

        {pedido.status === 'aguardando_pagamento' && pedido.pagamento_qr_code && pedido.pagamento_pix_copia_cola && pedido.pagamento_expiracao && (
          <PixQRCode
            qrCodeBase64={pedido.pagamento_qr_code}
            copiaCola={pedido.pagamento_pix_copia_cola}
            valor={pedido.total}
            expiracao={pedido.pagamento_expiracao}
            numeroPedido={pedido.numero}
            email={email}
          />
        )}

        {pedido.itens && pedido.itens.length > 0 && (
          <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6 space-y-3">
            <h2 className="font-display text-lg font-medium text-texto-escuro">Itens</h2>
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-texto-medio">
                <span>{item.produto_nome} × {item.quantidade}</span>
                <span>R$ {item.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            <div className="border-t border-creme-200 pt-3 flex justify-between font-medium text-texto-escuro">
              <span>Total</span>
              <span className="font-display text-rosa-500">
                R$ {pedido.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
