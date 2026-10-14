'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Plus, Trash2, Edit2, X } from 'lucide-react'

interface Product {
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

const emptyForm = {
  name: '',
  description: '',
  basePrice: '',
  offer2Price: '',
  colors: '',
  sizes: '',
  stock: '',
  emoji: '🛍️',
  tone: '#C4A484',
}

function adminHeaders(): HeadersInit {
  const token =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('zstore_admin') || ''
      : ''
  return {
    'Content-Type': 'application/json',
    'x-admin-token': token,
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      basePrice: Number(form.basePrice),
      offer2Price: form.offer2Price === '' ? null : Number(form.offer2Price),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      emoji: form.emoji.trim() || '🛍️',
      tone: form.tone.trim() || '#C4A484',
    }
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: adminHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'فشل الحفظ — سجّل الدخول من /admin/login')
        setSaving(false)
        return
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      await load()
    } catch {
      setError('خطأ في الاتصال')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('حذف المنتج نهائياً؟')) return
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    })
    if (res.ok) load()
    else alert('فشل الحذف — سجّل الدخول أولاً')
  }

  const startEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description || '',
      basePrice: String(p.basePrice),
      offer2Price: p.offer2Price != null ? String(p.offer2Price) : '',
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      stock: String(p.stock ?? 0),
      emoji: p.emoji || '🛍️',
      tone: p.tone || '#C4A484',
    })
    setError('')
    setShowForm(true)
  }

  if (loading) return <p className="text-muted">جاري التحميل...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-coffee-dark">إدارة المنتجات</h1>
        <button
          onClick={() => {
            setEditing(null)
            setForm(emptyForm)
            setError('')
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-coffee text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> إضافة منتج
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">{editing ? 'تعديل منتج' : 'منتج جديد'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input placeholder="اسم المنتج *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" required />
          <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">سعر القطعة *</label>
              <input type="number" min={0} value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" required />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">سعر القطعتين (عرض)</label>
              <input type="number" min={0} placeholder="اختياري" value={form.offer2Price} onChange={(e) => setForm({ ...form, offer2Price: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
            </div>
          </div>
          <p className="text-xs text-muted">لو حطيت سعر القطعتين: قطعة واحدة بالسعر العادي، وقطعتين بالعرض.</p>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min={0} placeholder="المخزون" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-border rounded-xl px-3 py-2.5" />
            <input placeholder="إيموجي" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="border border-border rounded-xl px-3 py-2.5" />
          </div>
          <input placeholder="الألوان (مفصولة بفاصلة)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
          <input placeholder="المقاسات (مفصولة بفاصلة)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
          {error && <p className="text-danger text-sm">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-coffee text-white px-5 py-2.5 rounded-full font-semibold disabled:opacity-60">{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border px-5 py-2.5 rounded-full">إلغاء</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige">
            <tr>
              <th className="text-right p-3">المنتج</th>
              <th className="text-right p-3">سعر القطعة</th>
              <th className="text-right p-3">عرض قطعتين</th>
              <th className="text-right p-3">المخزون</th>
              <th className="text-right p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-lg grid place-items-center text-lg" style={{ background: p.tone }}>{p.emoji}</span>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-3 font-semibold text-coffee">{formatPrice(p.basePrice)}</td>
                <td className="p-3">{p.offer2Price != null ? <span className="text-success">{formatPrice(p.offer2Price)}</span> : '—'}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-coffee p-1"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-danger p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-muted">لا توجد منتجات</p>}
      </div>
    </div>
  )
}
