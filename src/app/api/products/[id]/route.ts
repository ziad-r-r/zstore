import { NextRequest, NextResponse } from 'next/server'
import {
  getProducts,
  setProducts,
  getProduct,
  getSessions,
  type Product,
} from '@/lib/store'

function isAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (!token) return false
  return getSessions().has(token)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const p = getProduct(id)
  if (!p) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })
  return NextResponse.json(p)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  const { id } = await params
  const list = getProducts()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: 'غير موجود' }, { status: 404 })
  }
  try {
    const body = await req.json()
    const current = list[idx]
    const basePrice =
      body.basePrice != null ? Number(body.basePrice) : current.basePrice
    if (!Number.isFinite(basePrice) || basePrice < 0) {
      return NextResponse.json({ error: 'السعر غير صالح' }, { status: 400 })
    }
    let offer2: number | null | undefined = current.offer2Price
    if (body.offer2Price === '' || body.offer2Price === null) {
      offer2 = null
    } else if (body.offer2Price != null) {
      offer2 = Number(body.offer2Price)
      if (!Number.isFinite(offer2) || offer2 < 0) {
        return NextResponse.json({ error: 'سعر العرض غير صالح' }, { status: 400 })
      }
    }

    const updated: Product = {
      ...current,
      name:
        body.name != null ? String(body.name).trim() || current.name : current.name,
      description:
        body.description != null
          ? String(body.description).trim()
          : current.description,
      basePrice,
      offer2Price: offer2,
      colors:
        body.colors != null
          ? Array.isArray(body.colors)
            ? body.colors.map(String).filter(Boolean)
            : String(body.colors)
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
          : current.colors,
      sizes:
        body.sizes != null
          ? Array.isArray(body.sizes)
            ? body.sizes.map(String).filter(Boolean)
            : String(body.sizes)
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
          : current.sizes,
      stock:
        body.stock != null
          ? Math.max(0, Number(body.stock) || 0)
          : current.stock,
      emoji:
        body.emoji != null
          ? String(body.emoji).trim() || current.emoji
          : current.emoji,
      tone:
        body.tone != null
          ? String(body.tone).trim() || current.tone
          : current.tone,
    }
    if (updated.colors.length === 0) updated.colors = ['افتراضي']
    if (updated.sizes.length === 0) updated.sizes = ['مقاس واحد']

    list[idx] = updated
    setProducts(list)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'خطأ في البيانات' }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  const { id } = await params
  const list = getProducts()
  const next = list.filter((p) => p.id !== id)
  if (next.length === list.length) {
    return NextResponse.json({ error: 'غير موجود' }, { status: 404 })
  }
  setProducts(next)
  return NextResponse.json({ success: true })
}
