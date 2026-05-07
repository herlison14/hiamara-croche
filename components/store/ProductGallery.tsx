'use client'

import { useState } from 'react'

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
      <div className="aspect-square rounded-2xl overflow-hidden bg-creme-100">
        <img
          src={current.url}
          alt={current.alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
      {fotos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`aspect-square rounded-lg overflow-hidden bg-creme-100 border-2 transition-colors ${
                i === idx ? 'border-rosa-400' : 'border-transparent hover:border-creme-300'
              }`}
            >
              <img src={foto.url} alt={foto.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
