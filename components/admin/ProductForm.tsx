'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEdit ? 'Editar Produto' : 'Novo Produto'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome" className="mb-1">Nome *</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug" className="mb-1">Slug *</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao" className="mb-1">Descrição</Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="preco" className="mb-1">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                value={form.preco}
                onChange={(e) => setForm((p) => ({ ...p, preco: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="preco_promocional" className="mb-1">Preço Promocional</Label>
              <Input
                id="preco_promocional"
                type="number"
                value={form.preco_promocional}
                onChange={(e) => setForm((p) => ({ ...p, preco_promocional: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoria" className="mb-1">Categoria</Label>
            <select
              id="categoria"
              value={form.categoria_id}
              onChange={(e) => setForm((p) => ({ ...p, categoria_id: e.target.value }))}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-secondary-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors duration-200"
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="estoque" className="mb-1">Estoque</Label>
              <Input
                id="estoque"
                type="number"
                value={form.estoque}
                onChange={(e) => setForm((p) => ({ ...p, estoque: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="prazo" className="mb-1">Prazo (dias)</Label>
              <Input
                id="prazo"
                type="number"
                value={form.tempo_producao_dias}
                onChange={(e) => setForm((p) => ({ ...p, tempo_producao_dias: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="peso" className="mb-1">Peso (g)</Label>
              <Input
                id="peso"
                type="number"
                value={form.peso_gramas}
                onChange={(e) => setForm((p) => ({ ...p, peso_gramas: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-6">
            {[['ativo', 'Ativo'], ['destaque', 'Destaque'], ['mais_vendido', 'Mais Vendido']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-secondary-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Variantes</Label>
              <button
                type="button"
                onClick={addVariante}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Adicionar
              </button>
            </div>
            {variantes.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={v.nome}
                  onChange={(e) => updateVariante(i, 'nome', e.target.value)}
                  placeholder="Nome (ex: Tamanho)"
                />
                <Input
                  value={v.opcoes.join(', ')}
                  onChange={(e) => updateVariante(i, 'opcoes', e.target.value)}
                  placeholder="Opções (P, M, G)"
                />
                <button
                  type="button"
                  onClick={() => removeVariante(i)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <Label className="mb-2 block">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Digite e pressione Enter"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTag}>+</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-rosa-100 text-rosa-600 text-xs rounded-full"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" size="md" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} size="md" className="flex-1">
              {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
