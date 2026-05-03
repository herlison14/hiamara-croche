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

// Mapeamento de imagens para produtos
const produtosPorCategoria: Record<string, ProdutoData[]> = {
  blusa: [
    {
      id: 'blusa-amarela-1',
      nome: 'Blusa Amarela Summer',
      descricao: 'Blusa de crochê em tons quentes, perfeita para o verão',
      categoria: 'blusa',
      preco: 89.90,
      imagem: 'blusa_amarela-summer_1_pro.png',
      materiais: 'Fio 100% algodão',
      tamanhos: ['P', 'M', 'G', 'GG']
    },
    {
      id: 'blusa-amarela-2',
      nome: 'Blusa Amarela Summer',
      descricao: 'Variação da blusa em amarelo',
      categoria: 'blusa',
      preco: 89.90,
      imagem: 'blusa_amarela-summer_2_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'blusa-premium-1',
      nome: 'Blusa Premium Designs',
      descricao: 'Design exclusivo com detalhes premium',
      categoria: 'blusa',
      preco: 129.90,
      imagem: 'blusa_premium-designs_1_pro.png',
      materiais: 'Fio mercerizado'
    },
    {
      id: 'blusa-premium-2',
      nome: 'Blusa Premium Designs',
      descricao: 'Variação de design premium',
      categoria: 'blusa',
      preco: 129.90,
      imagem: 'blusa_premium-designs_2_pro.png'
    },
    {
      id: 'blusa-rosa-1',
      nome: 'Blusa Rosa Pastel',
      descricao: 'Blusa delicada em tons pastel',
      categoria: 'blusa',
      preco: 99.90,
      imagem: 'blusa_rosa-pastel_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'blusa-rosa-2',
      nome: 'Blusa Rosa Pastel',
      descricao: 'Variação rosa pastel',
      categoria: 'blusa',
      preco: 99.90,
      imagem: 'blusa_rosa-pastel_2_pro.png'
    },
    {
      id: 'blusa-turquesa-1',
      nome: 'Blusa Turquesa Rendada',
      descricao: 'Blusa com detalhes rendados em turquesa',
      categoria: 'blusa',
      preco: 119.90,
      imagem: 'blusa_turquesa-rendada_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'blusa-turquesa-2',
      nome: 'Blusa Turquesa Rendada',
      descricao: 'Variação rendada turquesa',
      categoria: 'blusa',
      preco: 119.90,
      imagem: 'blusa_turquesa-rendada_2_pro.png'
    }
  ],

  bolsa: [
    {
      id: 'bolsa-flores-1',
      nome: 'Bolsa Flores Brancas',
      descricao: 'Bolsa com padrão floral branco',
      categoria: 'bolsa',
      preco: 79.90,
      imagem: 'bolsa_flores-brancas_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'bolsa-multicolor-1',
      nome: 'Bolsa Multicolor',
      descricao: 'Bolsa colorida com padrão multicolor',
      categoria: 'bolsa',
      preco: 89.90,
      imagem: 'bolsa_multicolor_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'bolsa-premium-1',
      nome: 'Bolsa Premium Cores',
      descricao: 'Bolsa premium em cores variadas',
      categoria: 'bolsa',
      preco: 119.90,
      imagem: 'bolsa_premium-cores_1_pro.png',
      materiais: 'Fio mercerizado'
    },
    {
      id: 'bolsa-premium-2',
      nome: 'Bolsa Premium Cores',
      descricao: 'Variação premium de cores',
      categoria: 'bolsa',
      preco: 119.90,
      imagem: 'bolsa_premium-cores_2_pro.png'
    },
    {
      id: 'bolsa-sacola-1',
      nome: 'Bolsa Sacola Grande',
      descricao: 'Bolsa grande tipo sacola',
      categoria: 'bolsa',
      preco: 99.90,
      imagem: 'bolsa_sacola-grande_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'bolsa-sacola-2',
      nome: 'Bolsa Sacola Grande',
      descricao: 'Variação de sacola grande',
      categoria: 'bolsa',
      preco: 99.90,
      imagem: 'bolsa_sacola-grande_2_pro.png'
    }
  ],

  amigurumi: [
    {
      id: 'amigurumi-anime-1',
      nome: 'Amigurumi Anime Diversos',
      descricao: 'Personagens diversos do universo anime',
      categoria: 'amigurumi',
      preco: 49.90,
      imagem: 'amigurumi_anime-diversos_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'amigurumi-anime-2',
      nome: 'Amigurumi Anime Diversos',
      descricao: 'Variação de personagens anime',
      categoria: 'amigurumi',
      preco: 49.90,
      imagem: 'amigurumi_anime-diversos_2_pro.png'
    },
    {
      id: 'amigurumi-personagens-1',
      nome: 'Amigurumi Personagens Variados',
      descricao: 'Personagens variados em forma de amigurumi',
      categoria: 'amigurumi',
      preco: 54.90,
      imagem: 'amigurumi_personagens-variados_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'amigurumi-personagens-2',
      nome: 'Amigurumi Personagens Variados',
      descricao: 'Variação de personagens',
      categoria: 'amigurumi',
      preco: 54.90,
      imagem: 'amigurumi_personagens-variados_2_pro.png'
    },
    {
      id: 'amigurumi-naruto-1',
      nome: 'Amigurumi Naruto Ninja',
      descricao: 'Personagens de Naruto em crochê',
      categoria: 'amigurumi',
      preco: 59.90,
      imagem: 'amigurumi_naruto-ninja_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'amigurumi-naruto-2',
      nome: 'Amigurumi Naruto Ninja',
      descricao: 'Variação personagem Naruto',
      categoria: 'amigurumi',
      preco: 59.90,
      imagem: 'amigurumi_naruto-ninja_2_pro.png'
    },
    {
      id: 'amigurumi-boneco-1',
      nome: 'Amigurumi Boneco Rosa',
      descricao: 'Boneco rosa em crochê',
      categoria: 'amigurumi',
      preco: null,
      imagem: 'amigurumi_boneco-rosa_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'amigurumi-boneco-2',
      nome: 'Amigurumi Boneco Rosa',
      descricao: 'Variação de boneco rosa',
      categoria: 'amigurumi',
      preco: null,
      imagem: 'amigurumi_boneco-rosa_2_pro.png'
    }
  ],

  cozinha: [
    {
      id: 'cozinha-jogo-floral-1',
      nome: 'Jogo Cozinha Floral',
      descricao: 'Jogo de cozinha com padrão floral',
      categoria: 'cozinha',
      preco: 69.90,
      imagem: 'cozinha_jogo-floral_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'cozinha-jogo-floral-2',
      nome: 'Jogo Cozinha Floral',
      descricao: 'Variação jogo floral',
      categoria: 'cozinha',
      preco: 69.90,
      imagem: 'cozinha_jogo-floral_2_pro.png'
    },
    {
      id: 'cozinha-jogo-multicolor-1',
      nome: 'Jogo Cozinha Multicolor',
      descricao: 'Jogo colorido para cozinha',
      categoria: 'cozinha',
      preco: 79.90,
      imagem: 'cozinha_jogo-multicolor_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'cozinha-jogo-multicolor-2',
      nome: 'Jogo Cozinha Multicolor',
      descricao: 'Variação multicolor',
      categoria: 'cozinha',
      preco: 79.90,
      imagem: 'cozinha_jogo-multicolor_2_pro.png'
    },
    {
      id: 'cozinha-jogo-verde-1',
      nome: 'Jogo Cozinha Verde Branco',
      descricao: 'Jogo em verde e branco para cozinha',
      categoria: 'cozinha',
      preco: 74.90,
      imagem: 'cozinha_jogo-verde-branco_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'cozinha-acessorio-banheiro-1',
      nome: 'Acessório Banheiro Cozinha',
      descricao: 'Acessório decorativo para banheiro e cozinha',
      categoria: 'cozinha',
      preco: 34.90,
      imagem: 'cozinha_acessorio-banheiro_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'cozinha-tapete-1',
      nome: 'Tapete Cozinha',
      descricao: 'Tapete decorativo para cozinha',
      categoria: 'cozinha',
      preco: 89.90,
      imagem: 'cozinha_tapete_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'cozinha-tapete-2',
      nome: 'Tapete Cozinha',
      descricao: 'Variação de tapete',
      categoria: 'cozinha',
      preco: 89.90,
      imagem: 'cozinha_tapete_2_pro.png'
    }
  ],

  decoracao: [
    {
      id: 'decoracao-home-1',
      nome: 'Home Decor',
      descricao: 'Itens decorativos para casa',
      categoria: 'decoracao',
      preco: 59.90,
      imagem: 'decoracao_home-decor_1_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'decoracao-home-2',
      nome: 'Home Decor',
      descricao: 'Variação de decoração',
      categoria: 'decoracao',
      preco: 59.90,
      imagem: 'decoracao_home-decor_2_pro.png'
    },
    {
      id: 'decoracao-decorativo-1',
      nome: 'Decorativo',
      descricao: 'Itens decorativos variados',
      categoria: 'decoracao',
      preco: 44.90,
      imagem: 'decoracao-decorativo_127_pro.png',
      materiais: 'Fio 100% algodão'
    },
    {
      id: 'decoracao-decorativo-2',
      nome: 'Decorativo',
      descricao: 'Variação decorativa',
      categoria: 'decoracao',
      preco: 44.90,
      imagem: 'decoracao-decorativo_128_pro.png'
    }
  ],

  acessorio: [
    {
      id: 'acessorio-1',
      nome: 'Acessório Elegante',
      descricao: 'Acessório de crochê elegante',
      categoria: 'acessorio',
      preco: null,
      imagem: 'acessorio_1_pro.png',
      materiais: 'Fio 100% algodão'
    }
  ]
}

