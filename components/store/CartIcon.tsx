'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems())
  const [bounce, setBounce] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || totalItems === 0) return
    setBounce(true)
    const t = setTimeout(() => setBounce(false), 600)
    return () => clearTimeout(t)
  }, [totalItems, mounted])

  return (
    <Link href="/carrinho" className="relative inline-flex items-center p-2 text-[#5C4A4A] hover:text-[#C97A84] transition-colors duration-200">
      <ShoppingBag
        size={22}
        className={bounce ? 'animate-bounce' : ''}
      />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#C97A84] rounded-full leading-none">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}
