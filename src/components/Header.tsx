'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'
import { ShoppingCart, Store } from 'lucide-react'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-coffee text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90">
          <Store className="w-7 h-7" />
          <span>Zstore</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="hover:underline opacity-90">المتجر</Link>
          <Link href="/cart" className="relative flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25">
            <ShoppingCart className="w-4 h-4" />
            السلة
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-coffee-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/admin" className="hover:underline opacity-90">الإدارة</Link>
        </nav>
      </div>
    </header>
  )
}
