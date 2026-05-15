'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Menu, X, Search, Instagram } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/cn'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/categorias', label: 'Categorias' },
]

function CrochetMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-rosa-500"
    >
      <path
        d="M4 20L12 12M12 12L17 7C18 6 20 6.5 20 8C20 9.5 18.5 10 17 11L13 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path
        d="M19 5L20 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 18C5 19 4 18 5 17"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const totalItems = useCartStore((s) => s.totalItems())
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  // mounted: evita hydration mismatch no badge do carrinho — o estado do Zustand
  // só hidrata do localStorage após mount, então no SSR totalItems=0
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha menu/busca em mudança de rota
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    startTransition(() => {
      router.push(`/produtos?busca=${encodeURIComponent(q)}`)
    })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500 ease-out-expo',
        scrolled
          ? 'bg-creme-50/90 backdrop-blur-xl border-b border-creme-200 shadow-xs'
          : 'bg-creme-50/70 backdrop-blur-md border-b border-transparent'
      )}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Hiamara Crochê — Página inicial"
          >
            <CrochetMark />
            <span className="font-display italic text-xl md:text-2xl text-texto-escuro tracking-wide group-hover:text-rosa-500 transition-colors duration-300">
              Hiamara <span className="not-italic font-light">Crochê</span>
            </span>
          </Link>

          {/* Nav central */}
          <nav
            className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2"
            aria-label="Navegação principal"
          >
            {navLinks.map(({ href, label }) => {
              const active =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(href + '/')

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300',
                    active
                      ? 'text-rosa-500'
                      : 'text-texto-medio hover:text-texto-escuro'
                  )}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px w-6 bg-rosa-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              aria-label="Buscar produtos"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-500 transition-colors"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>

            <a
              href="https://www.instagram.com/hiamaracroche"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @hiamaracroche"
              className="hidden sm:flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-500 transition-colors"
            >
              <Instagram size={18} strokeWidth={1.6} />
            </a>

            <Link
              href="/carrinho"
              aria-label={`Carrinho — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
              className="relative flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-500 transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {mounted && totalItems > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-semibold bg-rosa-500 text-white rounded-full leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 text-texto-medio hover:text-rosa-500 transition-colors"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full bg-creme-50/95 backdrop-blur-xl border-b border-creme-200 shadow-sm animate-slide-down">
          <div className="container-wide py-5">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search size={18} className="text-rosa-400 shrink-0" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você está procurando? Ex: blusa, bolsa, amigurumi..."
                className="flex-1 bg-transparent text-base md:text-lg text-texto-escuro placeholder-texto-claro/70 font-light focus:outline-none py-2"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs uppercase tracking-[0.18em] text-texto-claro hover:text-rosa-500 transition-colors"
                aria-label="Fechar busca"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu mobile */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-creme-200 bg-creme-50 animate-slide-down"
          aria-label="Navegação mobile"
        >
          <ul className="container-wide flex flex-col py-4">
            {navLinks.map(({ href, label }) => {
              const active =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block py-3.5 text-base font-medium transition-colors border-b border-creme-100',
                      active
                        ? 'text-rosa-500'
                        : 'text-texto-medio hover:text-texto-escuro'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link
                href="/carrinho"
                className="block py-3.5 text-base font-medium text-texto-medio hover:text-texto-escuro transition-colors border-b border-creme-100"
              >
                Carrinho{mounted && totalItems > 0 && ` (${totalItems})`}
              </Link>
            </li>
            <li className="pt-4">
              <a
                href="https://wa.me/5521997927927"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Falar no WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
