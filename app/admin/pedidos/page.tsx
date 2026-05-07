'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Pedido, StatusPedido } from '@/lib/types'

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

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroStatus, setFiltroStatus] = useState('')
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)

  const adminHeaders = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''}` }

  useEffect(() => {
    fetch('/api/admin/stats', { headers: adminHeaders }).catch(() => {})
    fetchPedidos()
  }, [])

  async function fetchPedidos() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroStatus) params.set('status', filtroStatus)
    const res = await fetch(`/api/pedidos/admin?${params}`, { headers: adminHeaders }).catch(() => null)
    if (res?.ok) {
      const data = await res.json()
      setPedidos(data)
    } else {
      const db = await import('@/lib/supabase').then((m) => m.supabase)
      const { data } = await db.from('pedidos').select('*, itens:pedido_itens(*)').order('criado_em', { ascending: false }).limit(100)
      setPedidos((data ?? []) as Pedido[])
    }
    setLoading(false)
  }

  const exibidos = pedidos.filter((p) => {
    if (filtroStatus && p.status !== filtroStatus) return false
    if (busca && !p.numero.includes(busca) && !p.cliente_email.includes(busca) && !p.cliente_nome.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  async function atualizarStatus(pedidoId: string, novoStatus: StatusPedido) {
    await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''}` },
      body: JSON.stringify({ status: novoStatus }),
    })
    setPedidos((prev) => prev.map((p) => p.id === pedidoId ? { ...p, status: novoStatus } : p))
    if (selecionado?.id === pedidoId) setSelecionado((prev) => prev ? { ...prev, status: novoStatus } : null)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-light text-texto-escuro">Pedidos</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por número, nome ou e-mail..."
          className="flex-1 px-4 py-2.5 border border-creme-200 rounded-lg text-sm text-texto-medio focus:outline-none focus:border-rosa-300 bg-creme-50" />
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2.5 border border-creme-200 rounded-lg text-sm text-texto-medio bg-creme-50 focus:outline-none focus:border-rosa-300">
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-creme-50 border border-creme-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-texto-claro">Carregando...</div>
        ) : exibidos.length === 0 ? (
          <div className="p-8 text-center text-texto-claro">Nenhum pedido encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-creme-100 border-b border-creme-200">
              <tr>
                {['Número', 'Cliente', 'Data', 'Total', 'Pagamento', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-texto-claro">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-creme-100">
              {exibidos.map((p) => (
                <tr key={p.id} onClick={() => setSelecionado(p)} className="cursor-pointer hover:bg-creme-100/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-texto-escuro">{p.numero}</td>
                  <td className="px-4 py-3 text-texto-medio">{p.cliente_nome}</td>
                  <td className="px-4 py-3 text-texto-claro text-xs">{new Date(p.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 font-medium text-rosa-500">R$ {Number(p.total).toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', p.pagamento_status === 'aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                      {p.pagamento_status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', STATUS_CORES[p.status] ?? 'bg-creme-200 text-texto-claro')}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`https://wa.me/${p.cliente_telefone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs">
                      <MessageCircle size={14} /> WA
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selecionado && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelecionado(null)}>
          <div className="flex-1 bg-black/30" />
          <div className="w-full max-w-md bg-creme-50 h-full overflow-y-auto shadow-2xl p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-light text-texto-escuro">{selecionado.numero}</h2>
                <p className="text-xs text-texto-claro">{new Date(selecionado.criado_em).toLocaleString('pt-BR')}</p>
              </div>
              <button onClick={() => setSelecionado(null)} className="text-texto-claro hover:text-texto-escuro text-xl">×</button>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium text-texto-escuro">{selecionado.cliente_nome}</p>
              <p className="text-texto-claro">{selecionado.cliente_email}</p>
              {selecionado.cliente_telefone && <p className="text-texto-claro">{selecionado.cliente_telefone}</p>}
              {selecionado.endereco_cidade && (
                <p className="text-texto-claro">{selecionado.endereco_rua}, {selecionado.endereco_numero} — {selecionado.endereco_cidade}/{selecionado.endereco_estado}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-texto-claro">Alterar Status</label>
              <select
                value={selecionado.status}
                onChange={(e) => atualizarStatus(selecionado.id, e.target.value as StatusPedido)}
                className="w-full mt-1 px-4 py-2.5 border border-creme-200 rounded-lg text-sm text-texto-medio focus:outline-none focus:border-rosa-300 bg-creme-50"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="text-sm">
              <p className="text-texto-claro mb-1">Total: <span className="font-semibold text-rosa-500">R$ {Number(selecionado.total).toFixed(2).replace('.', ',')}</span></p>
              <p className="text-texto-claro">Pagamento: <span className={selecionado.pagamento_status === 'aprovado' ? 'text-green-600' : 'text-yellow-600'}>{selecionado.pagamento_status}</span></p>
            </div>

            {selecionado.cliente_telefone && (
              <a href={`https://wa.me/${selecionado.cliente_telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selecionado.cliente_nome}! Sobre seu pedido ${selecionado.numero}...`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 w-full justify-center py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
                <MessageCircle size={16} /> Contatar pelo WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
