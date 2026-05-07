export interface ProdutoData {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number | null
  imagem: string
  peso?: string
  materiais?: string
  tamanhos?: string[]
}

export interface CategoriaData {
  id: string
  nome: string
  nomeExibicao: string
  descricao: string
  produtos: ProdutoData[]
}
