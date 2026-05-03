'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { CategoriaData, ProdutoData } from '@/lib/produtos-data'

interface CategoriaCarrosselProps {
  categoria: CategoriaData
}

export function CategoriaCarrossel({ categoria }: CategoriaCarrosselProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const [indexAtual, setIndexAtual] = useState(0)

  const primeiroProduto = categoria.produtos[0]
  const produtoAtual = categoria.produtos[indexAtual]

  const proximoIndex = (indexAtual + 1) % categoria.produtos.length
  const indexAnterior = (indexAtual - 1 + categoria.produtos.length) % categoria.produtos.length

  const avancar = () => setIndexAtual(proximoIndex)
  const voltar = () => setIndexAtual(indexAnterior)

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
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
          {/* Imagem */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <Image
              src={`/produtos/${primeiroProduto.imagem}`}
              alt={primeiroProduto.nome}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Badge Sem Categoria */}
          <div className="absolute right-3 top-3">
            <span className="inline-block rounded-full bg-rose-400 px-3 py-1 text-xs font-bold text-white">
              {categoria.nomeExibicao}
            </span>
          </div>

          {/* Info */}
          <div className="relative p-6">
            <h3 className="text-xl font-light text-gray-800 mb-2">
              {primeiroProduto.nome}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {primeiroProduto.descricao}
            </p>
            <div className="text-2xl font-bold text-rose-600 mb-4">
              {formatarPreco(primeiroProduto.preco)}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setModalAberto(true)
              }}
              className="w-full rounded-lg bg-rose-500 px-4 py-3 font-bold text-white transition-colors duration-300 hover:bg-rose-600"
            >
              VER DETALHES
            </button>

            {/* Contador de itens */}
            <div className="mt-4 text-center text-xs text-gray-400">
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
              className="relative w-full max-w-2xl rounded-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-800">
                  {categoria.nomeExibicao}
                </h2>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
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
                    className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <Image
                      src={`/produtos/${produtoAtual.imagem}`}
                      alt={produtoAtual.nome}
                      fill
                      className="object-cover"
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
                      <h3 className="text-2xl font-light text-gray-800 mb-2">
                        {produtoAtual.nome}
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {produtoAtual.descricao}
                      </p>

                      {/* Detalhes */}
                      <div className="space-y-4 mb-6">
                        {produtoAtual.materiais && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                              Materiais
                            </p>
                            <p className="text-gray-700">
                              {produtoAtual.materiais}
                            </p>
                          </div>
                        )}

                        {produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                              Tamanhos
                            </p>
                            <div className="flex gap-2">
                              {produtoAtual.tamanhos.map((tamanho) => (
                                <span
                                  key={tamanho}
                                  className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
                                >
                                  {tamanho}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="mb-6 rounded-lg bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                          Preço
                        </p>
                        <p className="text-3xl font-bold text-rose-600">
                          {formatarPreco(produtoAtual.preco)}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full rounded-lg bg-rose-500 px-4 py-3 font-bold text-white transition-colors hover:bg-rose-600">
                      Adicionar ao Carrinho
                    </button>
                  </motion.div>
                </div>

                {/* Controles Carrossel */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={voltar}
                    className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Indicador */}
                  <div className="flex items-center gap-2">
                    {categoria.produtos.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setIndexAtual(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === indexAtual ? 'bg-rose-500 w-8' : 'bg-gray-300 w-2'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={avancar}
                    className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Contador */}
                <div className="mt-4 text-center text-sm text-gray-500">
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
