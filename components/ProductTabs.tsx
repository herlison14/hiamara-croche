'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Produto {
  id: string
  nome: string
  slug: string
  categoria: string
  preco: number
  descricao: string
  ativo: boolean
  mais_vendido?: boolean
  novo?: boolean
  destaque?: boolean
}

interface ProductTabsProps {
  produtos: Produto[]
  categoria?: string
  onTabChange?: (tab: string) => void
}

const TABS = [
  { id: 'todos', label: 'Todos os Produtos' },
  { id: 'destaque', label: 'Destaques' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'mais_vendido', label: 'Mais Vendidos' },
]

export function ProductTabs({ produtos, onTabChange }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('todos')

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const filteredProdutos = produtos.filter((p) => {
    if (activeTab === 'todos') return true
    if (activeTab === 'destaque') return p.destaque === true
    if (activeTab === 'novidades') return p.novo === true
    if (activeTab === 'mais_vendido') return p.mais_vendido === true
    return true
  })

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 border-b border-creme-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="relative flex-shrink-0 px-1 py-3 text-sm font-medium tracking-wider uppercase transition-colors"
            style={{
              color: activeTab === tab.id ? '#C97A84' : '#8A7B7B',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-rosa-400"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content info */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-texto-medio"
      >
        Mostrando {filteredProdutos.length} {filteredProdutos.length === 1 ? 'produto' : 'produtos'}
      </motion.div>

      {/* Products grid */}
      <motion.div
        key={`grid-${activeTab}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredProdutos.length > 0 ? (
          <div className="space-y-4">
            {filteredProdutos.map((produto) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 p-4 rounded-lg border border-creme-200 hover:border-rosa-300 transition-colors bg-white/50"
              >
                {/* Placeholder para imagem */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-creme-100 to-creme-200 flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>

                {/* Info do produto */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-texto-escuro">{produto.nome}</h3>
                      <p className="text-xs text-texto-medio uppercase tracking-wider mt-1">{produto.categoria}</p>
                    </div>
                    <span className="text-lg font-semibold text-rosa-400">R$ {produto.preco.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-texto-medio line-clamp-2">{produto.descricao}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-texto-medio">Nenhum produto encontrado nesta categoria</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
