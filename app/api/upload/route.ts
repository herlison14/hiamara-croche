import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  return req.headers.get('Authorization') === `Bearer ${process.env.ADMIN_SECRET}`
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('arquivo') as File | null
    const pasta = (formData.get('pasta') as string) ?? 'geral'

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) return NextResponse.json({ error: 'Arquivo muito grande (máx 10MB)' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 })

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const nome = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const db = createServiceClient()
    const arrayBuffer = await file.arrayBuffer()
    const { error } = await db.storage.from('produtos').upload(nome, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = db.storage.from('produtos').getPublicUrl(nome)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro no upload' }, { status: 500 })
  }
}
