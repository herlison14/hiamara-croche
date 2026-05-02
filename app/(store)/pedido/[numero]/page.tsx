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
      <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C97A84] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center text-center px-6">
        <div>
          <p className="text-xl text-[#5C4A4A]" style={{ fontFamily: 'Cormorant Garamond' }}>Pedido não encontrado</p>
          <p className="text-sm text-[#8A7B7B] mt-2">Verifique o número e o e-mail informado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
            Pedido {pedido.numero}
          </h1>
          <p className="text-[#8A7B7B] mt-2">Olá, {pedido.cliente_nome}! Acompanhe seu pedido abaixo.</p>
        </div>

        <div className="bg-white border border-[#EDE0CD] rounded-2xl p-6">
          <h2 className="text-lg font-medium text-[#3D2B2B] mb-6" style={{ fontFamily: 'Cormorant Garamond' }}>
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
          <div className="bg-white border border-[#EDE0CD] rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-medium text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Itens</h2>
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-[#5C4A4A]">
                <span>{item.produto_nome} × {item.quantidade}</span>
                <span>R$ {item.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            <div className="border-t border-[#EDE0CD] pt-3 flex justify-between font-medium text-[#3D2B2B]">
              <span>Total</span>
              <span className="text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
                R$ {pedido.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
