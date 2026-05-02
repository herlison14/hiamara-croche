import { cn } from '@/lib/cn'

interface StatsCardProps {
  titulo: string
  valor: string | number
  icone: React.ReactNode
  cor?: 'rosa' | 'verde' | 'azul' | 'amarelo'
  sublabel?: string
}

const cores = {
  rosa: 'bg-[#F4C5CB] text-[#A85A65]',
  verde: 'bg-green-100 text-green-700',
  azul: 'bg-blue-100 text-blue-700',
  amarelo: 'bg-yellow-100 text-yellow-700',
}

export function StatsCard({ titulo, valor, icone, cor = 'rosa', sublabel }: StatsCardProps) {
  return (
    <div className="bg-white border border-[#EDE0CD] rounded-2xl p-5 flex items-start gap-4">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', cores[cor])}>
        {icone}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#8A7B7B]">{titulo}</p>
        <p className="text-2xl font-light text-[#3D2B2B] mt-0.5" style={{ fontFamily: 'Cormorant Garamond' }}>
          {valor}
        </p>
        {sublabel && <p className="text-xs text-[#8A7B7B] mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
