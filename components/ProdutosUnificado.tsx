'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'
import { fetchProdutoosAction, type Produto } from '@/lib/produtos-actions'

interface ProdutosUnificadoProps {
  categoria?: string
}

export function ProdutosUnificado({ categoria }: ProdutosUnificadoProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos')

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true)
      try {
        const filtros: any = categoria ? { categoria } : {}
        const dados = await fetchProdutoosAction(filtros)
        setProdutos(dados)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        setProdutos([])
      } finally {
        setCarregando(false)
      }
    }

    fetchProdutos()
  }, [categoria])

  // Filtros dinâmicos baseados nos dados reais
  const filtros = [
    { id: 'todos', label: 'Todos os Produtos', count: produtos.length },
    {
      id: 'destaque',
      label: 'Destaques',
      count: produtos.filter(p => p.destaque).length
    },
    {
      id: 'novo',
      label: 'Novidades',
      count: produtos.filter(p => p.novo).length
    },
    {
      id: 'mais_vendido',
      label: 'Mais Vendidos',
      count: produtos.filter(p => p.mais_vendido).length
    },
  ]

  const produtosFiltrados = produtos.filter(p => {
    if (filtroAtivo === 'todos') return true
    if (filtroAtivo === 'destaque') return p.destaque
    if (filtroAtivo === 'novo') return p.novo
    if (filtroAtivo === 'mais_vendido') return p.mais_vendido
    return true
  })

  return (
    <div className="space-y-8">
      {/* Filtros conectados - Card único com abas internas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-black">
            Filtrar por
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFiltroAtivo(filtro.id)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  filtroAtivo === filtro.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-black hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{filtro.label}</div>
                <div className={`text-xs mt-2 ${
                  filtroAtivo === filtro.id ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {filtro.count} {filtro.count === 1 ? 'item' : 'itens'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contagem e informações */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {carregando ? (
            'Carregando produtos...'
          ) : produtosFiltrados.length === 0 ? (
            <span className="text-gray-400">Nenhum produto encontrado neste filtro</span>
          ) : (
            <span>
              <span className="font-semibold text-black">{produtosFiltrados.length}</span>
              {' '}{produtosFiltrados.length === 1 ? 'produto' : 'produtos'} selecionados
            </span>
          )}
        </div>
      </div>

      {/* Grid de produtos unificado */}
      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </motion.div>
        ) : produtosFiltrados.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20 space-y-4"
          >
            <div className="text-6xl">🧶</div>
            <p className="text-xl font-light text-black">
              Nenhum produto neste filtro
            </p>
            <p className="text-gray-500 text-sm">
              Tente outro filtro para ver mais opções
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${categoria}-${filtroAtivo}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {produtosFiltrados.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCardFirebase produto={produto} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
