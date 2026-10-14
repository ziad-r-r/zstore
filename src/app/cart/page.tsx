'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartProvider'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, Tag } from 'lucide-react'

const NOTES_KEY = 'zstore_cart_notes'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    lineTotal,
  } = useCart()
  const [notes, setNotes] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY)
      if (saved) setNotes(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, notes)
    } catch {}
  }, [notes])

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <ShoppingBag className="w-16 h-16 text-muted mb-4" />
          <h1 className="text-2xl font-bold text-coffee-dark mb-2">
            السلة فارغة
          </h1>
          <p className="text-muted mb-6">أضف منتجات لتبدأ التسوق</p>
          <Link
            href="/"
            className="bg-coffee text-white px-6 py-3 rounded-full font-semibold hover:bg-coffee-dark transition"
          >
            تصفح المنتجات
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-coffee-dark mb-6">
          سلة التسوق ({totalItems} منتج)
        </h1>

        <div className="space-y-4">
          {items.map((item) => {
            const total = lineTotal(item)
            const normal = item.price * item.quantity
            const hasOffer =
              !!item.offer2Price && item.quantity >= 2 && total < normal
            return (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-4 bg-white rounded-2xl border border-border p-4"
              >
                <div
                  className="w-24 h-24 rounded-xl flex-shrink-0 grid place-items-center text-4xl"
                  style={{ background: item.tone || '#E8DFD0' }}
                >
                  {item.emoji || '🛍️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text truncate">
                    {item.name}
                  </h3>
                  <div className="text-sm text-muted mt-1 space-x-2 space-x-reverse">
                    {item.color && <span>اللون: {item.color}</span>}
                    {item.size && <span>المقاس: {item.size}</span>}
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    {formatPrice(item.price)} / قطعة
                    {item.offer2Price ? (
                      <span className="text-success mr-2 inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        قطعتين بـ {formatPrice(item.offer2Price)}
                      </span>
                    ) : null}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.color,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-beige"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.color,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-beige"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId, item.color, item.size)
                      }
                      className="mr-auto text-danger hover:opacity-70"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-left self-center">
                  {hasOffer && (
                    <p className="text-xs text-muted line-through">
                      {formatPrice(normal)}
                    </p>
                  )}
                  <p className="font-bold text-coffee">{formatPrice(total)}</p>
                  {hasOffer && (
                    <p className="text-xs text-success">بعد العرض</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-border p-5">
          <label className="block text-sm font-semibold mb-2">
            ملاحظات على الطلب (اختياري)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثلاً: لون معين، موعد توصيل، هدية..."
            className="w-full rounded-xl border border-border px-4 py-3 focus:border-coffee bg-offwhite text-sm"
          />
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-border p-6">
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع</span>
            <span className="text-coffee">{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-sm text-muted mt-2">سعر المنتجات فقط</p>
          <Link
            href="/checkout"
            onClick={() => {
              try {
                if (notes.trim()) {
                  sessionStorage.setItem('zstore_checkout_notes', notes.trim())
                }
              } catch {}
            }}
            className="mt-4 block w-full text-center bg-coffee text-white py-3.5 rounded-full font-semibold hover:bg-coffee-dark transition"
          >
            إتمام الطلب
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
