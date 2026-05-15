import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createServiceClient } from '@/lib/supabase'
import { buscarPagamento } from '@/lib/mercadopago'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Valida a assinatura HMAC do webhook do Mercado Pago.
 * Referência: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 *
 * O header `x-signature` tem o formato:
 *   "ts=<timestamp>,v1=<hash hmac sha256>"
 *
 * O manifest assinado é construído como:
 *   id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 *
 * Em produção, MERCADOPAGO_WEBHOOK_SECRET é obrigatória — sem ela, recusamos o request.
 * Em dev (NEXT_PUBLIC_SITE_URL apontando para localhost), aceitamos sem assinatura
 * para permitir testes locais via curl.
 */
function validarAssinaturaMP(
  request: NextRequest,
  dataId: string,
  secret: string
): { valida: boolean; motivo?: string } {
  const sigHeader = request.headers.get('x-signature')
  const reqIdHeader = request.headers.get('x-request-id')

  if (!sigHeader || !reqIdHeader) {
    return { valida: false, motivo: 'headers ausentes' }
  }

  const partes = Object.fromEntries(
    sigHeader.split(',').map((p) => {
      const [k, v] = p.split('=').map((s) => s.trim())
      return [k, v]
    })
  )

  const ts = partes.ts
  const v1 = partes.v1
  if (!ts || !v1) return { valida: false, motivo: 'ts/v1 ausente' }

  const manifest = `id:${dataId};request-id:${reqIdHeader};ts:${ts};`
  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  try {
    const ok = crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(v1, 'hex'))
    return ok ? { valida: true } : { valida: false, motivo: 'hash mismatch' }
  } catch {
    return { valida: false, motivo: 'erro ao comparar hash' }
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // Eventos que não interessam: ignorar silenciosamente
  const action = body.action as string | undefined
  const type = body.type as string | undefined
  const isPaymentEvent =
    type === 'payment' || action === 'payment.updated' || action === 'payment.created'

  if (!isPaymentEvent) {
    return NextResponse.json({ ok: true })
  }

  const data = body.data as { id?: string | number } | undefined
  const pagamentoId = String(data?.id ?? body.id ?? '')
  if (!pagamentoId) return NextResponse.json({ ok: true })

  // Validação de assinatura (skip em dev local)
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  const isLocalDev =
    process.env.NODE_ENV !== 'production' &&
    (process.env.NEXT_PUBLIC_SITE_URL ?? '').includes('localhost')

  if (!secret && !isLocalDev) {
    console.error('[webhook MP] MERCADOPAGO_WEBHOOK_SECRET ausente em produção')
    return NextResponse.json({ error: 'webhook não configurado' }, { status: 503 })
  }

  if (secret) {
    const check = validarAssinaturaMP(request, pagamentoId, secret)
    if (!check.valida) {
      console.warn('[webhook MP] assinatura inválida:', check.motivo)
      return NextResponse.json({ error: 'assinatura inválida' }, { status: 401 })
    }
  }

  // Re-busca o pagamento na API do MP — não confiar no payload
  const pagamento = await buscarPagamento(pagamentoId)
  if (!pagamento) return NextResponse.json({ ok: true })

  const referencia = pagamento.external_reference as string | undefined
  if (!referencia) return NextResponse.json({ ok: true })

  const db = createServiceClient()

  // Sanity: confirma que o valor pago bate com o pedido
  const { data: pedido } = await db
    .from('pedidos')
    .select('id, total, pagamento_id, pagamento_status')
    .eq('id', referencia)
    .single()

  if (!pedido) {
    console.warn(`[webhook MP] pedido ${referencia} não encontrado`)
    return NextResponse.json({ ok: true })
  }

  // Idempotência: se já está aprovado, não reprocessa
  if (pedido.pagamento_status === 'aprovado' && pagamento.status === 'approved') {
    return NextResponse.json({ ok: true, idempotent: true })
  }

  const valorPago = Number(pagamento.transaction_amount ?? 0)
  const valorEsperado = Number(pedido.total)
  if (pagamento.status === 'approved' && Math.abs(valorPago - valorEsperado) > 0.01) {
    console.warn(
      `[webhook MP] valor divergente pedido=${valorEsperado} pago=${valorPago} (pedido ${referencia})`
    )
    return NextResponse.json({ error: 'valor divergente' }, { status: 422 })
  }

  if (pagamento.status === 'approved') {
    await db
      .from('pedidos')
      .update({
        status: 'pago',
        pagamento_status: 'aprovado',
        pagamento_id: pagamentoId,
        pagamento_confirmado_em: new Date().toISOString(),
      })
      .eq('id', referencia)
  } else if (pagamento.status === 'rejected' || pagamento.status === 'cancelled') {
    await db.from('pedidos').update({ pagamento_status: 'rejeitado' }).eq('id', referencia)
  } else if (pagamento.status === 'expired') {
    await db.from('pedidos').update({ pagamento_status: 'expirado' }).eq('id', referencia)
  }

  return NextResponse.json({ ok: true })
}

// GET para healthcheck simples
export async function GET() {
  return NextResponse.json({ ok: true, route: 'webhook mercado pago' })
}
