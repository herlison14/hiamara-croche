// Imagens livres de direitos autorais - placeholders SVG aconchegantes
const criarPlaceholder = (color: string, titulo: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='${encodeURIComponent(color)}' width='500' height='500'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='24' fill='%23654321'%3E🧶%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='20' fill='%23654321' font-weight='bold'%3E${encodeURIComponent(titulo)}%3C/text%3E%3C/svg%3E`

export const produtosExemplo = [
  {
    id: '1',
    nome: 'Blusa de Crochê Rosa',
    slug: 'blusa-rosa',
    preco: 89.90,
    categoria: { nome: 'Blusas' },
    fotos: [
      {
        url: criarPlaceholder('%23f5d7d3', 'Blusa Rosa'),
        alt: 'Blusa de Crochê Rosa',
      },
    ],
    descricao: 'Blusa de crochê em tons rosa, confeccionada à mão com fios premium.',
  },
  {
    id: '2',
    nome: 'Boneco de Crochê Amigurumi',
    slug: 'amigurumi',
    preco: 45.90,
    categoria: { nome: 'Bonecos' },
    fotos: [
      {
        url: criarPlaceholder('%23f0e6d8', 'Amigurumi'),
        alt: 'Boneco de Crochê Amigurumi',
      },
    ],
    descricao: 'Adorável boneco Amigurumi feito à mão com segurança e amor.',
  },
  {
    id: '3',
    nome: 'Bolsa de Crochê Artesanal',
    slug: 'bolsa-artesanal',
    preco: 129.90,
    categoria: { nome: 'Bolsas' },
    fotos: [
      {
        url: criarPlaceholder('%23e8d4c4', 'Bolsa Artesanal'),
        alt: 'Bolsa de Crochê Artesanal',
      },
    ],
    descricao: 'Bolsa de crochê única em padrão artesanal, perfeita para o dia a dia.',
  },
  {
    id: '4',
    nome: 'Top de Crochê Summer',
    slug: 'top-summer',
    preco: 65.90,
    categoria: { nome: 'Blusas' },
    fotos: [
      {
        url: criarPlaceholder('%23fff0e6', 'Top Summer'),
        alt: 'Top de Crochê Summer',
      },
    ],
    descricao: 'Top leve e arejado de crochê, ideal para o verão.',
  },
]
