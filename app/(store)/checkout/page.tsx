'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CheckoutSteps } from '@/components/store/CheckoutSteps'
import { PixQRCode } from '@/components/store/PixQRCode'
import { useViaCep } from '@/hooks/useViaCep'
import toast from 'react-hot-toast'
import type { DadosCheckout } from '@/lib/types'

const STEPS = [
  { label: 'Dados', sublabel: 'Quem é você?' },
  { label: 'Endereço', sublabel: 'Onde entregar?' },
  { label: 'Pagamento', sublabel: 'PIX' },
]

interface PixData {
  qr_code_base64: string
  copia_cola: string
  expiracao: string
  pedido_numero: string
  pedido_id: string
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [dados, setDados] = useState<Partial<DadosCheckout>>({})
  const { buscarCep, loading: cepLoading } = useViaCep()

  const subtotal = total()
  const frete = subtotal >= 150 ? 0 : 25
  const totalFinal = subtotal + frete

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setDados((prev) => ({ ...prev, nome: fd.get('nome') as string, email: fd.get('email') as string, telefone: fd.get('telefone') as string }))
    setStep(2)
  }

  const handleCep = async (cep: string) => {
    const addr = await buscarCep(cep)
    if (addr) {
      const form = document.getElementById('form-endereco') as HTMLFormElement
      if (!form) return
      ;(form.querySelector('[name=rua]') as HTMLInputElement).value = addr.logradouro
      ;(form.querySelector('[name=bairro]') as HTMLInputElement).value = addr.bairro
      ;(form.querySelector('[name=cidade]') as HTMLInputElement).value = addr.localidade
      ;(form.querySelector('[name=estado]') as HTMLInputElement).value = addr.uf
    }
  }

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setDados((prev) => ({
      ...prev,
      endereco: {
        cep: fd.get('cep') as string,
        rua: fd.get('rua') as string,
        numero: fd.get('numero') as string,
        complemento: fd.get('complemento') as string,
        bairro: fd.get('bairro') as string,
        cidade: fd.get('cidade') as string,
        estado: fd.get('estado') as string,
      },
      observacoes: fd.get('observacoes') as string,
    }))
    setStep(3)
  }

  const handleFinalizarPedido = async () => {
    if (!dados.nome || !dados.email || !dados.endereco) return
    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itens: items.map((i) => ({
            produto_id: i.produto.id,
            quantidade: i.quantidade,
            variante_selecionada: i.variante_selecionada,
          })),
          cliente: { nome: dados.nome, email: dados.email, telefone: dados.telefone },
          endereco: dados.endereco,
          observacoes: dados.observacoes,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro ao criar pedido')
      const pedido = await res.json()

      const pixRes = await fetch('/api/pagamento/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: pedido.id }),
      })
      if (!pixRes.ok) throw new Error('Erro ao gerar PIX')
      const pix = await pixRes.json()

      setPixData({
        qr_code_base64: pix.qr_code_base64,
        copia_cola: pix.copia_cola,
        expiracao: pix.expiracao,
        pedido_numero: pedido.numero,
        pedido_id: pedido.id,
      })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao finalizar pedido')
    } finally {
      setLoading(false)
    }
  }

  const handlePago = () => {
    clearCart()
    router.push(`/pedido/${pixData?.pedido_numero}?email=${encodeURIComponent(dados.email ?? '')}`)
  }

  if (pixData) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] py-16 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-light text-[#3D2B2B] text-center mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
            Quase lá! Finalize o pagamento
          </h1>
          <PixQRCode
            qrCodeBase64={pixData.qr_code_base64}
            copiaCola={pixData.copia_cola}
            valor={totalFinal}
            expiracao={pixData.expiracao}
            numeroPedido={pixData.pedido_numero}
            email={dados.email ?? ''}
            onPago={handlePago}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-light text-[#3D2B2B] text-center mb-8" style={{ fontFamily: 'Cormorant Garamond' }}>
          Finalizar Compra
        </h1>

        <CheckoutSteps currentStep={step} steps={STEPS} />

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4 bg-white border border-[#EDE0CD] rounded-2xl p-6">
            <h2 className="text-xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Seus Dados</h2>
            {[
              { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
              { name: 'email', label: 'E-mail', type: 'email', required: true },
              { name: 'telefone', label: 'WhatsApp / Telefone', type: 'tel', required: false },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">{f.label}</label>
                <input name={f.name} type={f.type} required={f.required} defaultValue={(dados as Record<string, string>)[f.name] ?? ''}
                  className="w-full px-4 py-3 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84] focus:ring-[3px] focus:ring-[rgba(201,122,132,0.15)]" />
              </div>
            ))}
            <button type="submit" className="w-full py-3.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300">
              Continuar
            </button>
          </form>
        )}

        {step === 2 && (
          <form id="form-endereco" onSubmit={handleStep2} className="space-y-4 bg-white border border-[#EDE0CD] rounded-2xl p-6">
            <h2 className="text-xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Endereço de Entrega</h2>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">CEP</label>
              <input name="cep" type="text" required placeholder="00000-000" maxLength={9}
                onChange={(e) => { if (e.target.value.replace(/\D/g, '').length === 8) handleCep(e.target.value) }}
                className="w-full px-4 py-3 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
              {cepLoading && <p className="text-xs text-[#8A7B7B] mt-1">Buscando CEP...</p>}
            </div>
            {[
              { name: 'rua', label: 'Rua / Logradouro', full: true },
              { name: 'numero', label: 'Número', full: false },
              { name: 'complemento', label: 'Complemento', full: false },
              { name: 'bairro', label: 'Bairro', full: false },
              { name: 'cidade', label: 'Cidade', full: false },
              { name: 'estado', label: 'Estado (UF)', full: false },
            ].map((f) => (
              <div key={f.name} className={f.full ? '' : 'inline-block w-1/2 pr-2'}>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">{f.label}</label>
                <input name={f.name} type="text"
                  className="w-full px-4 py-3 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#8A7B7B] mb-1">Observações</label>
              <textarea name="observacoes" rows={2} className="w-full px-4 py-3 border border-[#EDE0CD] rounded-lg text-sm text-[#5C4A4A] focus:outline-none focus:border-[#C97A84] resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-[#EDE0CD] text-[#5C4A4A] text-sm font-medium uppercase tracking-widest rounded-md hover:border-[#C97A84] transition-all">
                Voltar
              </button>
              <button type="submit" className="flex-1 py-3.5 bg-[#C97A84] hover:bg-[#A85A65] text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300">
                Continuar
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-[#EDE0CD] rounded-2xl p-6 space-y-3">
              <h2 className="text-xl font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>Revisão do Pedido</h2>
              {items.map((item) => (
                <div key={item.produto.id} className="flex justify-between text-sm text-[#5C4A4A]">
                  <span>{item.produto.nome} × {item.quantidade}</span>
                  <span>R$ {((item.produto.preco_promocional ?? item.produto.preco) * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
              <div className="border-t border-[#EDE0CD] pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-[#5C4A4A]"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                <div className="flex justify-between text-[#5C4A4A]"><span>Frete</span><span>{frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2).replace('.', ',')}`}</span></div>
                <div className="flex justify-between font-semibold text-[#3D2B2B] text-base pt-1">
                  <span>Total</span>
                  <span className="text-[#A85A65]" style={{ fontFamily: 'Cormorant Garamond' }}>R$ {totalFinal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 border border-[#EDE0CD] text-[#5C4A4A] text-sm font-medium uppercase tracking-widest rounded-md hover:border-[#C97A84] transition-all">
                Voltar
              </button>
              <button
                onClick={handleFinalizarPedido}
                disabled={loading}
                className="flex-1 py-3.5 bg-[#C97A84] hover:bg-[#A85A65] disabled:opacity-60 text-white text-sm font-medium uppercase tracking-widest rounded-md transition-all duration-300"
              >
                {loading ? 'Gerando PIX...' : 'Gerar PIX e Finalizar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
