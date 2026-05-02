'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, ChevronDown } from 'lucide-react'
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

const TODOS_STATUS = ['', ...Object.keys(STATUS_LABELS)]

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
      <h1 className="text-3xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Pedidos</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por número, nome ou e-mail..."
          className="flex-1 px-4 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84] bg-white" />
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] bg-white focus:outline-none focus:border-[#C97A84]">
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white border border-[#EDE0CD] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#8A7B7B]">Carregando...</div>
        ) : exibidos.length === 0 ? (
          <div className="p-8 text-center text-[#8A7B7B]">Nenhum pedido encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EFE6] border-b border-[#EDE0CD]">
              <tr>
                {['Número', 'Cliente', 'Data', 'Total', 'Pagamento', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#8A7B7B]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {exibidos.map((p) => (
                <tr key={p.id} onClick={() => setSelecionado(p)} className="cursor-pointer hover:bg-[#FDFAF5] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#3D2B2B]">{p.numero}</td>
                  <td className="px-4 py-3 text-[#5C4A4A]">{p.cliente_nome}</td>
                  <td className="px-4 py-3 text-[#8A7B7B] text-xs">{new Date(p.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 font-medium text-[#A85A65]">R$ {Number(p.total).toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', p.pagamento_status === 'aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                      {p.pagamento_status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', STATUS_CORES[p.status] ?? 'bg-gray-100 text-gray-600')}>
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

      {/* Drawer de detalhe */}
      {selecionado && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelecionado(null)}>
          <div className="flex-1 bg-black/30" />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
                  {selecionado.numero}
                </h2>
                <p className="text-xs text-[#8A7B7B]">{new Date(selecionado.criado_em).toLocaleString('pt-BR')}</p>
              </div>
              <button onClick={() => setSelecionado(null)} className="text-[#8A7B7B] hover:text-[#3D2B2B] text-xl">×</button>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium text-[#3D2B2B]">{selecionado.cliente_nome}</p>
              <p className="text-[#8A7B7B]">{selecionado.cliente_email}</p>
              {selecionado.cliente_telefone && <p className="text-[#8A7B7B]">{selecionado.cliente_telefone}</p>}
              {selecionado.endereco_cidade && (
                <p className="text-[#8A7B7B]">{selecionado.endereco_rua}, {selecionado.endereco_numero} — {selecionado.endereco_cidade}/{selecionado.endereco_estado}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#8A7B7B]">Alterar Status</label>
              <select
                value={selecionado.status}
                onChange={(e) => atualizarStatus(selecionado.id, e.target.value as StatusPedido)}
                className="w-full mt-1 px-4 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div className="text-sm">
              <p className="text-[#8A7B7B] mb-1">Total: <span className="font-semibold text-[#A85A65]">R$ {Number(selecionado.total).toFixed(2).replace('.', ',')}</span></p>
              <p className="text-[#8A7B7B]">Pagamento: <span className={selecionado.pagamento_status === 'aprovado' ? 'text-green-600' : 'text-yellow-600'}>{selecionado.pagamento_status}</span></p>
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
