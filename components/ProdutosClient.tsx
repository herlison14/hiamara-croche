'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'
import { fetchProdutoosAction, type Produto } from '@/lib/produtos-actions'

interface ProdutosClientProps {
  categoria?: string
  abaInicial?: string
}

const ABAS = [
  { id: 'todos', label: 'Todos', icon: '🧶' },
  { id: 'destaque', label: 'Destaques', icon: '⭐' },
  { id: 'novo', label: 'Novidades', icon: '✨' },
  { id: 'mais_vendido', label: 'Mais Vendidos', icon: '🔥' },
]

export function ProdutosClient({ categoria, abaInicial = 'todos' }: ProdutosClientProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [abaAtiva, setAbaAtiva] = useState(abaInicial)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true)
      try {
        const filtros: any = { categoria }

        if (abaAtiva === 'destaque') filtros.destaque = true
        else if (abaAtiva === 'novo') filtros.novo = true
        else if (abaAtiva === 'mais_vendido') filtros.mais_vendido = true

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
  }, [categoria, abaAtiva])

  const produtosFiltrados = produtos

  return (
    <div className="space-y-8">
      {/* Abas com design profissional */}
      <div className="border-b border-creme-200">
        <div className="flex gap-2 overflow-x-auto pb-0">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className="relative flex-shrink-0 px-6 py-4 text-sm font-medium tracking-wider uppercase transition-colors"
              style={{
                color: abaAtiva === aba.id ? '#C97A84' : '#8A7B7B',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="flex items-center gap-2">
                <span>{aba.icon}</span>
                {aba.label}
              </span>
              {abaAtiva === aba.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rosa-400"
                  layoutId="activeTabUnderline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de produtos */}
      <div className="text-sm text-texto-medio">
        {carregando ? (
          'Carregando...'
        ) : produtosFiltrados.length === 0 ? (
          <span className="text-texto-claro">
            Nenhum produto encontrado nesta categoria
          </span>
        ) : (
          <span>
            Mostrando <span className="font-semibold text-texto-escuro">{produtosFiltrados.length}</span>{' '}
            {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
          </span>
        )}
      </div>

      {/* Grid de produtos com animação */}
      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-creme-100 to-creme-200 animate-pulse"
              />
            ))}
          </motion.div>
        ) : produtosFiltrados.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="col-span-full text-center py-20 space-y-4"
          >
            <div className="text-6xl">🧶</div>
            <p
              className="text-xl font-light text-texto-escuro"
              style={{ fontFamily: 'Cormorant Garamond' }}
            >
              Nenhum produto encontrado
            </p>
            <p className="text-texto-medio text-sm">
              Tente outra categoria ou aba
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${categoria}-${abaAtiva}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
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
