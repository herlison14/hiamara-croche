'use client'

import { useState, useCallback } from 'react'

export interface EnderecoViaCep {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export function useViaCep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarCep = useCallback(async (cep: string): Promise<EnderecoViaCep | null> => {
    const limpo = cep.replace(/\D/g, '')
    if (limpo.length !== 8) return null

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`)
      const data: EnderecoViaCep = await res.json()
      if (data.erro) {
        setError('CEP não encontrado')
        return null
      }
      return data
    } catch {
      setError('Erro ao buscar CEP')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { buscarCep, loading, error }
}
