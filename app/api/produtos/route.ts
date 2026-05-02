import { NextRequest, NextResponse } from 'next/server'
import { supabase, createServiceClient } from '@/lib/supabase'
import type { Produto } from '@/lib/types'

function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization')
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false
  return auth === `Bearer ${secret}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const destaque = searchParams.get('destaque')
    const mais_vendido = searchParams.get('mais_vendido')
    const limite = searchParams.get('limite')
    const busca = searchParams.get('busca')
    const pagina = parseInt(searchParams.get('pagina') ?? '1', 10)
    const porPagina = limite ? parseInt(limite, 10) : 20
    const offset = (pagina - 1) * porPagina

    let query = supabase
      .from('produtos')
      .select('*, categoria:categorias(*), fotos:produto_fotos(*)', { count: 'exact' })
      .eq('ativo', true)
      .order('criado_em', { ascending: false })
      .range(offset, offset + porPagina - 1)

    if (categoria) query = query.eq('categorias.slug', categoria)
    if (destaque === 'true') query = query.eq('destaque', true)
    if (mais_vendido === 'true') query = query.eq('mais_vendido', true)
    if (busca) query = query.ilike('nome', `%${busca}%`)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      data: data as Produto[],
      total: count ?? 0,
      pagina,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar produtos'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const {
      nome,
      slug,
      descricao,
      preco,
      preco_promocional,
      categoria_id,
      estoque,
      destaque,
      mais_vendido,
      variantes,
      tags,
      peso_gramas,
      tempo_producao_dias,
    } = body

    if (!nome || !slug || preco === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, slug, preco' },
        { status: 400 }
      )
    }

    const service = createServiceClient()
    const { data, error } = await service
      .from('produtos')
      .insert({
        nome,
        slug,
        descricao: descricao ?? null,
        preco,
        preco_promocional: preco_promocional ?? null,
        categoria_id: categoria_id ?? null,
        imagens: [],
        imagem_principal: null,
        estoque: estoque ?? 0,
        ativo: true,
        destaque: destaque ?? false,
        mais_vendido: mais_vendido ?? false,
        variantes: variantes ?? [],
        tags: tags ?? [],
        peso_gramas: peso_gramas ?? null,
        tempo_producao_dias: tempo_producao_dias ?? 7,
      })
      .select('*, categoria:categorias(*)')
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar produto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
