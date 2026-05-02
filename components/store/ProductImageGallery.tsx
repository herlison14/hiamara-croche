'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

interface ProductImageGalleryProps {
  imagens: string[]
  nome: string
}

export function ProductImageGallery({ imagens, nome }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0)

  if (!imagens || imagens.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#F5EFE6] to-[#F4C5CB] flex items-center justify-center">
        <span className="text-7xl font-light text-[#C97A84] font-serif">{nome[0]?.toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5EFE6] group">
        <Image
          src={imagens[selected]}
          alt={nome}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {imagens.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagens.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                selected === i ? 'border-[#C97A84]' : 'border-[#EDE0CD] opacity-70 hover:opacity-100'
              )}
            >
              <Image src={img} alt={`${nome} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
