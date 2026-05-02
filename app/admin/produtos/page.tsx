'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, ImageIcon, Edit2, Power } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Produto } from '@/lib/types'

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Produto | undefined>()

  useEffect(() => { fetchProdutos() }, [])

  async function fetchProdutos() {
    setLoading(true)
    const { data } = await supabase
      .from('produtos')
      .select('*, categoria:categorias(*)')
      .order('criado_em', { ascending: false })
    setProdutos((data ?? []) as Produto[])
    setLoading(false)
  }

  async function toggleAtivo(produto: Produto) {
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''
    await fetch(`/api/produtos/${produto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminSecret}` },
      body: JSON.stringify({ ativo: !produto.ativo }),
    })
    setProdutos((prev) => prev.map((p) => p.id === produto.id ? { ...p, ativo: !p.ativo } : p))
  }

  const exibidos = busca
    ? produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : produtos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Produtos</h1>
        <button
          onClick={() => { setEditando(undefined); setShowForm(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <input value={busca} onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar produto..."
        className="w-full max-w-sm px-4 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84] bg-white" />

      <div className="bg-white border border-[#EDE0CD] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#8A7B7B]">Carregando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EFE6] border-b border-[#EDE0CD]">
              <tr>
                {['Produto', 'Categoria', 'Preço', 'Estoque', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#8A7B7B]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {exibidos.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFAF5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#F5EFE6] flex-shrink-0">
                        {p.imagem_principal ? (
                          <Image src={p.imagem_principal} alt={p.nome} fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#C97A84] text-lg">{p.nome[0]}</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#3D2B2B] line-clamp-1">{p.nome}</p>
                        <p className="text-xs text-[#8A7B7B]">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5C4A4A]">{p.categoria?.nome ?? '—'}</td>
                  <td className="px-4 py-3 font-medium text-[#A85A65]">R$ {Number(p.preco).toFixed(2).replace('.', ',')}</td>
                  <td className="px-4 py-3 text-[#5C4A4A]">{p.estoque}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditando(p); setShowForm(true) }}
                        className="p-1.5 text-[#8A7B7B] hover:text-[#C97A84] transition-colors" title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <Link href={`/admin/produtos/${p.id}/fotos`}
                        className="p-1.5 text-[#8A7B7B] hover:text-[#C97A84] transition-colors" title="Fotos">
                        <ImageIcon size={14} />
                      </Link>
                      <button onClick={() => toggleAtivo(p)}
                        className={cn('p-1.5 transition-colors', p.ativo ? 'text-green-500 hover:text-red-400' : 'text-gray-400 hover:text-green-500')} title="Ativar/Desativar">
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <ProductForm
          produto={editando}
          onSuccess={() => { setShowForm(false); fetchProdutos() }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
