'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/cn'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/carrinho', label: 'Carrinho' },
]

function CrochetNeedleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 17L10 10M10 10L14 6C15 5 16.5 5 17 6C17.5 7 17 8.5 16 9L12 13"
        stroke="#C97A84"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="1.5" fill="#C97A84" />
      <path
        d="M16 4L17 3"
        stroke="#C97A84"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const totalItems = useCartStore((s) => s.totalItems())
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-creme-50/95 backdrop-blur-md border-b border-creme-200">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="HIAMARA CROCHÊ — Página inicial"
          >
            <CrochetNeedleIcon />
            <span className="font-display italic text-xl text-texto-escuro tracking-wide group-hover:text-rosa-400 transition-colors duration-200">
              HIAMARA CROCHÊ
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-sans tracking-wide transition-colors duration-200',
                  pathname === href
                    ? 'text-rosa-400 font-medium'
                    : 'text-texto-medio hover:text-rosa-400'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/hiamaracroche?igsh=dXZoOXNlM2xsOXl5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram @hiamaracroche"
              className="flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-400 transition-colors duration-200"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>

            <Link
              href="/carrinho"
              aria-label={`Carrinho — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
              className="relative flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-400 transition-colors duration-200"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-sans font-medium bg-rosa-400 text-white rounded-full">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-400 transition-colors duration-200"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden border-t border-creme-200 bg-creme-50"
          aria-label="Navegação mobile"
        >
          <ul className="container-main flex flex-col py-4 gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'block py-3 text-base font-sans transition-colors duration-200',
                    pathname === href
                      ? 'text-rosa-400 font-medium'
                      : 'text-texto-medio hover:text-rosa-400'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
