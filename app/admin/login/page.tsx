'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlowerBackground } from '@/components/layout/FlowerBackground'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [ver, setVer] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setErro(data.error ?? 'Senha incorreta')
      }
    } catch {
      setErro('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-creme-50 flex items-center justify-center px-6">
      <FlowerBackground opacity={0.10} />
      <div className="relative z-10 w-full max-w-sm bg-creme-50 border border-creme-200 rounded-2xl p-8 shadow-[0_8px_40px_rgba(61,43,43,0.08)]">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-light text-texto-escuro">
            HIAMARA <em>CROCHÊ</em>
          </h1>
          <p className="text-xs text-texto-claro uppercase tracking-widest mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-texto-claro mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={ver ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 border border-creme-200 rounded-lg text-sm text-texto-medio focus:outline-none focus:border-rosa-300 focus:ring-[3px] focus:ring-rosa-100 bg-creme-50"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setVer(!ver)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-claro hover:text-rosa-400 transition-colors">
                {ver ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rosa-400 hover:bg-rosa-500 disabled:opacity-60 text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
