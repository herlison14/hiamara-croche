export interface Categoria {
  id: string
  nome: string
  slug: string
  descricao: string | null
  imagem_url: string | null
  ordem: number
  ativo: boolean
  criado_em: string
}

export interface Variante {
  nome: string
  opcoes: string[]
}

export interface Produto {
  id: string
  nome: string
  slug: string
  descricao: string | null
  preco: number
  preco_promocional: number | null
  categoria_id: string | null
  categoria?: Categoria
  imagens: string[]
  imagem_principal: string | null
  estoque: number
  ativo: boolean
  destaque: boolean
  mais_vendido: boolean
  variantes: Variante[]
  tags: string[]
  peso_gramas: number | null
  tempo_producao_dias: number
  criado_em: string
  atualizado_em: string
  fotos?: ProdutoFoto[]
}

export interface ProdutoFoto {
  id: string
  produto_id: string
  url: string
  alt: string | null
  ordem: number
  criado_em: string
}

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
  variante_selecionada?: Record<string, string>
}

export interface EnderecoEntrega {
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
}

export interface PedidoItem {
  id: string
  pedido_id: string
  produto_id: string
  produto_nome: string
  produto_imagem: string | null
  variante_selecionada: Record<string, string> | null
  quantidade: number
  preco_unitario: number
  subtotal: number
}

export type StatusPedido =
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_producao'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export type StatusPagamento = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado'

export interface Pedido {
  id: string
  numero: string
  status: StatusPedido
  cliente_nome: string
  cliente_email: string
  cliente_telefone: string | null
  endereco_cep: string | null
  endereco_rua: string | null
  endereco_numero: string | null
  endereco_complemento: string | null
  endereco_bairro: string | null
  endereco_cidade: string | null
  endereco_estado: string | null
  subtotal: number
  frete: number
  total: number
  pagamento_metodo: string
  pagamento_status: StatusPagamento
  pagamento_id: string | null
  pagamento_qr_code: string | null
  pagamento_pix_copia_cola: string | null
  pagamento_expiracao: string | null
  pagamento_confirmado_em: string | null
  observacoes: string | null
  criado_em: string
  atualizado_em: string
  itens?: PedidoItem[]
}

export interface Configuracao {
  id: string
  chave: string
  valor: string | null
  descricao: string | null
}

export interface DadosCheckout {
  nome: string
  email: string
  telefone: string
  endereco: EnderecoEntrega
  observacoes?: string
}
