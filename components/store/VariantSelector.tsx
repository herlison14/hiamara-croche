'use client'

import { cn } from '@/lib/cn'
import { Label } from '@/components/ui/label'
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
          <Label className="mb-2 inline-block">
            {v.nome}:{' '}
            <span className="text-secondary-foreground normal-case tracking-normal font-normal">
              {selecionado[v.nome] ?? ''}
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {v.opcoes.map((opcao) => (
              <button
                key={opcao}
                onClick={() => onChange({ ...selecionado, [v.nome]: opcao })}
                className={cn(
                  'px-4 py-2 text-sm rounded-md border transition-all duration-200',
                  selecionado[v.nome] === opcao
                    ? 'bg-primary border-primary text-primary-foreground font-medium'
                    : 'border-border text-secondary-foreground hover:border-primary hover:text-primary'
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
