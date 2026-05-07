import { Settings, ExternalLink } from 'lucide-react'

const envVars = [
  { key: 'NEXT_PUBLIC_SITE_URL', label: 'URL do Site', exemplo: 'https://hiamaracroche.com.br' },
  { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', label: 'Firebase Project ID', exemplo: 'hiamara-croche' },
  { key: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase URL', exemplo: 'https://xxx.supabase.co' },
  { key: 'MERCADOPAGO_PUBLIC_KEY', label: 'Mercado Pago Public Key', exemplo: 'APP_USR-...' },
  { key: 'ADMIN_SECRET', label: 'Senha Admin', exemplo: '••••••••' },
]

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-light text-texto-escuro">Configurações</h1>
        <p className="text-sm text-texto-claro mt-1">Visão geral das variáveis de ambiente do sistema.</p>
      </div>

      <section className="bg-white rounded-2xl border border-creme-200 divide-y divide-creme-100">
        <div className="px-6 py-4 flex items-center gap-2">
          <Settings size={16} className="text-rosa-400" />
          <h2 className="text-sm font-medium text-texto-escuro">Variáveis de Ambiente</h2>
        </div>
        {envVars.map(({ key, label, exemplo }) => {
          const value = process.env[key]
          const configured = Boolean(value)
          return (
            <div key={key} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-texto-escuro">{label}</p>
                <p className="text-xs text-texto-claro font-mono mt-0.5">{key}</p>
                {!configured && (
                  <p className="text-xs text-texto-claro mt-1 italic">ex: {exemplo}</p>
                )}
              </div>
              <span
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                  configured
                    ? 'bg-rosa-100 text-rosa-500'
                    : 'bg-creme-100 text-texto-claro'
                }`}
              >
                {configured ? 'Configurado' : 'Não configurado'}
              </span>
            </div>
          )
        })}
      </section>

      <section className="bg-creme-50 rounded-2xl border border-creme-200 p-6 space-y-3">
        <h2 className="text-sm font-medium text-texto-escuro">Como configurar</h2>
        <p className="text-sm text-texto-medio">
          As variáveis de ambiente são gerenciadas no painel do Vercel. Acesse{' '}
          <strong>Project Settings → Environment Variables</strong> para adicionar ou atualizar os valores.
        </p>
        <a
          href="https://vercel.com/herlison-santos-projects/herlison14-hiamara-croche/settings/environment-variables"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-rosa-400 hover:text-rosa-500 transition-colors"
        >
          Abrir Vercel Dashboard <ExternalLink size={13} />
        </a>
      </section>
    </div>
  )
}
