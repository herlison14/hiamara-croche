'use client'

import { useState, useEffect, useRef } from 'react'
import type { StatusPagamento } from '@/lib/types'

interface UsePixPollingOptions {
  enabled?: boolean
  intervalMs?: number
  onPago?: () => void
}

export function usePixPolling(
  pedidoNumero: string,
  email: string,
  options: UsePixPollingOptions = {}
) {
  const { enabled = true, intervalMs = 15000, onPago } = options
  const [status, setStatus] = useState<StatusPagamento>('pendente')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startedAt = useRef(Date.now())

  const verificar = async () => {
    if (!pedidoNumero || !email) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/pedidos?numero=${encodeURIComponent(pedidoNumero)}&email=${encodeURIComponent(email)}`
      )
      if (!res.ok) return
      const data = await res.json()
      const novoStatus: StatusPagamento = data.pagamento_status
      setStatus(novoStatus)
      if (novoStatus === 'aprovado') {
        onPago?.()
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    } catch {
      setError('Erro ao verificar pagamento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return
    verificar()
    intervalRef.current = setInterval(() => {
      if (Date.now() - startedAt.current > 30 * 60 * 1000) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }
      verificar()
    }, intervalMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, pedidoNumero, email])

  return { status, loading, error }
}
