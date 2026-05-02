import { getCategorias } from '@/lib/firebase-helpers'
import { fetchProdutoosAction } from '@/lib/produtos-actions'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const categoria = url.searchParams.get('categoria')
  const testQuery = url.searchParams.get('test')

  try {
    if (testQuery === 'all') {
      const todos = await fetchProdutoosAction({})
      return Response.json({
        test: 'all-products',
        count: todos.length,
        products: todos.map(p => ({
          id: p.id,
          nome: p.nome,
          categoria: p.categoria,
          ativo: p.ativo,
        })),
      })
    }

    if (categoria) {
      const filtered = await fetchProdutoosAction({ categoria })
      const todos = await fetchProdutoosAction({})

      return Response.json({
        test: `categoria-${categoria}`,
        requested: categoria,
        totalProducts: todos.length,
        filteredCount: filtered.length,
        categoriesInDb: [...new Set(todos.map(p => p.categoria))],
        filtered: filtered.map(p => ({
          id: p.id,
          nome: p.nome,
          categoria: p.categoria,
        })),
      })
    }

    const cats = await getCategorias()
    const todos = await fetchProdutoosAction({})

    return Response.json({
      test: 'overview',
      totalProducts: todos.length,
      categories: cats,
      allCategoriesInDb: [...new Set(todos.map(p => p.categoria))],
      sampleProducts: todos.slice(0, 3).map(p => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria,
        ativo: p.ativo,
      })),
    })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
