'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

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
                  done && 'bg-[#C97A84] text-white',
                  active && 'bg-[#C97A84] text-white shadow-[0_0_0_4px_rgba(201,122,132,0.2)]',
                  !done && !active && 'bg-[#F5EFE6] text-[#8A7B7B] border border-[#EDE0CD]'
                )}
              >
                {done ? <Check size={16} /> : n}
              </div>
              <div className="text-center mt-2">
                <p className={cn('text-xs font-medium', active ? 'text-[#C97A84]' : 'text-[#8A7B7B]')}>
                  {step.label}
                </p>
                <p className="text-[10px] text-[#8A7B7B] hidden sm:block">{step.sublabel}</p>
              </div>
            </div>

            {i < steps.length - 1 && (
              <div className={cn('w-16 sm:w-24 h-0.5 mx-2 mb-8 transition-all duration-300', done ? 'bg-[#C97A84]' : 'bg-[#EDE0CD]')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
