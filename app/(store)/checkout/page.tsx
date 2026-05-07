'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CheckoutSteps } from '@/components/store/CheckoutSteps'
import { PixQRCode } from '@/components/store/PixQRCode'
import { useViaCep } from '@/hooks/useViaCep'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
      <div className="min-h-screen bg-creme-50 py-16 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-3xl font-light text-texto-escuro text-center mb-8">
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
    <div className="min-h-screen bg-creme-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-light text-texto-escuro text-center mb-8">
          Finalizar Compra
        </h1>

        <CheckoutSteps currentStep={step} steps={STEPS} />

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4 bg-creme-50 border border-creme-200 rounded-2xl p-6">
            <h2 className="font-display text-xl font-light text-texto-escuro">Seus Dados</h2>
            {[
              { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
              { name: 'email', label: 'E-mail', type: 'email', required: true },
              { name: 'telefone', label: 'WhatsApp / Telefone', type: 'tel', required: false },
            ].map((f) => (
              <div key={f.name}>
                <Label htmlFor={f.name} className="mb-1">{f.label}</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  defaultValue={(dados as Record<string, string>)[f.name] ?? ''}
                />
              </div>
            ))}
            <Button type="submit" size="md" className="w-full">Continuar</Button>
          </form>
        )}

        {step === 2 && (
          <form id="form-endereco" onSubmit={handleStep2} className="space-y-4 bg-creme-50 border border-creme-200 rounded-2xl p-6">
            <h2 className="font-display text-xl font-light text-texto-escuro">Endereço de Entrega</h2>
            <div>
              <Label htmlFor="cep" className="mb-1">CEP</Label>
              <Input
                id="cep"
                name="cep"
                type="text"
                required
                placeholder="00000-000"
                maxLength={9}
                onChange={(e) => { if (e.target.value.replace(/\D/g, '').length === 8) handleCep(e.target.value) }}
              />
              {cepLoading && <p className="text-xs text-texto-claro mt-1">Buscando CEP...</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="rua" className="mb-1">Rua / Logradouro</Label>
                <Input id="rua" name="rua" type="text" />
              </div>
              <div>
                <Label htmlFor="numero" className="mb-1">Número</Label>
                <Input id="numero" name="numero" type="text" />
              </div>
              <div>
                <Label htmlFor="complemento" className="mb-1">Complemento</Label>
                <Input id="complemento" name="complemento" type="text" />
              </div>
              <div>
                <Label htmlFor="bairro" className="mb-1">Bairro</Label>
                <Input id="bairro" name="bairro" type="text" />
              </div>
              <div>
                <Label htmlFor="cidade" className="mb-1">Cidade</Label>
                <Input id="cidade" name="cidade" type="text" />
              </div>
              <div>
                <Label htmlFor="estado" className="mb-1">Estado (UF)</Label>
                <Input id="estado" name="estado" type="text" />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes" className="mb-1">Observações</Label>
              <Textarea id="observacoes" name="observacoes" rows={2} />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit" size="md" className="flex-1">Continuar</Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6 space-y-3">
              <h2 className="font-display text-xl font-light text-texto-escuro">Revisão do Pedido</h2>
              {items.map((item) => (
                <div key={item.produto.id} className="flex justify-between text-sm text-texto-medio">
                  <span>{item.produto.nome} × {item.quantidade}</span>
                  <span>R$ {((item.produto.preco_promocional ?? item.produto.preco) * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
              <div className="border-t border-creme-200 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-texto-medio">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-texto-medio">
                  <span>Frete</span>
                  <span>{frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2).replace('.', ',')}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-texto-escuro text-base pt-1">
                  <span>Total</span>
                  <span className="font-display text-rosa-500">
                    R$ {totalFinal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button
                onClick={handleFinalizarPedido}
                disabled={loading}
                size="md"
                className="flex-1"
              >
                {loading ? 'Gerando PIX...' : 'Gerar PIX e Finalizar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
