'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Foto {
  url: string
  alt: string
}

export function ProductGallery({ fotos }: { fotos: Foto[] }) {
  const [idx, setIdx] = useState(0)
  const current = fotos[idx]
  if (!current) return null

  return (
    <div className="lg:sticky lg:top-28">
      <div className="space-y-4">
        {/* Imagem principal */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-creme-100 shadow-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.url}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.url}
                alt={current.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        {fotos.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {fotos.map((foto, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-creme-100 transition-all duration-300 ${
                  i === idx
                    ? 'ring-2 ring-rosa-400 ring-offset-2 ring-offset-creme-50'
                    : 'hover:opacity-80'
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <Image
                  src={foto.url}
                  alt={foto.alt}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
