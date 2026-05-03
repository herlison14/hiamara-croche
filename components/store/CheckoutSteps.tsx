'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Separator } from '@/components/ui/separator'

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3
  steps: Array<{ label: string; sublabel: string }>
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => {
        const n = i + 1
        const done = n < currentStep
        const active = n === currentStep

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  done && 'bg-primary text-primary-foreground',
                  active && 'bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(201,122,132,0.2)]',
                  !done && !active && 'bg-secondary text-muted-foreground border border-border'
                )}
              >
                {done ? <Check size={16} /> : n}
              </div>
              <div className="text-center mt-2">
                <p className={cn('text-xs font-medium', active ? 'text-primary' : 'text-muted-foreground')}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">{step.sublabel}</p>
              </div>
            </div>

            {i < steps.length - 1 && (
              <Separator
                orientation="horizontal"
                className={cn('w-16 sm:w-24 mx-2 mb-8 transition-all duration-300', done ? 'bg-primary' : 'bg-border')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
