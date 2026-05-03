'use server'

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gen-lang-client-0592600232'
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''

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

function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'bonecos': 'Bonecos',
    'bolsas': 'Bolsas',
    'roupas': 'Roupas'
  }
  return categoryMap[category.toLowerCase()] || category
}

function firestoreDocToProduct(doc: any): Produto {
  const fields = doc.fields || {}
  return {
    id: doc.name.split('/').pop(),
    nome: fields.nome?.stringValue || '',
    slug: fields.slug?.stringValue || '',
    categoria: fields.categoria?.stringValue || '',
    preco: fields.preco?.doubleValue || 0,
    descricao: fields.descricao?.stringValue || '',
    ativo: fields.ativo?.booleanValue ?? false,
    fotos: (fields.fotos?.arrayValue?.values || []).map((f: any) => ({
      url: f.mapValue?.fields?.url?.stringValue || '',
      alt: f.mapValue?.fields?.alt?.stringValue || '',
    })),
    criado_em: fields.criado_em?.timestampValue,
    destaque: fields.destaque?.booleanValue,
    novo: fields.novo?.booleanValue,
    mais_vendido: fields.mais_vendido?.booleanValue,
  }
}

export async function fetchProdutoosAction(filtros?: {
  categoria?: string
  destaque?: boolean
  novo?: boolean
  mais_vendido?: boolean
  limite?: number
}): Promise<Produto[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/produtos?key=${FIREBASE_API_KEY}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`[Firebase REST] Error: ${response.status}`)
      return []
    }

    const data = await response.json()
    let documents = (data.documents || []).map(firestoreDocToProduct)

    if (filtros?.categoria) {
      const normalized = normalizeCategory(filtros.categoria)
      documents = documents.filter((d: Produto) => d.categoria === normalized)
    }
    if (filtros?.destaque) {
      documents = documents.filter((d: Produto) => d.destaque === true)
    }
    if (filtros?.novo) {
      documents = documents.filter((d: Produto) => d.novo === true)
    }
    if (filtros?.mais_vendido) {
      documents = documents.filter((d: Produto) => d.mais_vendido === true)
    }

    documents.sort((a: Produto, b: Produto) => {
      const dateA = new Date(a.criado_em || 0).getTime()
      const dateB = new Date(b.criado_em || 0).getTime()
      return dateB - dateA
    })

    if (filtros?.limite) {
      documents = documents.slice(0, filtros.limite)
    }

    return documents
  } catch (error) {
    console.error('[fetchProdutosAction] Error:', error)
    return []
  }
}
