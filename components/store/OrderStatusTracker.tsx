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
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-creme-200" />
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
                  done && 'bg-rosa-300 text-white',
                  active && 'bg-rosa-400 text-white animate-pulse',
                  future && 'bg-creme-100 text-texto-claro border border-creme-200'
                )}
              >
                {etapa.icon}
              </div>
              <div className="pt-1.5">
                <p className={cn('font-medium text-sm', future ? 'text-texto-claro' : 'text-texto-escuro')}>
                  {etapa.label}
                </p>
                {(done || active) && (
                  <p className="text-xs text-texto-claro mt-0.5">{etapa.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
