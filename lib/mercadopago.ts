import MercadoPago, { Payment } from 'mercadopago'

export function getMercadoPagoClient(): MercadoPago {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado')
  }
  return new MercadoPago({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
}

export interface CriarPixParams {
  valor: number
  descricao: string
  email: string
  nome: string
  referencia: string
  urlWebhook: string
}

export interface PixResult {
  pagamentoId: string
  qr_code: string
  qr_code_base64: string
  copia_cola: string
  expiracao: string
  status: string
}

export async function criarPagamentoPix(params: CriarPixParams): Promise<PixResult> {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)

  const expiracao = new Date(Date.now() + 30 * 60 * 1000).toISOString()

  const nomeParts = params.nome.trim().split(' ')
  const firstName = nomeParts[0] ?? ''
  const lastName = nomeParts.slice(1).join(' ') || firstName

  const result = await payment.create({
    body: {
      transaction_amount: params.valor,
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
  })

  const pointOfInteraction = (result as unknown as Record<string, unknown>).point_of_interaction as
    | Record<string, unknown>
    | undefined
  const transactionData = pointOfInteraction?.transaction_data as
    | Record<string, unknown>
    | undefined

  const qrCode = (transactionData?.qr_code as string) ?? ''
  const qrCodeBase64 = (transactionData?.qr_code_base64 as string) ?? ''

  if (!result.id) {
    throw new Error('Falha ao gerar pagamento PIX: ID não retornado')
  }

  return {
    pagamentoId: String(result.id),
    qr_code: qrCode,
    qr_code_base64: qrCodeBase64,
    copia_cola: qrCode,
    expiracao,
    status: result.status ?? 'pending',
  }
}

export async function buscarPagamento(pagamentoId: string) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)
  const result = await payment.get({ id: Number(pagamentoId) })
  return result
}
