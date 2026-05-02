'use client'

import { cn } from '@/lib/cn'
import type { Variante } from '@/lib/types'

interface VariantSelectorProps {
  variantes: Variante[]
  selecionado: Record<string, string>
  onChange: (variantes: Record<string, string>) => void
}

export function VariantSelector({ variantes, selecionado, onChange }: VariantSelectorProps) {
  if (!variantes || variantes.length === 0) return null

  return (
    <div className="space-y-4">
      {variantes.map((v) => (
        <div key={v.nome}>
          <p className="text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-2">
            {v.nome}: <span className="text-[#5C4A4A] normal-case tracking-normal">{selecionado[v.nome] ?? ''}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {v.opcoes.map((opcao) => (
              <button
                key={opcao}
                onClick={() => onChange({ ...selecionado, [v.nome]: opcao })}
                className={cn(
                  'px-4 py-2 text-sm rounded-md border transition-all duration-200',
                  selecionado[v.nome] === opcao
                    ? 'bg-[#C97A84] border-[#C97A84] text-white font-medium'
                    : 'border-[#EDE0CD] text-[#5C4A4A] hover:border-[#C97A84] hover:text-[#C97A84]'
                )}
              >
                {opcao}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
