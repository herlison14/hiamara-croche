'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface CinematicSectionProps {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  variant?: 'light' | 'dark'
  parallaxIntensity?: number
}

export function CinematicSection({
  id,
  title,
  subtitle,
  children,
  variant = 'light',
  parallaxIntensity = 50,
}: CinematicSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [parallaxIntensity, -parallaxIntensity])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const bgColor = variant === 'light' ? 'bg-creme-50' : 'bg-creme-100'
  const textColor = variant === 'light' ? 'text-texto-escuro' : 'text-texto-escuro'

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative w-full py-24 md:py-32 px-4 md:px-8 overflow-hidden ${bgColor}`}
      style={{ position: 'relative' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1 }}
    >
      {/* Fundo com parallax */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-5"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rosa-100 to-transparent" />
      </motion.div>

      {/* Container com max-width */}
      <motion.div
        className="max-w-6xl mx-auto"
        style={{ opacity }}
      >
        {/* Header da seção */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-5xl md:text-6xl font-light mb-4 ${textColor}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-texto-medio font-light max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Divisor decorativo */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-8 bg-rosa-400" />
            <div className="w-2 h-2 bg-rosa-400 rounded-full" />
            <div className="h-px w-8 bg-rosa-400" />
          </motion.div>
        </div>

        {/* Conteúdo principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
