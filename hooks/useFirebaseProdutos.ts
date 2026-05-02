'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore'

interface Produto {
  id: string
  nome: string
  slug: string
  preco: number
  categoria: { nome: string }
  fotos: { url: string; alt?: string }[]
  descricao?: string
  ativo?: boolean
}

export function useFirebaseProdutos(limite?: number) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true)
        setError(null)

        const constraints: QueryConstraint[] = [where('ativo', '==', true)]
        const q = query(collection(db, 'produtos'), ...constraints)
        const querySnapshot = await getDocs(q)

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Produto))

        // Aplicar limite se fornecido
        const resultado = limite ? data.slice(0, limite) : data
        setProdutos(resultado)
      } catch (err) {
        console.error('Erro ao buscar produtos do Firebase:', err)
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar produtos'
        )
        setProdutos([])
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [limite])

  return { produtos, loading, error }
}
