'use client'
import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

type Product = {
  id: string
  name: string
  description: string
  basePrice: number
  offer2Price?: number | null
  colors: string[]
  sizes: string[]
  stock: number
  emoji: string
  tone: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  const list = useMemo(
    () =>
      products.filter((p) => {
        const hit = !q || p.name.includes(q) || p.description.includes(q)
        const c = !color || p.colors.includes(color)
        return hit && c
      }),
    [products, q, color]
  )

  const colors = [...new Set(products.flatMap((p) => p.colors))]

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-coffee-dark mb-1">مرحباً بك في Zstore</h1>
        <p className="text-muted mb-5">اكتشف أحدث المنتجات بأفضل الأسعار</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <input
            className="rounded-full border border-border bg-white px-4 py-2 text-sm"
            placeholder="ابحث..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-full border border-border bg-white px-4 py-2 text-sm"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="">كل الألوان</option>
            {colors.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:border-accent relative"
            >
              {p.offer2Price ? (
                <span className="absolute top-2 right-2 z-10 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  عرض قطعتين
                </span>
              ) : null}
              <div
                className="aspect-square grid place-items-center text-6xl"
                style={{ background: p.tone }}
              >
                {p.emoji}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm sm:text-base">{p.name}</h3>
                <p className="text-coffee font-bold mt-1">{formatPrice(p.basePrice)}</p>
                {p.offer2Price ? (
                  <p className="text-success text-xs mt-0.5">
                    قطعتين بـ {formatPrice(p.offer2Price)}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center text-muted py-12">لا توجد منتجات مطابقة</p>
        )}
      </main>
      <Footer />
    </>
  )
}
