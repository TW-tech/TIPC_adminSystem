import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { account, password } = body

    // 驗證輸入格式和長度（防止過長輸入）
    if (!account || !password) {
      return NextResponse.json(
        { error: '請提供帳號和密碼' },
        { status: 400 }
      )
    }

    // 驗證帳號格式（只允許字母、數字和特定符號）
    if (typeof account !== 'string' || account.length > 100) {
      return NextResponse.json(
        { error: '無效的帳號格式' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length > 200) {
      return NextResponse.json(
        { error: '無效的密碼格式' },
        { status: 400 }
      )
    }

    // 清理帳號輸入（移除前後空白）
    const sanitizedAccount = account.trim()

    if (!sanitizedAccount) {
      return NextResponse.json(
        { error: '帳號不可為空' },
        { status: 400 }
      )
    }

    // 查詢用戶（Prisma 自動防止 SQL 注入）
    const user = await prisma.users.findUnique({
      where: { account: sanitizedAccount },
    })

    if (!user) {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }

    // 登入成功，返回用戶資訊（不包含密碼）
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '登入成功',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}
