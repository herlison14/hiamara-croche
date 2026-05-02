'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

interface CategoryHeroProps {
  categoria?: string
  categorias: Array<{ id: string; slug: string; nome: string }>
}

const CATEGORY_IMAGES: Record<string, { url: string; description: string }> = {
  'bonecos': {
    url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=2000&q=80',
    description: 'Bonecos artesanais com amor e dedicação'
  },
  'bolsas': {
    url: 'https://images.unsplash.com/photo-1616996099207-4bc0e4eaf4b5?w=2000&q=80',
    description: 'Bolsas tecidas com fios selecionados'
  },
  'roupas': {
    url: 'https://images.unsplash.com/photo-1615886287135-a987073e8f0d?w=2000&q=80',
    description: 'Roupas em crochê feitas especialmente para você'
  },
}

export function CategoryHero({ categoria, categorias }: CategoryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const categoryData = categoria && CATEGORY_IMAGES[categoria]
  const categoryName = categoria ? categorias.find(c => c.slug === categoria)?.nome : ''

  if (!categoria || !categoryData) {
    return null
  }

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full h-80 md:h-96 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background image com parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${categoryData.url})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {/* Overlays com gradiente sofisticado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </motion.div>

      {/* Conteúdo da categoria */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center">
          {/* Decoração superior */}
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 text-white/70">
              <div className="h-px w-6 bg-rosa-300" />
              <span className="text-xs tracking-widest uppercase">Coleção</span>
              <div className="h-px w-6 bg-rosa-300" />
            </div>
          </motion.div>

          {/* Título da categoria */}
          <motion.h2
            className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: '0 8px 25px rgba(0,0,0,0.4)',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            {categoryName}
          </motion.h2>

          {/* Descrição */}
          <motion.p
            className="text-base md:text-lg text-white/80 font-light"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {categoryData.description}
          </motion.p>
        </div>
      </div>
    </motion.section>
  )
}
