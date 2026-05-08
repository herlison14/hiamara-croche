'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Foto {
  url: string
  alt: string
}

export function ProductGallery({ fotos }: { fotos: Foto[] }) {
  const [idx, setIdx] = useState(0)
  const current = fotos[idx]

  if (!current) return null

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-creme-100">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {fotos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-creme-100 border-2 transition-colors ${
                i === idx ? 'border-rosa-400' : 'border-transparent hover:border-creme-300'
              }`}
            >
              <Image
                src={foto.url}
                alt={foto.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
