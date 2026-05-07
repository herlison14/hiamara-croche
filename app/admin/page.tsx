import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Package, Clock } from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { createServiceClient } from '@/lib/supabase'

export const metadata = { title: 'Dashboard — Admin HIAMARA CROCHÊ' }

const STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pgto',
  pago: 'Pago',
  em_producao: 'Em Produção',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const STATUS_CORES: Record<string, string> = {
  aguardando_pagamento: 'bg-yellow-100 text-yellow-700',
  pago: 'bg-green-100 text-green-700',
  em_producao: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
}

async function getStats() {
  const db = createServiceClient()
  const hoje = new Date().toISOString().split('T')[0]
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [pedidosHoje, pedidosMes, produtos, ultimos, todosPedidos] = await Promise.all([
    db.from('pedidos').select('id', { count: 'exact', head: true }).gte('criado_em', `${hoje}T00:00:00`),
    db.from('pedidos').select('total').gte('criado_em', inicioMes).eq('pagamento_status', 'aprovado'),
    db.from('produtos').select('id', { count: 'exact', head: true }).eq('ativo', true),
    db.from('pedidos').select('numero, cliente_nome, total, status, criado_em').order('criado_em', { ascending: false }).limit(5),
    db.from('pedidos').select('status'),
  ])

  const receitaMes = (pedidosMes.data ?? []).reduce((s, p) => s + Number(p.total), 0)
  const porStatus: Record<string, number> = {}
  for (const p of todosPedidos.data ?? []) porStatus[p.status] = (porStatus[p.status] ?? 0) + 1

  return {
    pedidosHoje: pedidosHoje.count ?? 0,
    receitaMes,
    produtosAtivos: produtos.count ?? 0,
    aguardando: porStatus['aguardando_pagamento'] ?? 0,
    ultimos: ultimos.data ?? [],
    porStatus,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-light text-texto-escuro">Dashboard</h1>
        <p className="text-sm text-texto-claro mt-1">Bem-vinda de volta!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard titulo="Pedidos Hoje" valor={stats.pedidosHoje} icone={<ShoppingBag size={18} />} cor="rosa" />
        <StatsCard
          titulo="Receita do Mês"
          valor={`R$ ${stats.receitaMes.toFixed(2).replace('.', ',')}`}
          icone={<span className="text-sm font-bold">R$</span>}
          cor="verde"
        />
        <StatsCard titulo="Produtos Ativos" valor={stats.produtosAtivos} icone={<Package size={18} />} cor="azul" />
        <StatsCard titulo="Aguard. Pagamento" valor={stats.aguardando} icone={<Clock size={18} />} cor="amarelo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-light text-texto-escuro">Últimos Pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-rosa-400 hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {stats.ultimos.length === 0 && <p className="text-sm text-texto-claro">Nenhum pedido ainda</p>}
            {stats.ultimos.map((p: { numero: string; cliente_nome: string; total: number; status: string; criado_em: string }) => (
              <div key={p.numero} className="flex items-center justify-between py-2 border-b border-creme-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-texto-escuro">{p.numero}</p>
                  <p className="text-xs text-texto-claro">{p.cliente_nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-rosa-500">R$ {Number(p.total).toFixed(2).replace('.', ',')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_CORES[p.status] ?? 'bg-creme-100 text-texto-claro'}`}>
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6">
          <h2 className="font-display text-xl font-light text-texto-escuro mb-4">Por Status</h2>
          <div className="space-y-3">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = stats.porStatus[key] ?? 0
              const total = Object.values(stats.porStatus).reduce((a, b) => a + b, 0)
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-texto-medio">{label}</span>
                    <span className="font-medium text-texto-escuro">{count}</span>
                  </div>
                  <div className="h-1.5 bg-creme-200 rounded-full">
                    <div className="h-1.5 bg-rosa-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/produtos" className="px-6 py-3 bg-rosa-400 hover:bg-rosa-500 text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300">
          + Novo Produto
        </Link>
        <Link href="/admin/pedidos" className="px-6 py-3 border border-creme-200 text-texto-medio hover:border-rosa-400 text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300">
          Ver Pedidos
        </Link>
      </div>
    </div>
  )
}
