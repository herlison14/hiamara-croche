import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  return req.headers.get('Authorization') === `Bearer ${process.env.ADMIN_SECRET}`
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createServiceClient()
  const { data, error } = await db
    .from('produto_fotos')
    .select('*')
    .eq('produto_id', id)
    .order('ordem')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    const formData = await req.formData()
    const foto = formData.get('foto') as File | null
    if (!foto) return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(foto.type)) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    if (foto.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Arquivo muito grande' }, { status: 400 })

    const ext = foto.type === 'image/png' ? 'png' : foto.type === 'image/webp' ? 'webp' : 'jpg'
    const caminho = `${id}/${Date.now()}.${ext}`

    const db = createServiceClient()
    const buffer = await foto.arrayBuffer()
    const { error: upErr } = await db.storage.from('produtos').upload(caminho, buffer, { contentType: foto.type })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    const { data: urlData } = db.storage.from('produtos').getPublicUrl(caminho)
    const url = urlData.publicUrl

    const { data: fotoData, error: fotoErr } = await db
      .from('produto_fotos')
      .insert({ produto_id: id, url, alt: foto.name })
      .select()
      .single()
    if (fotoErr) return NextResponse.json({ error: fotoErr.message }, { status: 500 })

    const { data: existingFotos } = await db
      .from('produto_fotos')
      .select('url')
      .eq('produto_id', id)
      .order('criado_em')
      .limit(1)

    if (!existingFotos || existingFotos.length <= 1) {
      await db.from('produtos').update({ imagem_principal: url }).eq('id', id)
    }

    return NextResponse.json(fotoData, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro no upload' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const fotoId = searchParams.get('fotoId')
  if (!fotoId) return NextResponse.json({ error: 'fotoId obrigatório' }, { status: 400 })

  const db = createServiceClient()
  const { error } = await db.from('produto_fotos').delete().eq('id', fotoId).eq('produto_id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
