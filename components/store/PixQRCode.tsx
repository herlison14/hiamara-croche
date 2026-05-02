'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePixPolling } from '@/hooks/usePixPolling'

interface PixQRCodeProps {
  qrCodeBase64: string
  copiaCola: string
  valor: number
  expiracao: string
  numeroPedido: string
  email: string
  onPago?: () => void
}

function useCountdown(expiracao: string) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const calc = () => Math.max(0, Math.floor((new Date(expiracao).getTime() - Date.now()) / 1000))
    setSeconds(calc())
    const t = setInterval(() => setSeconds(calc()), 1000)
    return () => clearInterval(t)
  }, [expiracao])
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return { seconds, formatted: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` }
}

export function PixQRCode({ qrCodeBase64, copiaCola, valor, expiracao, numeroPedido, email, onPago }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false)
  const { seconds, formatted } = useCountdown(expiracao)
  const { status } = usePixPolling(numeroPedido, email, { onPago })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copiaCola)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'aprovado') {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={40} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
          Pagamento Confirmado!
        </h3>
        <p className="text-[#8A7B7B]">Seu pedido <strong>{numeroPedido}</strong> entrou em produção.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#EDE0CD] rounded-2xl p-6 space-y-5 max-w-md mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6.8 6.8L13.4 0.2C13.7 -0.1 14.3 -0.1 14.6 0.2L21.2 6.8C21.5 7.1 21.5 7.7 21.2 8L14.6 14.6C14.3 14.9 13.7 14.9 13.4 14.6L6.8 8C6.5 7.7 6.5 7.1 6.8 6.8Z" fill="#32BCAD"/>
            <path d="M21.2 13.4L27.8 20C28.1 20.3 28.1 20.9 27.8 21.2L21.2 27.8C20.9 28.1 20.3 28.1 20 27.8L13.4 21.2C13.1 20.9 13.1 20.3 13.4 20L20 13.4C20.3 13.1 20.9 13.1 21.2 13.4Z" fill="#32BCAD"/>
            <path d="M6.8 13.4L13.4 20C13.7 20.3 13.7 20.9 13.4 21.2L6.8 27.8C6.5 28.1 5.9 28.1 5.6 27.8L-0.999969 21.2C-1.3 20.9 -1.3 20.3 -0.999969 20L5.6 13.4C5.9 13.1 6.5 13.1 6.8 13.4Z" fill="#32BCAD"/>
          </svg>
          <span className="text-lg font-semibold text-[#3D2B2B]">Pague com PIX</span>
        </div>
        <p className="text-3xl font-light text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>
          R$ {valor.toFixed(2).replace('.', ',')}
        </p>
      </div>

      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code PIX"
          className="w-48 h-48 border-4 border-[#F5EFE6] rounded-xl"
        />
      </div>

      <div className={cn('text-center text-sm font-medium', seconds < 300 ? 'text-red-500' : 'text-[#8A7B7B]')}>
        ⏱ Expira em {formatted}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[#8A7B7B] uppercase tracking-widest text-center">PIX Copia e Cola</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={copiaCola}
            className="flex-1 bg-[#F5EFE6] border border-[#EDE0CD] rounded-lg px-3 py-2 text-xs text-[#5C4A4A] truncate"
          />
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              copied ? 'bg-green-500 text-white' : 'bg-[#C97A84] text-white hover:bg-[#A85A65]'
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <ol className="space-y-2 text-sm text-[#5C4A4A]">
        {['Abra o app do seu banco', 'Escaneie o QR code ou cole o código PIX', 'Confirme o pagamento'].map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F4C5CB] text-[#A85A65] text-xs flex items-center justify-center font-semibold">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <p className="text-xs text-[#8A7B7B] text-center border-t border-[#EDE0CD] pt-4">
        Após o pagamento, a confirmação é automática em até 5 minutos.
        <br />
        <RefreshCw size={12} className="inline mr-1 animate-spin" />
        Verificando pagamento automaticamente...
      </p>
    </div>
  )
}
