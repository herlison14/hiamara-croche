/**
 * Curadoria de imagens reais do catálogo Hiamara Crochê.
 * Apontam para arquivos locais em /public/produtos/ — webp profissional.
 * Usadas no hero, categorias visuais, "nosso processo" e áreas editoriais.
 */

export interface CategoriaVitrine {
  id: string
  nome: string
  descricao: string
  imagem: string
  imagemAlt: string
  href: string
  destaque?: boolean
}

export const HERO_IMAGES = {
  principal: '/produtos/blusa_premium-designs_3_pro.webp',
  vertical: '/produtos/amigurumi_personagens-variados_2_pro.webp',
  detalhe: '/produtos/blusa_turquesa-rendada_2_pro.webp',
  flat: '/produtos/bolsa_premium-cores_4_pro.webp',
} as const

export const HERO_COLLAGE = [
  '/produtos/blusa_premium-designs_3_pro.webp',
  '/produtos/amigurumi_personagens-variados_2_pro.webp',
  '/produtos/bolsa_premium-cores_4_pro.webp',
  '/produtos/blusa_turquesa-rendada_2_pro.webp',
] as const

export const CATEGORIAS_VITRINE: CategoriaVitrine[] = [
  {
    id: 'blusas',
    nome: 'Blusas & Tops',
    descricao: 'Peças leves, rendadas e elegantes para o seu armário.',
    imagem: '/produtos/blusa_premium-designs_2_pro.webp',
    imagemAlt: 'Blusa de crochê com design premium em tom claro',
    href: '/produtos?categoria=Blusas',
    destaque: true,
  },
  {
    id: 'bolsas',
    nome: 'Bolsas',
    descricao: 'Sacolas estruturadas e clutches feitos ponto a ponto.',
    imagem: '/produtos/bolsa_premium-cores_2_pro.webp',
    imagemAlt: 'Bolsa de crochê multicolorida com acabamento premium',
    href: '/produtos?categoria=Bolsas',
  },
  {
    id: 'amigurumis',
    nome: 'Amigurumis',
    descricao: 'Bonecos colecionáveis em crochê com personalidade própria.',
    imagem: '/produtos/amigurumi_personagens-variados_1_pro.webp',
    imagemAlt: 'Amigurumis em crochê com personagens variados',
    href: '/produtos?categoria=Bonecos',
  },
  {
    id: 'decoracao',
    nome: 'Decoração',
    descricao: 'Detalhes para deixar sua casa mais aconchegante.',
    imagem: '/produtos/decoracao_home-decor_2_pro.webp',
    imagemAlt: 'Item decorativo de crochê para casa',
    href: '/produtos?categoria=Decoração',
  },
  {
    id: 'cozinha',
    nome: 'Cozinha',
    descricao: 'Jogos americanos, tapetes e utilitários para o seu dia.',
    imagem: '/produtos/cozinha_jogo-floral_1_pro.webp',
    imagemAlt: 'Jogo de crochê para cozinha com motivo floral',
    href: '/produtos?categoria=Cozinha',
  },
  {
    id: 'acessorios',
    nome: 'Acessórios',
    descricao: 'Apliques, suportes e peças únicas para personalizar tudo.',
    imagem: '/produtos/acessorio-decorativo_127_pro.webp',
    imagemAlt: 'Acessório decorativo em crochê artesanal',
    href: '/produtos?categoria=Acessórios',
  },
]

export const MARQUEE_IMAGES = [
  '/produtos/blusa_premium-designs_1_pro.webp',
  '/produtos/amigurumi_anime-diversos_1_pro.webp',
  '/produtos/bolsa_premium-cores_1_pro.webp',
  '/produtos/blusa_rosa-pastel_2_pro.webp',
  '/produtos/cozinha_jogo-multicolor_1_pro.webp',
  '/produtos/amigurumi_naruto-ninja_2_pro.webp',
  '/produtos/decoracao_home-decor_3_pro.webp',
  '/produtos/blusa_turquesa-rendada_3_pro.webp',
  '/produtos/bolsa_sacola-grande_2_pro.webp',
  '/produtos/amigurumi_personagens-variados_3_pro.webp',
] as const

export const PROCESSO_IMAGE = '/produtos/blusa_rosa-pastel_4_pro.webp'
export const ABOUT_IMAGE = '/produtos/blusa_premium-designs_5_pro.webp'
