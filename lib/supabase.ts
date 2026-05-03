import { createClient } from '@supabase/supabase-js'
import type { Produto, Categoria, Pedido, Configuracao } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Helpers de query
export async function getProdutos(filtros?: {
  categoria?: string
  destaque?: boolean
  mais_vendido?: boolean
  limite?: number
}) {
  let query = supabase
    .from('produtos')
    .select('*, categoria:categorias(*), fotos:produto_fotos(*)')
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  if (filtros?.categoria) query = query.eq('categorias.slug', filtros.categoria)
  if (filtros?.destaque) query = query.eq('destaque', true)
  if (filtros?.mais_vendido) query = query.eq('mais_vendido', true)
  if (filtros?.limite) query = query.limit(filtros.limite)

  const { data, error } = await query
  if (error) throw error
  return data as Produto[]
}

export async function getProdutoPorSlug(slug: string) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*, categoria:categorias(*), fotos:produto_fotos(*)')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()
  if (error) throw error
  return data as Produto
}

export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('ativo', true)
    .order('ordem')
  if (error) throw error
  return data as Categoria[]
}

export async function getPedidoPorNumero(numero: string, email: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, itens:pedido_itens(*)')
    .eq('numero', numero)
    .eq('cliente_email', email)
    .single()
  if (error) throw error
  return data as Pedido
}

export async function getConfiguracoes() {
  const { data, error } = await supabase.from('configuracoes').select('*')
  if (error) throw error
  return Object.fromEntries((data as Configuracao[]).map(c => [c.chave, c.valor]))
}
