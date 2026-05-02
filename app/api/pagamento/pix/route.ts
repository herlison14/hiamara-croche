import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { criarPagamentoPix } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const { pedido_id } = await request.json()
    if (!pedido_id) return NextResponse.json({ error: 'pedido_id obrigatório' }, { status: 400 })

    const db = createServiceClient()
    const { data: pedido, error } = await db.from('pedidos').select('*').eq('id', pedido_id).single()
    if (error || !pedido) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const pix = await criarPagamentoPix({
      valor: pedido.total,
      descricao: `HIAMARA CROCHÊ - Pedido ${pedido.numero}`,
      email: pedido.cliente_email,
      nome: pedido.cliente_nome,
      referencia: pedido.id,
      urlWebhook: `${siteUrl}/api/pagamento/webhook`,
    })

    await db.from('pedidos').update({
      pagamento_id: pix.pagamentoId,
      pagamento_qr_code: pix.qr_code_base64,
      pagamento_pix_copia_cola: pix.copia_cola,
      pagamento_expiracao: pix.expiracao,
    }).eq('id', pedido_id)

    return NextResponse.json({
      qr_code_base64: pix.qr_code_base64,
      copia_cola: pix.copia_cola,
      expiracao: pix.expiracao,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro ao gerar PIX' }, { status: 500 })
  }
}
