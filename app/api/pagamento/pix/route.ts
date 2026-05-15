import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { criarPagamentoPix } from '@/lib/mercadopago'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pedidoId = body?.pedido_id as string | undefined
    if (!pedidoId) {
      return NextResponse.json({ error: 'pedido_id obrigatório' }, { status: 400 })
    }

    const db = createServiceClient()
    const { data: pedido, error } = await db
      .from('pedidos')
      .select('*')
      .eq('id', pedidoId)
      .single()

    if (error || !pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    // Já pago: não regenera
    if (pedido.pagamento_status === 'aprovado') {
      return NextResponse.json({ error: 'Pedido já está pago' }, { status: 409 })
    }

    // PIX ainda válido (com pelo menos 2 min restantes): reaproveita
    const expiracao = pedido.pagamento_expiracao
      ? new Date(pedido.pagamento_expiracao).getTime()
      : 0
    const restante = expiracao - Date.now()
    if (
      pedido.pagamento_qr_code &&
      pedido.pagamento_pix_copia_cola &&
      restante > 2 * 60 * 1000
    ) {
      return NextResponse.json({
        qr_code_base64: pedido.pagamento_qr_code,
        copia_cola: pedido.pagamento_pix_copia_cola,
        expiracao: pedido.pagamento_expiracao,
        reused: true,
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const pix = await criarPagamentoPix({
      valor: Number(pedido.total),
      descricao: `HIAMARA CROCHÊ — Pedido ${pedido.numero}`,
      email: pedido.cliente_email,
      nome: pedido.cliente_nome,
      referencia: pedido.id,
      urlWebhook: `${siteUrl}/api/pagamento/webhook`,
    })

    const { error: updErr } = await db
      .from('pedidos')
      .update({
        pagamento_id: pix.pagamentoId,
        pagamento_qr_code: pix.qr_code_base64,
        pagamento_pix_copia_cola: pix.copia_cola,
        pagamento_expiracao: pix.expiracao,
        pagamento_status: 'pendente',
      })
      .eq('id', pedidoId)

    if (updErr) {
      console.error('[POST /api/pagamento/pix] erro ao salvar PIX:', updErr)
      // Mesmo se falhar a persistência, retorna o PIX para o cliente — webhook ainda funciona
    }

    return NextResponse.json({
      qr_code_base64: pix.qr_code_base64,
      copia_cola: pix.copia_cola,
      expiracao: pix.expiracao,
    })
  } catch (err: unknown) {
    console.error('[POST /api/pagamento/pix] exceção:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao gerar PIX' },
      { status: 500 }
    )
  }
}