export const categoriasData: CategoriaData[] = [
  {
    id: 'blusa',
    nome: 'blusa',
    nomeExibicao: 'Blusas',
    descricao: 'Blusas e tops em crochê',
    produtos: produtosPorCategoria['blusa']
  },
  {
    id: 'bolsa',
    nome: 'bolsa',
    nomeExibicao: 'Bolsas',
    descricao: 'Bolsas de crochê variadas',
    produtos: produtosPorCategoria['bolsa']
  },
  {
    id: 'amigurumi',
    nome: 'amigurumi',
    nomeExibicao: 'Amigurumi',
    descricao: 'Brinquedos de crochê (Amigurumi)',
    produtos: produtosPorCategoria['amigurumi']
  },
  {
    id: 'cozinha',
    nome: 'cozinha',
    nomeExibicao: 'Cozinha',
    descricao: 'Jogos e acessórios para cozinha',
    produtos: produtosPorCategoria['cozinha']
  },
  {
    id: 'decoracao',
    nome: 'decoracao',
    nomeExibicao: 'Decoração',
    descricao: 'Itens decorativos para casa',
    produtos: produtosPorCategoria['decoracao']
  },
  {
    id: 'acessorio',
    nome: 'acessorio',
    nomeExibicao: 'Acessórios',
    descricao: 'Acessórios variados',
    produtos: produtosPorCategoria['acessorio']
  }
]
