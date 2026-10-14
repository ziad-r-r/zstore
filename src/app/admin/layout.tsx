import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-offwhite">
      <nav className="bg-coffee text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">
              Zstore Admin
            </Link>
            <Link
              href="/admin/products"
              className="text-sm hover:underline opacity-90"
            >
              المنتجات
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm hover:underline opacity-90"
            >
              الطلبات
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline opacity-90">
              المتجر
            </Link>
            <Link
              href="/admin/login"
              className="text-sm bg-white/15 px-3 py-1.5 rounded-full hover:bg-white/25"
            >
              خروج / دخول
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
