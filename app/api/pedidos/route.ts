import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function gerarNumeroPedido() {
  const d = new Date()
  const data = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `HC${data}${rand}`
}

interface ItemEntrada {
  produto_id: string
  quantidade: number
  variante_selecionada?: Record<string, string>
}

interface ClienteEntrada {
  nome: string
  email: string
  telefone?: string
}

interface EnderecoEntrada {
  cep?: string
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Hash idempotente baseado em email + carrinho + janela de 10 minutos.
 * Requisições duplicadas dentro dessa janela reaproveitam o mesmo pedido.
 */
function calcularChaveIdempotencia(email: string, itens: ItemEntrada[]) {
  const itensOrdenados = [...itens].sort((a, b) =>
    a.produto_id.localeCompare(b.produto_id)
  )
  const carrinho = itensOrdenados
    .map(
      (i) =>
        `${i.produto_id}:${i.quantidade}:${JSON.stringify(i.variante_selecionada ?? {})}`
    )
    .join('|')

  // janela de 10 minutos
  const janela = Math.floor(Date.now() / (10 * 60 * 1000))
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}::${carrinho}::${janela}`)
    .digest('hex')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const numero = searchParams.get('numero')
  const email = searchParams.get('email')

  if (!numero || !email) {
    return NextResponse.json({ error: 'numero e email são obrigatórios' }, { status: 400 })
  }

  if (!emailValido(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('pedidos')
    .select(
      // Seleção restrita: não expõe pagamento_id externo do MP nem QR base64
      'id, numero, status, cliente_nome, cliente_email, cliente_telefone, ' +
        'endereco_cep, endereco_rua, endereco_numero, endereco_complemento, ' +
        'endereco_bairro, endereco_cidade, endereco_estado, ' +
        'subtotal, frete, total, ' +
        'pagamento_metodo, pagamento_status, pagamento_qr_code, ' +
        'pagamento_pix_copia_cola, pagamento_expiracao, pagamento_confirmado_em, ' +
        'observacoes, criado_em, atualizado_em, ' +
        'itens:pedido_itens(id, produto_id, produto_nome, produto_imagem, ' +
        'variante_selecionada, quantidade, preco_unitario, subtotal)'
    )
    .eq('numero', numero)
    .eq('cliente_email', email.toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('[GET /api/pedidos] erro:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const itens = body.itens as ItemEntrada[] | undefined
    const cliente = body.cliente as ClienteEntrada | undefined
    const endereco = body.endereco as EnderecoEntrada | undefined
    const observacoes = body.observacoes as string | undefined

    if (!itens?.length || !cliente?.nome?.trim() || !cliente?.email?.trim()) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    if (!emailValido(cliente.email)) {
      return NextResponse.json({ error: 'email inválido' }, { status: 400 })
    }

    // Sanitiza quantidades
    for (const i of itens) {
      if (
        !i.produto_id ||
        typeof i.quantidade !== 'number' ||
        i.quantidade <= 0 ||
        i.quantidade > 50
      ) {
        return NextResponse.json({ error: 'Quantidade inválida' }, { status: 400 })
      }
    }

    const emailNorm = cliente.email.trim().toLowerCase()
    const chaveIdempotencia = calcularChaveIdempotencia(emailNorm, itens)

    const db = createServiceClient()

    // Tenta reaproveitar pedido idempotente recente (mesma chave, ainda pendente)
    const { data: existente } = await db
      .from('pedidos')
      .select('*')
      .eq('idempotency_key', chaveIdempotencia)
      .maybeSingle()

    if (existente) {
      return NextResponse.json(existente, { status: 200 })
    }

    const produtoIds = itens.map((i) => i.produto_id)
    const { data: produtos, error: prodErr } = await db
      .from('produtos')
      .select('id, nome, preco, preco_promocional, imagem_principal, estoque, ativo')
      .in('id', produtoIds)

    if (prodErr || !produtos) {
      return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
    }

    let subtotal = 0
    const itensPedido = itens.map((item) => {
      const p = produtos.find((x) => x.id === item.produto_id)
      if (!p || !p.ativo) {
        throw new Error(`Produto ${item.produto_id} indisponível`)
      }
      const preco = Number(p.preco_promocional ?? p.preco)
      const itemSubtotal = Number((preco * item.quantidade).toFixed(2))
      subtotal += itemSubtotal
      return {
        produto_id: item.produto_id,
        produto_nome: p.nome,
        produto_imagem: p.imagem_principal,
        variante_selecionada: item.variante_selecionada ?? null,
        quantidade: item.quantidade,
        preco_unitario: preco,
        subtotal: itemSubtotal,
      }
    })

    subtotal = Number(subtotal.toFixed(2))
    const frete = subtotal >= 150 ? 0 : 25
    const total = Number((subtotal + frete).toFixed(2))
    const numero = gerarNumeroPedido()

    const { data: pedido, error: pedErr } = await db
      .from('pedidos')
      .insert({
        numero,
        cliente_nome: cliente.nome.trim(),
        cliente_email: emailNorm,
        cliente_telefone: cliente.telefone ?? null,
        endereco_cep: endereco?.cep ?? null,
        endereco_rua: endereco?.rua ?? null,
        endereco_numero: endereco?.numero ?? null,
        endereco_complemento: endereco?.complemento ?? null,
        endereco_bairro: endereco?.bairro ?? null,
        endereco_cidade: endereco?.cidade ?? null,
        endereco_estado: endereco?.estado ?? null,
        subtotal,
        frete,
        total,
        observacoes: observacoes ?? null,
        idempotency_key: chaveIdempotencia,
      })
      .select()
      .single()

    if (pedErr || !pedido) {
      // Caso a constraint UNIQUE em idempotency_key dispare, refaz busca
      if (pedErr?.code === '23505') {
        const { data: dup } = await db
          .from('pedidos')
          .select('*')
          .eq('idempotency_key', chaveIdempotencia)
          .maybeSingle()
        if (dup) return NextResponse.json(dup, { status: 200 })
      }
      console.error('[POST /api/pedidos] erro ao inserir pedido:', pedErr)
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
    }

    const { error: itensErr } = await db
      .from('pedido_itens')
      .insert(itensPedido.map((i) => ({ ...i, pedido_id: pedido.id })))

    if (itensErr) {
      console.error('[POST /api/pedidos] erro ao inserir itens:', itensErr)
      // Rollback básico: apaga o pedido
      await db.from('pedidos').delete().eq('id', pedido.id)
      return NextResponse.json({ error: 'Erro ao salvar itens' }, { status: 500 })
    }

    return NextResponse.json(pedido, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/pedidos] exceção:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
