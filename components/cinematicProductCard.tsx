'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface CinematicProductCardProps {
  slug: string
  name: string
  image: string
  price: number | null
  category: string
  index: number
}

export function CinematicProductCard({
  slug,
  name,
  image,
  price,
  category,
  index,
}: CinematicProductCardProps) {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-2xl bg-creme-50 border border-creme-200 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Imagem com zoom no hover */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-creme-100 to-creme-200">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Overlay com fade */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-rosa-400/40 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Badge de categoria com slide */}
        <motion.div
          className="absolute top-4 right-4 bg-rosa-100 text-rosa-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
        >
          {category}
        </motion.div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-6">
        <motion.h3
          className="text-xl font-semibold text-texto-escuro mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.12 }}
        >
          {name}
        </motion.h3>

        {/* Preço com efeito de aumento */}
        <motion.div
          className="flex items-baseline gap-2 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
        >
          <span className="text-2xl font-bold text-rosa-500">
            {price !== null ? `R$ ${price.toFixed(2)}` : 'SOB CONSULTA'}
          </span>
        </motion.div>

        {/* CTA Button com efeito de expansão */}
        <Link href={`/produto/${slug}`}>
          <motion.div
            className="w-full bg-rosa-400 hover:bg-rosa-500 text-white py-3 rounded-lg font-semibold uppercase tracking-wide text-sm text-center transition-colors cursor-pointer"
            whileHover={{ backgroundColor: '#A85A65' }}
            whileTap={{ scale: 0.98 }}
          >
            Ver Detalhes
          </motion.div>
        </Link>
      </div>

      {/* Efeito de borda animada no hover */}
      <motion.div
        className="absolute inset-0 border-2 border-rosa-400 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
