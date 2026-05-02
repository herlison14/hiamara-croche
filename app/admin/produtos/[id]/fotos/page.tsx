'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Trash2, Star, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Produto, ProdutoFoto } from '@/lib/types'

export default function AdminProdutoFotosPage() {
  const params = useParams()
  const produtoId = params.id as string
  const [produto, setProduto] = useState<Produto | null>(null)
  const [fotos, setFotos] = useState<ProdutoFoto[]>([])
  const [previews, setPreviews] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progresso, setProgresso] = useState<Record<string, number>>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('produtos').select('*').eq('id', produtoId).single()
      setProduto(p as Produto)
      const { data: f } = await supabase.from('produto_fotos').select('*').eq('produto_id', produtoId).order('ordem')
      setFotos((f ?? []) as ProdutoFoto[])
    }
    load()
  }, [produtoId])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const validos = Array.from(files).filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024)
    setPreviews((prev) => [...prev, ...validos])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removerPreview = (i: number) => setPreviews((prev) => prev.filter((_, j) => j !== i))

  const uploadFotos = async () => {
    if (!previews.length) return
    setUploading(true)
    for (const file of previews) {
      const fd = new FormData()
      fd.append('foto', file)
      setProgresso((prev) => ({ ...prev, [file.name]: 10 }))
      try {
        const res = await fetch(`/api/produtos/${produtoId}/fotos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminSecret}` },
          body: fd,
        })
        if (res.ok) {
          const novaFoto = await res.json()
          setFotos((prev) => [...prev, novaFoto])
          setProgresso((prev) => ({ ...prev, [file.name]: 100 }))
        } else {
          toast.error(`Erro ao enviar ${file.name}`)
        }
      } catch {
        toast.error(`Falha ao enviar ${file.name}`)
      }
    }
    setPreviews([])
    setProgresso({})
    setUploading(false)
    toast.success('Fotos enviadas com sucesso!')
  }

  const removerFoto = async (fotoId: string) => {
    await fetch(`/api/produtos/${produtoId}/fotos?fotoId=${fotoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminSecret}` },
    })
    setFotos((prev) => prev.filter((f) => f.id !== fotoId))
    toast.success('Foto removida')
  }

  const definirPrincipal = async (url: string) => {
    await fetch(`/api/produtos/${produtoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminSecret}` },
      body: JSON.stringify({ imagem_principal: url }),
    })
    setProduto((prev) => prev ? { ...prev, imagem_principal: url } : null)
    toast.success('Imagem principal atualizada!')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos" className="text-[#8A7B7B] hover:text-[#C97A84]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
            Fotos: {produto?.nome ?? '...'}
          </h1>
          <p className="text-sm text-[#8A7B7B]">{fotos.length} foto{fotos.length !== 1 ? 's' : ''} adicionada{fotos.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#EDE0CD] hover:border-[#C97A84] rounded-2xl p-10 text-center cursor-pointer transition-colors group"
      >
        <Upload size={32} className="mx-auto text-[#C97A84] mb-3" />
        <p className="text-[#5C4A4A] font-medium">Arraste fotos aqui ou clique para selecionar</p>
        <p className="text-xs text-[#8A7B7B] mt-1">JPG, PNG, WEBP — máx. 10MB por arquivo</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {previews.map((file, i) => (
              <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F5EFE6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                <button onClick={() => removerPreview(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                  ×
                </button>
                {progresso[file.name] !== undefined && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/50">
                    <div className="h-full bg-[#C97A84] transition-all" style={{ width: `${progresso[file.name]}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={uploadFotos}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-[#C97A84] hover:bg-[#A85A65] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Upload size={16} />
            {uploading ? 'Enviando...' : `Enviar ${previews.length} foto${previews.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Fotos existentes */}
      {fotos.length > 0 && (
        <div>
          <h2 className="text-lg font-light text-[#3D2B2B] mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>
            Fotos do Produto
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {fotos.map((foto) => {
              const isPrincipal = foto.url === produto?.imagem_principal
              return (
                <div key={foto.id} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F5EFE6] group">
                  <Image src={foto.url} alt={foto.alt ?? 'foto'} fill className="object-cover" sizes="150px" />

                  {isPrincipal && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#C97A84] text-white text-[9px] rounded-full font-medium">
                      Principal
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isPrincipal && (
                      <button onClick={() => definirPrincipal(foto.url)}
                        className="w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center hover:bg-yellow-500" title="Definir como principal">
                        <Star size={14} />
                      </button>
                    )}
                    <button onClick={() => removerFoto(foto.id)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600" title="Remover">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
