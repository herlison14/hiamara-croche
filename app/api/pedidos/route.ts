import { NextRequest, NextResponse } from 'next/server'
import { supabase, createServiceClient } from '@/lib/supabase'

function gerarNumeroPedido() {
  const d = new Date()
  const data = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `HC${data}${rand}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const numero = searchParams.get('numero')
  const email = searchParams.get('email')

  if (!numero || !email) {
    return NextResponse.json({ error: 'numero e email são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pedidos')
    .select('*, itens:pedido_itens(*)')
    .eq('numero', numero)
    .eq('cliente_email', email)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itens, cliente, endereco, observacoes } = body

    if (!itens?.length || !cliente?.nome || !cliente?.email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const db = createServiceClient()

    const produtoIds: string[] = itens.map((i: { produto_id: string }) => i.produto_id)
    const { data: produtos, error: prodErr } = await db
      .from('produtos')
      .select('id, nome, preco, preco_promocional, imagem_principal, estoque')
      .in('id', produtoIds)

    if (prodErr || !produtos) return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })

    let subtotal = 0
    const itensPedido = itens.map((item: { produto_id: string; quantidade: number; variante_selecionada?: Record<string, string> }) => {
      const p = produtos.find((x) => x.id === item.produto_id)
      if (!p) throw new Error(`Produto ${item.produto_id} não encontrado`)
      const preco = p.preco_promocional ?? p.preco
      const itemSubtotal = preco * item.quantidade
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

    const frete = subtotal >= 150 ? 0 : 25
    const total = subtotal + frete
    const numero = gerarNumeroPedido()

    const { data: pedido, error: pedErr } = await db
      .from('pedidos')
      .insert({
        numero,
        cliente_nome: cliente.nome,
        cliente_email: cliente.email,
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
      })
      .select()
      .single()

    if (pedErr || !pedido) return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })

    const { error: itensErr } = await db
      .from('pedido_itens')
      .insert(itensPedido.map((i: typeof itensPedido[0]) => ({ ...i, pedido_id: pedido.id })))

    if (itensErr) return NextResponse.json({ error: 'Erro ao salvar itens' }, { status: 500 })

    return NextResponse.json(pedido, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}
