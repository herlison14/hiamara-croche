import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { buscarPagamento } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action !== 'payment.updated' && body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const pagamentoId = String(body.data?.id ?? body.id)
    if (!pagamentoId) return NextResponse.json({ ok: true })

    const pagamento = await buscarPagamento(pagamentoId)
    if (!pagamento) return NextResponse.json({ ok: true })

    const db = createServiceClient()

    if (pagamento.status === 'approved') {
      const referencia = pagamento.external_reference
      if (!referencia) return NextResponse.json({ ok: true })

      await db.from('pedidos').update({
        status: 'pago',
        pagamento_status: 'aprovado',
        pagamento_confirmado_em: new Date().toISOString(),
      }).eq('id', referencia)
    } else if (pagamento.status === 'rejected' || pagamento.status === 'cancelled') {
      const referencia = pagamento.external_reference
      if (referencia) {
        await db.from('pedidos').update({ pagamento_status: 'rejeitado' }).eq('id', referencia)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
