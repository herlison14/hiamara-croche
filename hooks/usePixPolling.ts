'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { StatusPagamento } from '@/lib/types'

interface UsePixPollingOptions {
  enabled?: boolean
  /** Intervalo inicial em ms. Cresce com backoff suave a cada erro. */
  intervalMs?: number
  /** Timeout total em ms. Default: 35 minutos (5 min de folga após expiração do PIX). */
  timeoutMs?: number
  onPago?: () => void
  onExpirado?: () => void
}

const STATUS_FINAIS: StatusPagamento[] = ['aprovado', 'rejeitado', 'expirado']

export function usePixPolling(
  pedidoNumero: string,
  email: string,
  options: UsePixPollingOptions = {}
) {
  const {
    enabled = true,
    intervalMs = 12000,
    timeoutMs = 35 * 60 * 1000,
    onPago,
    onExpirado,
  } = options

  const [status, setStatus] = useState<StatusPagamento>('pendente')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [erros, setErros] = useState(0)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(Date.now())
  const finalRef = useRef(false)

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const verificar = useCallback(async () => {
    if (!pedidoNumero || !email || finalRef.current) return

    if (Date.now() - startedAt.current > timeoutMs) {
      finalRef.current = true
      stop()
      onExpirado?.()
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `/api/pedidos?numero=${encodeURIComponent(pedidoNumero)}&email=${encodeURIComponent(email)}`,
        { cache: 'no-store' }
      )

      if (!res.ok) {
        setErros((e) => e + 1)
        return
      }

      const data = await res.json()
      const novoStatus = data.pagamento_status as StatusPagamento

      if (novoStatus && novoStatus !== status) {
        setStatus(novoStatus)
      }
      setErros(0)
      setError(null)

      if (STATUS_FINAIS.includes(novoStatus)) {
        finalRef.current = true
        stop()
        if (novoStatus === 'aprovado') onPago?.()
        if (novoStatus === 'expirado') onExpirado?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar pagamento')
      setErros((e) => e + 1)
    } finally {
      setLoading(false)
    }
  }, [pedidoNumero, email, timeoutMs, status, onPago, onExpirado, stop])

  // Agenda próxima verificação com backoff suave em caso de erros.
  useEffect(() => {
    if (!enabled || finalRef.current) return

    // Backoff: a cada erro multiplica por 1.5, máximo 60s
    const delay = Math.min(
      intervalMs * Math.pow(1.5, Math.min(erros, 4)),
      60_000
    )

    timeoutRef.current = setTimeout(verificar, delay)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [enabled, verificar, erros, intervalMs])

  // Primeira verificação imediata
  useEffect(() => {
    if (!enabled) return
    verificar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  // Re-verifica quando a aba volta a ficar visível (não desperdiça polls)
  useEffect(() => {
    if (!enabled) return
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !finalRef.current) {
        verificar()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [enabled, verificar])

  return { status, loading, error, verificarAgora: verificar }
}
