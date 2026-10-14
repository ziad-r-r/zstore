import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(price)
}

export const ORDER_STATUSES = [
  'جديد', 'بانتظار تحديد الشحن', 'بانتظار تأكيد العميل', 'تم التأكيد', 'مرفوض', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي',
] as const
