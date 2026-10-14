import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASSWORD, getSessions } from '@/lib/store'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 })
  }
  const token = crypto.randomUUID()
  getSessions().add(token)
  return NextResponse.json({ success: true, token })
}
