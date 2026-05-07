'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { OrderStatusTracker } from '@/components/store/OrderStatusTracker'
import type { Pedido, StatusPedido } from '@/lib/types'
import toast from 'react-hot-toast'

const STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pagamento',
  pago: 'Pago',
  em_producao: 'Em Produção',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export default function AdminPedidoDetalhePage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''

  useEffect(() => {
    fetch(`/api/pedidos/${id}`, { headers: { Authorization: `Bearer ${adminSecret}` } })
      .then((r) => r.json())
      .then((data) => { setPedido(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const atualizarStatus = async (novoStatus: StatusPedido) => {
    const res = await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminSecret}` },
      body: JSON.stringify({ status: novoStatus }),
    })
    if (res.ok) {
      setPedido((prev) => prev ? { ...prev, status: novoStatus } : null)
      toast.success('Status atualizado!')
    } else {
      toast.error('Erro ao atualizar status')
    }
  }

  if (loading) return <div className="p-8 text-center text-texto-claro">Carregando...</div>
  if (!pedido) return <div className="p-8 text-center text-texto-claro">Pedido não encontrado</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/pedidos" className="text-texto-claro hover:text-rosa-400 transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-display text-3xl font-light text-texto-escuro">
            Pedido {pedido.numero}
          </h1>
          <p className="text-sm text-texto-claro">{new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-5 space-y-2">
          <h2 className="text-sm font-medium uppercase tracking-widest text-texto-claro">Cliente</h2>
          <p className="font-medium text-texto-escuro">{pedido.cliente_nome}</p>
          <p className="text-sm text-texto-medio">{pedido.cliente_email}</p>
          {pedido.cliente_telefone && <p className="text-sm text-texto-medio">{pedido.cliente_telefone}</p>}
        </div>

        {pedido.endereco_cidade && (
          <div className="bg-creme-50 border border-creme-200 rounded-2xl p-5 space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-widest text-texto-claro">Endereço</h2>
            <p className="text-sm text-texto-medio">{pedido.endereco_rua}, {pedido.endereco_numero}</p>
            {pedido.endereco_complemento && <p className="text-sm text-texto-medio">{pedido.endereco_complemento}</p>}
            <p className="text-sm text-texto-medio">{pedido.endereco_bairro} — {pedido.endereco_cidade}/{pedido.endereco_estado}</p>
            <p className="text-sm text-texto-medio">CEP: {pedido.endereco_cep}</p>
          </div>
        )}
      </div>

      <div className="bg-creme-50 border border-creme-200 rounded-2xl p-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-texto-claro mb-4">Status do Pedido</h2>
        <OrderStatusTracker status={pedido.status} />
        <div className="mt-5 pt-5 border-t border-creme-200">
          <label className="text-xs font-medium uppercase tracking-widest text-texto-claro">Alterar Status</label>
          <select
            value={pedido.status}
            onChange={(e) => atualizarStatus(e.target.value as StatusPedido)}
            className="w-full mt-1 px-4 py-2.5 border border-creme-200 rounded-lg text-sm text-texto-medio focus:outline-none focus:border-rosa-300 bg-creme-50"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {pedido.itens && pedido.itens.length > 0 && (
        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-widest text-texto-claro">Itens</h2>
          {pedido.itens.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-creme-100 last:border-0">
              <div>
                <p className="font-medium text-texto-escuro">{item.produto_nome}</p>
                {item.variante_selecionada && (
                  <p className="text-xs text-texto-claro">
                    {Object.entries(item.variante_selecionada).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
                <p className="text-xs text-texto-claro">Qtd: {item.quantidade}</p>
              </div>
              <p className="font-medium text-rosa-500">R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}</p>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <span className="font-medium text-texto-escuro">Total</span>
            <span className="font-display text-xl font-light text-rosa-500">
              R$ {Number(pedido.total).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      )}

      <div className="bg-creme-50 border border-creme-200 rounded-2xl p-5 space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-widest text-texto-claro">Pagamento</h2>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${pedido.pagamento_status === 'aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {pedido.pagamento_status}
          </span>
          {pedido.pagamento_id && <span className="text-xs text-texto-claro">ID: {pedido.pagamento_id}</span>}
        </div>
        {pedido.pagamento_confirmado_em && (
          <p className="text-xs text-texto-claro">Confirmado em: {new Date(pedido.pagamento_confirmado_em).toLocaleString('pt-BR')}</p>
        )}
      </div>

      {pedido.cliente_telefone && (
        <a href={`https://wa.me/${pedido.cliente_telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${pedido.cliente_nome}! Aqui é a Hiamara Crochê. Sobre seu pedido ${pedido.numero}...`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 w-full justify-center py-3.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors">
          <MessageCircle size={18} /> Contatar Cliente pelo WhatsApp
        </a>
      )}
    </div>
  )
}
