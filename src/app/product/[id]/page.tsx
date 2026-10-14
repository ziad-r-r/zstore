'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartProvider'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, ShoppingCart, Check, Tag } from 'lucide-react'

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

function calcLineTotal(basePrice: number, offer2Price: number | null | undefined, qty: number) {
  if (!offer2Price || qty < 2) return basePrice * qty
  const pairs = Math.floor(qty / 2)
  const rem = qty % 2
  return pairs * offer2Price + rem * basePrice
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
          if (data.colors?.[0]) setSelectedColor(data.colors[0])
          if (data.sizes?.[0]) setSelectedSize(data.sizes[0])
        }
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const lineTotal = useMemo(() => {
    if (!product) return 0
    return calcLineTotal(product.basePrice, product.offer2Price, quantity)
  }, [product, quantity])

  const hasOffer = !!(product?.offer2Price && product.offer2Price > 0)
  const offerActive = hasOffer && quantity >= 2
  const normalTotal = product ? product.basePrice * quantity : 0

  if (loading) return (<><Header /><div className="flex-1 py-20 text-center text-muted">جاري التحميل...</div><Footer /></>)
  if (!product) return (<><Header /><div className="flex-1 py-20 text-center"><button onClick={() => router.push('/')} className="text-coffee underline">العودة</button></div><Footer /></>)

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border aspect-square grid place-items-center text-8xl" style={{ background: product.tone }}>{product.emoji}</div>
        <div>
          <h1 className="text-2xl font-bold text-coffee-dark">{product.name}</h1>
          <p className="text-3xl font-bold text-coffee mt-2">{formatPrice(product.basePrice)} <span className="text-sm text-muted font-normal">للقطعة</span></p>
          {hasOffer && (
            <div className="mt-3 inline-flex items-center gap-2 bg-success/10 text-success border border-success/30 rounded-full px-3 py-1.5 text-sm font-semibold">
              <Tag className="w-4 h-4" /> عرض: قطعتين بـ {formatPrice(product.offer2Price!)}
            </div>
          )}
          <p className="text-muted mt-4">{product.description}</p>
          <div className="mt-6">
            <p className="font-semibold mb-2">اللون</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-full border text-sm ${selectedColor === c ? 'bg-coffee text-white border-coffee' : 'bg-white border-border'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold mb-2">المقاس</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-full border text-sm ${selectedSize === s ? 'bg-coffee text-white border-coffee' : 'bg-white border-border'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border grid place-items-center"><Minus className="w-4 h-4" /></button>
            <span className="font-semibold w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border grid place-items-center"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="mt-4 p-4 rounded-2xl bg-beige/60 border border-border">
            <div className="flex justify-between">
              <span className="text-sm text-muted">المجموع</span>
              <div className="text-left">
                {offerActive && <span className="text-sm text-muted line-through block">{formatPrice(normalTotal)}</span>}
                <span className="text-xl font-bold text-coffee">{formatPrice(lineTotal)}</span>
              </div>
            </div>
          </div>
          <button
            className={`mt-6 flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold ${added ? 'bg-success' : 'bg-coffee hover:bg-coffee-dark'}`}
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                price: product.basePrice,
                offer2Price: product.offer2Price ?? null,
                image: '',
                color: selectedColor,
                size: selectedSize,
                quantity,
                emoji: product.emoji,
                tone: product.tone,
              })
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
          >
            {added ? <><Check className="w-5 h-5" /> تمت الإضافة</> : <><ShoppingCart className="w-5 h-5" /> أضف إلى السلة</>}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
