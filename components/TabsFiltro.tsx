'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'
import { fetchProdutoosAction, type Produto } from '@/lib/produtos-actions'

interface TabsFiltroProps {
  categoria?: string
  abaInicial?: string
  busca?: string
}

const ABAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'destaque', label: 'Destaques' },
  { id: 'novo', label: 'Novidades' },
  { id: 'mais_vendido', label: 'Mais Vendidos' },
] as const

type AbaId = (typeof ABAS)[number]['id']

const easing = [0.16, 1, 0.3, 1] as const

export function TabsFiltro({ categoria, abaInicial = 'todos', busca }: TabsFiltroProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<AbaId>(abaInicial as AbaId)

  useEffect(() => {
    let alive = true
    const buscar = async () => {
      setCarregando(true)
      try {
        const filtros: Record<string, unknown> = categoria ? { categoria } : {}
        const dados = await fetchProdutoosAction(filtros)
        if (alive) setProdutos(dados)
      } catch {
        if (alive) setProdutos([])
      } finally {
        if (alive) setCarregando(false)
      }
    }
    buscar()
    return () => {
      alive = false
    }
  }, [categoria])

  const counts: Record<AbaId, number> = useMemo(
    () => ({
      todos: produtos.length,
      destaque: produtos.filter((p) => p.destaque).length,
      novo: produtos.filter((p) => p.novo).length,
      mais_vendido: produtos.filter((p) => p.mais_vendido).length,
    }),
    [produtos]
  )

  const produtosFiltrados = useMemo(
    () =>
      produtos.filter((p) => {
        if (abaAtiva === 'destaque' && !p.destaque) return false
        if (abaAtiva === 'novo' && !p.novo) return false
        if (abaAtiva === 'mais_vendido' && !p.mais_vendido) return false
        if (busca) {
          const q = busca.toLowerCase()
          return (
            p.nome.toLowerCase().includes(q) ||
            p.descricao.toLowerCase().includes(q) ||
            p.categoria.toLowerCase().includes(q)
          )
        }
        return true
      }),
    [produtos, abaAtiva, busca]
  )

  return (
    <div className="space-y-10">
      {/* Pill tabs */}
      <LayoutGroup id="tabs-filtro">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 p-1.5 bg-creme-100 rounded-full border border-creme-200 w-fit">
          {ABAS.map((aba) => {
            const ativa = abaAtiva === aba.id
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`relative px-5 py-2.5 text-xs md:text-sm font-medium uppercase tracking-[0.16em] rounded-full transition-colors duration-300 ${
                  ativa ? 'text-creme-50' : 'text-texto-medio hover:text-texto-escuro'
                }`}
              >
                {ativa && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-rosa-400 rounded-full shadow-rosa"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {aba.label}
                  {!carregando && (
                    <span
                      className={`text-[0.65rem] font-normal tracking-normal ${
                        ativa ? 'text-creme-100/80' : 'text-texto-claro'
                      }`}
                    >
                      {counts[aba.id]}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      {/* Grid de produtos */}
      <AnimatePresence mode="wait">
        {carregando ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] rounded-2xl bg-creme-100 shimmer" />
                <div className="h-2.5 w-16 bg-creme-100 shimmer rounded" />
                <div className="h-4 w-3/4 bg-creme-100 shimmer rounded" />
              </div>
            ))}
          </motion.div>
        ) : produtosFiltrados.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-24 max-w-md mx-auto"
          >
            <div className="font-display text-6xl text-rosa-200 mb-4">∅</div>
            <p className="font-display text-2xl text-texto-escuro mb-2 font-light">
              Nada por aqui ainda
            </p>
            <p className="text-sm text-texto-medio font-light">
              Tente outra aba ou{' '}
              <a
                href="https://wa.me/5521997927927"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rosa-500 underline underline-offset-4 hover:text-rosa-600 transition-colors"
              >
                peça sob encomenda
              </a>
              .
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${categoria ?? 'all'}-${abaAtiva}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {produtosFiltrados.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.04, 0.5),
                  ease: easing,
                }}
              >
                <ProductCardFirebase produto={produto} priority={index < 4} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!carregando && produtosFiltrados.length > 0 && (
        <p className="text-xs uppercase tracking-[0.2em] text-texto-claro pt-2 border-t border-creme-200">
          {produtosFiltrados.length}{' '}
          {produtosFiltrados.length === 1 ? 'peça encontrada' : 'peças encontradas'}
        </p>
      )}
    </div>
  )
}
