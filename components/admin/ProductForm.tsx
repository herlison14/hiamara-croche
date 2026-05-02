'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Produto, Categoria, Variante } from '@/lib/types'

interface ProductFormProps {
  produto?: Produto
  onSuccess: () => void
  onClose: () => void
}

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function ProductForm({ produto, onSuccess, onClose }: ProductFormProps) {
  const isEdit = !!produto
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [variantes, setVariantes] = useState<Variante[]>(produto?.variantes ?? [])
  const [tags, setTags] = useState<string[]>(produto?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    nome: produto?.nome ?? '',
    slug: produto?.slug ?? '',
    descricao: produto?.descricao ?? '',
    preco: produto?.preco?.toString() ?? '',
    preco_promocional: produto?.preco_promocional?.toString() ?? '',
    categoria_id: produto?.categoria_id ?? '',
    estoque: produto?.estoque?.toString() ?? '0',
    tempo_producao_dias: produto?.tempo_producao_dias?.toString() ?? '7',
    peso_gramas: produto?.peso_gramas?.toString() ?? '',
    ativo: produto?.ativo ?? true,
    destaque: produto?.destaque ?? false,
    mais_vendido: produto?.mais_vendido ?? false,
  })

  useEffect(() => {
    supabase.from('categorias').select('*').eq('ativo', true).order('ordem').then(({ data }) => {
      setCategorias((data ?? []) as Categoria[])
    })
  }, [])

  const handleNomeChange = (nome: string) => {
    setForm((prev) => ({ ...prev, nome, slug: isEdit ? prev.slug : slugify(nome) }))
  }

  const addVariante = () => setVariantes((prev) => [...prev, { nome: '', opcoes: [] }])
  const removeVariante = (i: number) => setVariantes((prev) => prev.filter((_, j) => j !== i))
  const updateVariante = (i: number, key: 'nome' | 'opcoes', val: string) => {
    setVariantes((prev) => prev.map((v, j) => j === i ? { ...v, [key]: key === 'opcoes' ? val.split(',').map((s) => s.trim()).filter(Boolean) : val } : v))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''
    const payload = {
      nome: form.nome,
      slug: form.slug,
      descricao: form.descricao || null,
      preco: parseFloat(form.preco),
      preco_promocional: form.preco_promocional ? parseFloat(form.preco_promocional) : null,
      categoria_id: form.categoria_id || null,
      estoque: parseInt(form.estoque),
      tempo_producao_dias: parseInt(form.tempo_producao_dias),
      peso_gramas: form.peso_gramas ? parseInt(form.peso_gramas) : null,
      ativo: form.ativo,
      destaque: form.destaque,
      mais_vendido: form.mais_vendido,
      variantes,
      tags,
    }

    try {
      const url = isEdit ? `/api/produtos/${produto.id}` : '/api/produtos'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminSecret}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro')
      toast.success(isEdit ? 'Produto atualizado!' : 'Produto criado!')
      onSuccess()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, name: keyof typeof form, type = 'text', required = false) => (
    <div>
      <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">{label}</label>
      <input
        type={type}
        value={form[name] as string}
        onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
        required={required}
        className="w-full px-3 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-[#8A7B7B] hover:text-[#3D2B2B]"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">Nome *</label>
            <input type="text" value={form.nome} onChange={(e) => handleNomeChange(e.target.value)} required
              className="w-full px-3 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
          </div>

          {field('Slug', 'slug', 'text', true)}

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={3}
              className="w-full px-3 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Preço (R$) *', 'preco', 'number', true)}
            {field('Preço Promocional', 'preco_promocional', 'number')}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">Categoria</label>
            <select value={form.categoria_id} onChange={(e) => setForm((p) => ({ ...p, categoria_id: e.target.value }))}
              className="w-full px-3 py-2.5 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]">
              <option value="">Sem categoria</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {field('Estoque', 'estoque', 'number')}
            {field('Prazo (dias)', 'tempo_producao_dias', 'number')}
            {field('Peso (g)', 'peso_gramas', 'number')}
          </div>

          <div className="flex gap-6">
            {[['ativo', 'Ativo'], ['destaque', 'Destaque'], ['mais_vendido', 'Mais Vendido']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-[#5C4A4A] cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                  className="accent-[#C97A84]" />
                {label}
              </label>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium uppercase tracking-widest text-[#8A7B7B]">Variantes</label>
              <button type="button" onClick={addVariante} className="text-xs text-[#C97A84] hover:underline flex items-center gap-1">
                <Plus size={12} /> Adicionar
              </button>
            </div>
            {variantes.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={v.nome} onChange={(e) => updateVariante(i, 'nome', e.target.value)}
                  placeholder="Nome (ex: Tamanho)" className="flex-1 px-3 py-2 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
                <input value={v.opcoes.join(', ')} onChange={(e) => updateVariante(i, 'opcoes', e.target.value)}
                  placeholder="Opções (P, M, G)" className="flex-1 px-3 py-2 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
                <button type="button" onClick={() => removeVariante(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Digite e pressione Enter"
                className="flex-1 px-3 py-2 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-[#F4C5CB] text-[#A85A65] rounded-lg text-sm">+</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F4C5CB] text-[#A85A65] text-xs rounded-full">
                  {t}
                  <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-[#EDE0CD] text-[#5C4A4A] text-sm font-medium rounded-lg hover:border-[#C97A84] transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-[#C97A84] hover:bg-[#A85A65] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
              {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
