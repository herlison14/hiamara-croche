'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [enviado, setEnviado] = useState(false)

  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        setEnviado(true)
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Seu e-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="seu@email.com"
        required
        disabled={enviado}
        className="flex-1 px-5 py-3.5 rounded-full bg-creme-50/10 border border-creme-200/20 text-creme-50 placeholder-creme-100/40 text-sm focus:outline-none focus:bg-creme-50/15 focus:border-rosa-200 transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={enviado}
        className="px-7 py-3.5 rounded-full bg-rosa-400 hover:bg-rosa-500 text-white text-xs uppercase tracking-[0.18em] font-medium transition-colors shadow-rosa disabled:bg-creme-100/20 disabled:shadow-none disabled:cursor-default"
      >
        {enviado ? 'Inscrito!' : 'Quero receber'}
      </button>
    </form>
  )
}
