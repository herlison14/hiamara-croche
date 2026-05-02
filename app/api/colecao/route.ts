import { getProdutos } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limite = url.searchParams.get('limite') ? parseInt(url.searchParams.get('limite')!) : undefined
    const destaque = url.searchParams.get('destaque') === 'true'

    const produtos = await getProdutos({
      limite: limite || 4,
      destaque: destaque || false,
    })

    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
