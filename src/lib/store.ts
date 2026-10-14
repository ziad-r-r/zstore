export type Product = {
  id: string
  name: string
  description: string
  basePrice: number
  colors: string[]
  sizes: string[]
  stock: number
  emoji: string
  tone: string
}

export type OrderItem = {
  productId: string
  name: string
  color: string
  size: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  city: string
  area: string
  address: string
  shippingNotes?: string
  storeOption?: string
  customerToken: string
  customerResponse?: string
  basePrice: number
  commission: number
  discount: number
  priceIncrease: number
  bonus: number
  shippingFee: number
  total: number
  items: OrderItem[]
  createdAt: string
}

const g = globalThis as unknown as {
  __zstore_orders?: Map<string, Order>
  __zstore_sessions?: Set<string>
}

if (!g.__zstore_orders) g.__zstore_orders = new Map()
if (!g.__zstore_sessions) g.__zstore_sessions = new Set()

export const products: Product[] = [
  { id: 'p1', name: 'هودي قهوة', description: 'هودي قطن ثقيل بقصة مريحة.', basePrice: 690, colors: ['بني', 'بيج', 'أسود'], sizes: ['S', 'M', 'L', 'XL'], stock: 24, emoji: '🧥', tone: '#6F4E37' },
  { id: 'p2', name: 'تيشيرت أوف وايت', description: 'تيشيرت ناعم يومي.', basePrice: 320, colors: ['أوف وايت', 'بيج', 'بني'], sizes: ['S', 'M', 'L'], stock: 40, emoji: '👕', tone: '#C4A484' },
  { id: 'p3', name: 'بنطلون كتان', description: 'بنطلون واسع خفيف.', basePrice: 540, colors: ['بيج', 'كاكي', 'أبيض'], sizes: ['30', '32', '34', '36'], stock: 18, emoji: '👖', tone: '#A89078' },
  { id: 'p4', name: 'كاب زستور', description: 'كاب قطن بتطريز صغير.', basePrice: 180, colors: ['بني', 'أسود', 'بيج'], sizes: ['مقاس واحد'], stock: 50, emoji: '🧢', tone: '#4A3222' },
  { id: 'p5', name: 'شنطة كتف', description: 'شنطة يومية بجيوب داخلية.', basePrice: 450, colors: ['بني', 'أسود'], sizes: ['واحدة'], stock: 12, emoji: '👜', tone: '#8B5E3C' },
  { id: 'p6', name: 'سنيكرز كلاسيك', description: 'حذاء رياضي مريح.', basePrice: 890, colors: ['أبيض', 'بيج'], sizes: ['40', '41', '42', '43', '44'], stock: 15, emoji: '👟', tone: '#E8DFD0' },
]

export function getOrders() {
  return g.__zstore_orders!
}
export function getSessions() {
  return g.__zstore_sessions!
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ZstoreAdmin2026'
