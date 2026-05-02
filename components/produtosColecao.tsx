'use client'

import { useEffect, useState } from 'react'
import { CinematicProductCard } from './cinematicProductCard'
import { StaggerContainer, StaggerItem } from './cinematicTransition'

interface Produto {
  id: string
  nome: string
  slug: string
  preco: number
  categoria: { nome: string }
  fotos: { url: string }[]
}

const produtosDemo: Produto[] = [
  {
    id: '1',
    nome: 'Blusa de Crochê Rosa',
    slug: 'blusa-rosa',
    preco: 89.90,
    categoria: { nome: 'Blusas' },
    fotos: [],
  },
  {
    id: '2',
    nome: 'Boneco de Crochê Amigurumi',
    slug: 'amigurumi',
    preco: 45.90,
    categoria: { nome: 'Bonecos' },
    fotos: [],
  },
  {
    id: '3',
    nome: 'Bolsa de Crochê Artesanal',
    slug: 'bolsa-artesanal',
    preco: 129.90,
    categoria: { nome: 'Bolsas' },
    fotos: [],
  },
  {
    id: '4',
    nome: 'Top de Crochê Summer',
    slug: 'top-summer',
    preco: 65.90,
    categoria: { nome: 'Blusas' },
    fotos: [],
  },
]

export function ProdutosColecao() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/colecao?limite=4')
        if (!response.ok) throw new Error('Erro ao buscar produtos')
        const data = await response.json()
        setProdutos(data)
      } catch (error) {
        console.error('Erro:', error)
        setProdutos(produtosDemo)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [])

  if (loading) {
    return (
      <StaggerContainer staggerDelay={0.15}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <StaggerItem key={i}>
              <div className="animate-pulse rounded-2xl bg-creme-200 h-96" />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    )
  }

  return (
    <StaggerContainer staggerDelay={0.15}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {produtos.map((produto, index) => (
          <StaggerItem key={produto.id}>
            <CinematicProductCard
              id={produto.id}
              name={produto.nome}
              image={produto.fotos?.[0]?.url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8c3c3' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='18' fill='%23a85a65'%3E${encodeURIComponent(produto.nome)}%3C/text%3E%3C/svg%3E`}
              price={produto.preco}
              category={produto.categoria?.nome || 'Sem categoria'}
              index={index}
            />
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  )
}
