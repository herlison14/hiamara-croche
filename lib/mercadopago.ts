import MercadoPago, { Payment } from 'mercadopago'

/**
 * Wrapper tipado em torno do SDK Mercado Pago v2.
 * Todo acesso ao SDK passa por aqui — facilita teste, mock e troca futura.
 */

let _client: MercadoPago | null = null

export function getMercadoPagoClient(): MercadoPago {
  if (_client) return _client
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'MERCADOPAGO_ACCESS_TOKEN não configurado. Defina no .env.local ou no Vercel.'
    )
  }
  _client = new MercadoPago({
    accessToken: token,
    options: {
      timeout: 8000,
    },
  })
  return _client
}

export interface CriarPixParams {
  valor: number
  descricao: string
  email: string
  nome: string
  referencia: string
  urlWebhook: string
  /** TTL do PIX em minutos (default 30) */
  ttlMinutos?: number
}

export interface PixResult {
  pagamentoId: string
  qr_code: string
  qr_code_base64: string
  copia_cola: string
  expiracao: string
  status: string
}

/**
 * Tipos mínimos da resposta do SDK MP que nos interessam.
 * O SDK não expõe esses campos via tipos públicos, então validamos manualmente.
 */
interface MPPaymentResponse {
  id?: string | number
  status?: string
  external_reference?: string
  transaction_amount?: number
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string
      qr_code_base64?: string
      ticket_url?: string
    }
  }
}

function parsePaymentResponse(raw: unknown): MPPaymentResponse {
  if (!raw || typeof raw !== 'object') return {}
  return raw as MPPaymentResponse
}

export async function criarPagamentoPix(params: CriarPixParams): Promise<PixResult> {
  if (!Number.isFinite(params.valor) || params.valor <= 0) {
    throw new Error('Valor do pagamento inválido')
  }
  if (!params.email || !params.referencia) {
    throw new Error('Email e referência são obrigatórios')
  }

  const client = getMercadoPagoClient()
  const payment = new Payment(client)

  const ttl = params.ttlMinutos ?? 30
  const expiracao = new Date(Date.now() + ttl * 60 * 1000).toISOString()

  const nomeParts = params.nome.trim().split(/\s+/)
  const firstName = nomeParts[0] || 'Cliente'
  const lastName = nomeParts.slice(1).join(' ') || 'Hiamara'

  let result: unknown
  try {
    result = await payment.create({
      body: {
        transaction_amount: Number(params.valor.toFixed(2)),
        description: params.descricao,
        payment_method_id: 'pix',
        payer: {
          email: params.email,
          first_name: firstName,
          last_name: lastName,
        },
        date_of_expiration: expiracao,
        external_reference: params.referencia,
        notification_url: params.urlWebhook,
      },
      requestOptions: {
        idempotencyKey: `pix-${params.referencia}`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    throw new Error(`Falha ao criar pagamento PIX: ${msg}`)
  }

  const parsed = parsePaymentResponse(result)
  const td = parsed.point_of_interaction?.transaction_data

  if (!parsed.id || !td?.qr_code) {
    throw new Error('Resposta do Mercado Pago sem QR code')
  }

  return {
    pagamentoId: String(parsed.id),
    qr_code: td.qr_code,
    qr_code_base64: td.qr_code_base64 ?? '',
    copia_cola: td.qr_code,
    expiracao,
    status: parsed.status ?? 'pending',
  }
}

export interface MPPaymentInfo {
  id: string
  status: string
  external_reference?: string
  transaction_amount?: number
}

export async function buscarPagamento(pagamentoId: string): Promise<MPPaymentInfo | null> {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)

  // Retry simples: 2 tentativas com backoff de 800ms
  let lastErr: unknown = null
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    try {
      const result = await payment.get({ id: pagamentoId })
      const parsed = parsePaymentResponse(result)
      if (!parsed.id) return null
      return {
        id: String(parsed.id),
        status: parsed.status ?? 'unknown',
        external_reference: parsed.external_reference,
        transaction_amount: parsed.transaction_amount,
      }
    } catch (err) {
      lastErr = err
      if (tentativa === 0) {
        await new Promise((r) => setTimeout(r, 800))
      }
    }
  }

  console.error('[buscarPagamento] falhou após retry:', lastErr)
  return null
}
