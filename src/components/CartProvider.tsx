'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

export interface CartItem {
  productId: string
  name: string
  /** سعر القطعة الواحدة */
  price: number
  /** سعر القطعتين معاً (عرض) */
  offer2Price?: number | null
  image: string
  color: string
  size: string
  quantity: number
  emoji?: string
  tone?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string, size: string) => void
  updateQuantity: (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  lineTotal: (item: CartItem) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function calcLineTotal(
  basePrice: number,
  offer2Price: number | null | undefined,
  qty: number
): number {
  if (!offer2Price || qty < 2) return basePrice * qty
  const pairs = Math.floor(qty / 2)
  const rem = qty % 2
  return pairs * offer2Price + rem * basePrice
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zstore_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('zstore_cart', JSON.stringify(items))
    }
  }, [items, loaded])

  const lineTotal = (item: CartItem) =>
    calcLineTotal(item.price, item.offer2Price, item.quantity)

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
      )
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                price: item.price,
                offer2Price: item.offer2Price ?? i.offer2Price,
                emoji: item.emoji ?? i.emoji,
                tone: item.tone ?? i.tone,
              }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.color === color && i.size === size)
      )
    )
  }

  const updateQuantity = (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeItem(productId, color, size)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + lineTotal(i), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lineTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
