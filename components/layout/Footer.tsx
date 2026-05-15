import Link from 'next/link'
import { Instagram, Mail, MessageCircle, MapPin } from 'lucide-react'
import { NewsletterForm } from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-texto-escuro text-creme-100 mt-0">
      {/* Newsletter band */}
      <div className="border-b border-creme-200/10">
        <div className="container-wide py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-rosa-200 mb-3 font-medium">
                Boletim Hiamara
              </p>
              <h3 className="font-display text-3xl md:text-4xl font-light leading-tight text-creme-50">
                Novidades, lançamentos e{' '}
                <span className="italic text-rosa-200">mimos exclusivos</span>{' '}
                no seu e-mail.
              </h3>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Sitemap */}
      <div className="container-wide py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link
              href="/"
              className="font-display italic text-2xl text-creme-50 tracking-wide"
            >
              Hiamara Crochê
            </Link>
            <p className="mt-4 text-sm text-creme-100/70 font-light leading-relaxed max-w-xs">
              Peças únicas em crochê, feitas à mão com fios selecionados e o
              cuidado de quem ama o ofício.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/hiamaracroche"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-creme-200/20 flex items-center justify-center text-creme-100 hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all"
              >
                <Instagram size={16} strokeWidth={1.75} />
              </a>
              <a
                href="https://wa.me/5521997927927"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-creme-200/20 flex items-center justify-center text-creme-100 hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all"
              >
                <MessageCircle size={16} strokeWidth={1.75} />
              </a>
              <a
                href="mailto:contato@hiamaracroche.com.br"
                aria-label="E-mail"
                className="w-10 h-10 rounded-full border border-creme-200/20 flex items-center justify-center text-creme-100 hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all"
              >
                <Mail size={16} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Loja */}
          <div className="md:col-span-3 md:col-start-6">
            <h4 className="text-[0.7rem] uppercase tracking-[0.22em] text-rosa-200 font-medium mb-5">
              Loja
            </h4>
            <ul className="space-y-3 text-sm font-light">
              {[
                { href: '/produtos', label: 'Todos os produtos' },
                { href: '/produtos?categoria=Blusas', label: 'Blusas & Tops' },
                { href: '/produtos?categoria=Bolsas', label: 'Bolsas' },
                { href: '/produtos?categoria=Bonecos', label: 'Amigurumis' },
                { href: '/produtos?categoria=Decoração', label: 'Decoração' },
                { href: '/categorias', label: 'Por categoria' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-creme-100/75 hover:text-rosa-200 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div className="md:col-span-3">
            <h4 className="text-[0.7rem] uppercase tracking-[0.22em] text-rosa-200 font-medium mb-5">
              Atendimento
            </h4>
            <ul className="space-y-3 text-sm font-light text-creme-100/75">
              <li className="flex items-start gap-2.5">
                <MessageCircle size={14} className="mt-0.5 text-rosa-200 shrink-0" />
                <a
                  href="https://wa.me/5521997927927"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rosa-200 transition-colors"
                >
                  (21) 99792-7927
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-0.5 text-rosa-200 shrink-0" />
                <a
                  href="mailto:contato@hiamaracroche.com.br"
                  className="hover:text-rosa-200 transition-colors break-all"
                >
                  contato@hiamaracroche.com.br
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 text-rosa-200 shrink-0" />
                <span>Envio para todo o Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória + copy */}
        <div className="mt-14 pt-8 border-t border-creme-200/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-creme-100/60 font-light">
          <p>
            © {new Date().getFullYear()} Hiamara Crochê · Todos os direitos
            reservados.
          </p>
          <p className="text-[0.7rem] uppercase tracking-[0.2em]">
            Feito à mão, entregue com amor
          </p>
        </div>
      </div>
    </footer>
  )
}
