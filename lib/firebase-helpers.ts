import { db } from './firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export interface Produto {
  id: string
  nome: string
  slug: string
  categoria: string
  preco: number
  descricao: string
  ativo: boolean
  fotos: Array<{
    url: string
    alt: string
  }>
  criado_em?: string
  destaque?: boolean
  novo?: boolean
  mais_vendido?: boolean
}

export async function getProdutosFirebase(filtros?: {
  categoria?: string
  destaque?: boolean
  novo?: boolean
  mais_vendido?: boolean
  limite?: number
}): Promise<Produto[]> {
  try {
    const constraints = [where('ativo', '==', true)]

    if (filtros?.categoria) {
      constraints.push(where('categoria', '==', normalizeCategory(filtros.categoria)))
    }
    if (filtros?.destaque) {
      constraints.push(where('destaque', '==', true))
    }
    if (filtros?.novo) {
      constraints.push(where('novo', '==', true))
    }
    if (filtros?.mais_vendido) {
      constraints.push(where('mais_vendido', '==', true))
    }

    constraints.push(orderBy('criado_em', 'desc'))

    const q = query(collection(db, 'produtos'), ...constraints)
    const snapshot = await getDocs(q)

    let produtos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Produto[]

    if (filtros?.limite) {
      produtos = produtos.slice(0, filtros.limite)
    }

    return produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

export async function getCategorias() {
  try {
    const produtos = await getProdutosFirebase()
    const categoriasSet = new Set(produtos.map(p => p.categoria))

    return Array.from(categoriasSet).map((categoria, index) => ({
      id: String(index + 1),
      slug: normalizeSlug(categoria),
      nome: categoria,
      ativo: true,
      ordem: index
    }))
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'bonecos': 'Bonecos',
    'bolsas': 'Bolsas',
    'roupas': 'Roupas'
  }
  return categoryMap[category.toLowerCase()] || category
}

function normalizeSlug(category: string): string {
  return category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
