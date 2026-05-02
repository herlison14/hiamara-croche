import { Check, Clock, Package, Truck, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { StatusPedido } from '@/lib/types'

const etapas: Array<{ status: StatusPedido; label: string; desc: string; icon: React.ReactNode }> = [
  { status: 'aguardando_pagamento', label: 'Pedido Recebido', desc: 'Aguardando confirmação do pagamento', icon: <Clock size={18} /> },
  { status: 'pago', label: 'Pagamento Confirmado', desc: 'Seu pagamento foi aprovado!', icon: <Check size={18} /> },
  { status: 'em_producao', label: 'Em Produção', desc: 'Sua peça está sendo feita com carinho', icon: <Package size={18} /> },
  { status: 'enviado', label: 'Enviado', desc: 'A caminho de você!', icon: <Truck size={18} /> },
  { status: 'entregue', label: 'Entregue', desc: 'Aproveite sua peça única!', icon: <Star size={18} /> },
]

const ordem: StatusPedido[] = ['aguardando_pagamento', 'pago', 'em_producao', 'enviado', 'entregue']

interface OrderStatusTrackerProps {
  status: StatusPedido
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = ordem.indexOf(status)

  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#EDE0CD]" />
      <div className="space-y-6">
        {etapas.map((etapa, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          const future = i > currentIndex

          return (
            <div key={etapa.status} className="flex items-start gap-4 relative">
              <div
                className={cn(
                  'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                  done && 'bg-green-500 text-white',
                  active && 'bg-[#C97A84] text-white animate-pulse',
                  future && 'bg-[#F5EFE6] text-[#8A7B7B] border border-[#EDE0CD]'
                )}
              >
                {etapa.icon}
              </div>
              <div className="pt-1.5">
                <p className={cn('font-medium text-sm', future ? 'text-[#8A7B7B]' : 'text-[#3D2B2B]')}>
                  {etapa.label}
                </p>
                {(done || active) && (
                  <p className="text-xs text-[#8A7B7B] mt-0.5">{etapa.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
