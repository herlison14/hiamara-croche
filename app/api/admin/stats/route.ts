import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest) {
  return req.headers.get('Authorization') === `Bearer ${process.env.ADMIN_SECRET}`
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const db = createServiceClient()
  const hoje = new Date().toISOString().split('T')[0]
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [pedidosHoje, pedidosMes, produtos, todosPedidos] = await Promise.all([
    db.from('pedidos').select('id', { count: 'exact' }).gte('criado_em', `${hoje}T00:00:00`),
    db.from('pedidos').select('total').gte('criado_em', inicioMes).eq('pagamento_status', 'aprovado'),
    db.from('produtos').select('id', { count: 'exact' }).eq('ativo', true),
    db.from('pedidos').select('status, pagamento_status, total'),
  ])

  const receitaMes = (pedidosMes.data ?? []).reduce((sum, p) => sum + Number(p.total), 0)
  const receitaTotal = (todosPedidos.data ?? [])
    .filter((p) => p.pagamento_status === 'aprovado')
    .reduce((sum, p) => sum + Number(p.total), 0)

  const porStatus: Record<string, number> = {}
  for (const p of todosPedidos.data ?? []) {
    porStatus[p.status] = (porStatus[p.status] ?? 0) + 1
  }

  return NextResponse.json({
    total_pedidos: todosPedidos.data?.length ?? 0,
    pedidos_hoje: pedidosHoje.count ?? 0,
    receita_total: receitaTotal,
    receita_mes: receitaMes,
    produtos_ativos: produtos.count ?? 0,
    pedidos_aguardando: porStatus['aguardando_pagamento'] ?? 0,
    pedidos_por_status: porStatus,
  })
}
