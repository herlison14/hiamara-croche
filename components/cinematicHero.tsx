'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-creme-50 to-creme-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Paralaxe Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/crochet-background.svg)',
          backgroundPosition: 'center',
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {/* Overlay suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-creme-50/20 to-creme-50" />
      </motion.div>

      {/* Conteúdo Hero com Zoom + Fade */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4">
          {/* Título com efeito de fade + scale */}
          <motion.h1
            className="text-6xl md:text-8xl font-light text-texto-escuro mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          >
            HIAMARA<br />CROCHÊ
          </motion.h1>

          {/* Slogan com efeito de digitação suave */}
          <motion.p
            className="text-xl md:text-2xl text-texto-medio font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Feito à mão, entregue com amor
          </motion.p>

          {/* CTA Button com ripple effect */}
          <motion.button
            className="bg-rosa-400 hover:bg-rosa-500 text-white px-12 py-4 rounded-lg font-semibold uppercase tracking-widest text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorar Coleção
          </motion.button>
        </div>
      </div>

      {/* Indicador de scroll com animação pulsante */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-rosa-400 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-rosa-400 rounded-full"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}
