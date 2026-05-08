'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CategoriaData } from '@/lib/produtos-data'
// NOTE: imagem field accepts full URLs (Firebase) or local paths (/produtos/...)


interface CategoriaCarrosselProps {
  categoria: CategoriaData
}

export function CategoriaCarrossel({ categoria }: CategoriaCarrosselProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const [indexAtual, setIndexAtual] = useState(0)

  const primeiroProduto = categoria.produtos[0]
  const produtoAtual = categoria.produtos[indexAtual]

  const avancar = useCallback(
    () => setIndexAtual((prev) => (prev + 1) % categoria.produtos.length),
    [categoria.produtos.length]
  )
  const voltar = useCallback(
    () => setIndexAtual((prev) => (prev - 1 + categoria.produtos.length) % categoria.produtos.length),
    [categoria.produtos.length]
  )

  const formatarPreco = (preco: number | null) => {
    if (preco === null) return 'SOB CONSULTA'
    return `R$ ${preco.toFixed(2).replace('.', ',')}`
  }

  return (
    <>
      {/* Card Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="group cursor-pointer"
        onClick={() => setModalAberto(true)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-creme-50 border border-creme-200 shadow-[0_2px_12px_rgba(61,43,43,0.06)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(61,43,43,0.12)]">
          {/* Imagem */}
          <div className="relative aspect-[3/4] overflow-hidden bg-creme-100">
            <Image
              src={primeiroProduto.imagem}
              alt={primeiroProduto.nome}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Badge Categoria */}
          <div className="absolute right-3 top-3">
            <span className="inline-block rounded-full bg-rosa-400 px-3 py-1 text-xs font-medium text-white uppercase tracking-wider">
              {categoria.nomeExibicao}
            </span>
          </div>

          {/* Info */}
          <div className="relative p-6">
            <h3 className="font-display text-xl font-light text-texto-escuro mb-2">
              {primeiroProduto.nome}
            </h3>
            <p className="text-sm text-texto-claro mb-4 line-clamp-2">
              {primeiroProduto.descricao}
            </p>
            <div className="font-display text-2xl font-semibold text-rosa-500 mb-4">
              {formatarPreco(primeiroProduto.preco)}
            </div>
            <Button
              onClick={(e) => { e.stopPropagation(); setModalAberto(true) }}
              className="w-full"
              size="md"
            >
              VER DETALHES
            </Button>

            {/* Contador */}
            <div className="mt-4 text-center text-xs text-texto-claro">
              {categoria.produtos.length} item{categoria.produtos.length !== 1 ? 'ns' : ''} disponível{categoria.produtos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal com Carrossel */}
      <AnimatePresence>
        {modalAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setModalAberto(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-2xl bg-creme-50 border border-creme-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-creme-200 px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-light text-texto-escuro">
                  {categoria.nomeExibicao}
                </h2>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-texto-claro transition-colors hover:text-texto-escuro"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Conteúdo Carrossel */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Imagem */}
                  <motion.div
                    key={`img-${indexAtual}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square overflow-hidden rounded-xl bg-creme-100"
                  >
                    <Image
                      src={produtoAtual.imagem}
                      alt={produtoAtual.nome}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 45vw"
                    />
                  </motion.div>

                  {/* Info Produto */}
                  <motion.div
                    key={`info-${indexAtual}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-display text-2xl font-light text-texto-escuro mb-2">
                        {produtoAtual.nome}
                      </h3>
                      <p className="text-texto-medio mb-6 text-sm leading-relaxed">
                        {produtoAtual.descricao}
                      </p>

                      <div className="space-y-4 mb-6">
                        {produtoAtual.materiais && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-texto-claro mb-1">
                              Materiais
                            </p>
                            <p className="text-texto-medio">{produtoAtual.materiais}</p>
                          </div>
                        )}

                        {produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-texto-claro mb-2">
                              Tamanhos
                            </p>
                            <div className="flex gap-2">
                              {produtoAtual.tamanhos.map((tamanho) => (
                                <span
                                  key={tamanho}
                                  className="rounded border border-creme-200 px-3 py-1 text-sm text-texto-medio"
                                >
                                  {tamanho}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="mb-6 rounded-lg bg-creme-100 p-4">
                        <p className="text-xs uppercase tracking-wider text-texto-claro mb-1">
                          Preço
                        </p>
                        <p className="font-display text-3xl font-semibold text-rosa-500">
                          {formatarPreco(produtoAtual.preco)}
                        </p>
                      </div>
                    </div>

                    <Button className="w-full" size="md">
                      Adicionar ao Carrinho
                    </Button>
                  </motion.div>
                </div>

                {/* Controles Carrossel */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={voltar}
                    className="rounded-full p-2 text-texto-medio transition-colors hover:bg-creme-100 hover:text-texto-escuro"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex items-center gap-2">
                    {categoria.produtos.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setIndexAtual(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === indexAtual ? 'bg-rosa-400 w-8' : 'bg-creme-200 w-2'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={avancar}
                    className="rounded-full p-2 text-texto-medio transition-colors hover:bg-creme-100 hover:text-texto-escuro"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="mt-4 text-center text-sm text-texto-claro">
                  {indexAtual + 1} de {categoria.produtos.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
