'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Imagem realista profissional de fundo */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1682953307762-a640d8dbd659?w=2000&q=80)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        {/* Overlay com gradiente sofisticado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </motion.div>

      {/* Conteúdo Hero centrado e elegante */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4 max-w-4xl">
          {/* Decoração superior */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 text-white/70">
              <div className="h-px w-8 bg-rosa-300" />
              <span className="text-sm tracking-widest uppercase">Artesanato Autêntico</span>
              <div className="h-px w-8 bg-rosa-300" />
            </div>
          </motion.div>

          {/* Título principal com sombra cinematográfica */}
          <motion.h1
            className="text-7xl md:text-9xl font-light text-white mb-4 tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: '0 10px 30px rgba(0,0,0,0.4)',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
          >
            HIAMARA
          </motion.h1>

          <motion.h2
            className="text-5xl md:text-7xl font-light text-rosa-200 mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: '0 8px 25px rgba(0,0,0,0.35)',
            }}
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
          >
            CROCHÊ
          </motion.h2>

          {/* Slogan elegante */}
          <motion.p
            className="text-lg md:text-2xl text-white/90 font-light mb-12 max-w-2xl mx-auto"
            style={{
              fontFamily: "'Lora', serif",
              textShadow: '0 4px 15px rgba(0,0,0,0.3)',
              lineHeight: 1.6
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Cada ponto é um ato de amor. Criações feitas à mão com fios selecionados e a dedicação de quem ama o que faz.
          </motion.p>

          {/* Estatísticas visuais */}
          <motion.div
            className="flex justify-center gap-12 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-light text-rosa-300">100%</div>
              <div className="text-xs uppercase tracking-wider text-white/70">Feito à Mão</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-light text-rosa-300">Fios Premium</div>
              <div className="text-xs uppercase tracking-wider text-white/70">Selecionados</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-light text-rosa-300">♥</div>
              <div className="text-xs uppercase tracking-wider text-white/70">Com Amor</div>
            </div>
          </motion.div>

          {/* CTA Button sofisticado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.button
              className="bg-gradient-to-r from-rosa-400 to-rosa-500 hover:from-rosa-500 hover:to-rosa-600 text-white px-10 py-4 rounded-full font-light uppercase tracking-widest text-sm shadow-2xl backdrop-blur-sm"
              style={{
                boxShadow: '0 8px 32px rgba(232, 115, 140, 0.4)',
              }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 12px 40px rgba(232, 115, 140, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Coleção
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll elegante */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="text-white/70 text-xs uppercase tracking-widest mb-4">Descubra mais</div>
        <div className="w-6 h-10 border border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-rosa-300 rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Partículas flutuantes suaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}
