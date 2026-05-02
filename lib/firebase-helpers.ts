import { Produto, fetchProdutoosAction } from './produtos-actions'

export type { Produto }

export async function getCategorias() {
  try {
    const produtos = await fetchProdutoosAction()
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

function normalizeSlug(category: string): string {
  return category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
