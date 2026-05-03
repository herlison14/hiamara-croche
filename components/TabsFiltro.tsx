'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCardFirebase } from '@/components/ProductCardFirebase'
import { fetchProdutoosAction, type Produto } from '@/lib/produtos-actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface TabsFiltroProps {
  categoria?: string
  abaInicial?: string
}

const ABAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'destaque', label: 'Destaques' },
  { id: 'novo', label: 'Novidades' },
  { id: 'mais_vendido', label: 'Mais Vendidos' },
] as const

type AbaId = typeof ABAS[number]['id']

export function TabsFiltro({ categoria, abaInicial = 'todos' }: TabsFiltroProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<AbaId>(abaInicial as AbaId)

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true)
      try {
        const filtros: Record<string, unknown> = categoria ? { categoria } : {}
        const dados = await fetchProdutoosAction(filtros)
        setProdutos(dados)
      } catch {
        setProdutos([])
      } finally {
        setCarregando(false)
      }
    }
    fetchProdutos()
  }, [categoria])

  const counts: Record<AbaId, number> = {
    todos: produtos.length,
    destaque: produtos.filter((p) => p.destaque).length,
    novo: produtos.filter((p) => p.novo).length,
    mais_vendido: produtos.filter((p) => p.mais_vendido).length,
  }

  const produtosFiltrados = produtos.filter((p) => {
    if (abaAtiva === 'todos') return true
    if (abaAtiva === 'destaque') return p.destaque
    if (abaAtiva === 'novo') return p.novo
    if (abaAtiva === 'mais_vendido') return p.mais_vendido
    return true
  })

  const skeletons = Array.from({ length: 8 })

  return (
    <div className="space-y-6">
      <Tabs value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as AbaId)}>
        <TabsList>
          {ABAS.map((aba) => (
            <TabsTrigger key={aba.id} value={aba.id}>
              {aba.label}
              {!carregando && (
                <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal opacity-60">
                  ({counts[aba.id]})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {ABAS.map((aba) => (
          <TabsContent key={aba.id} value={aba.id}>
            <AnimatePresence mode="wait">
              {carregando ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  {skeletons.map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/5] rounded-2xl bg-secondary animate-pulse"
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
                  <p className="font-display text-xl font-light text-foreground">
                    Nenhum produto encontrado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tente outra aba ou categoria
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${categoria ?? 'all'}-${abaAtiva}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  {produtosFiltrados.map((produto, index) => (
                    <motion.div
                      key={produto.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                    >
                      <ProductCardFirebase produto={produto} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>

      {!carregando && (
        <p className="text-sm text-muted-foreground">
          {produtosFiltrados.length === 0
            ? 'Nenhum produto nesta aba'
            : `${produtosFiltrados.length} ${produtosFiltrados.length === 1 ? 'produto' : 'produtos'}`}
        </p>
      )}
    </div>
  )
}
