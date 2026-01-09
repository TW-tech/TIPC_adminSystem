import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/keywords/search
 * 搜索關鍵字（用於自動完成）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    if (!query || query.trim().length < 1) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }
    
    // 搜索關鍵字（模糊匹配）
    const keywords = await prisma.keyWords.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // 不區分大小寫
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10, // 最多返回 10 個結果
      orderBy: {
        name: 'asc',
      },
    })
    
    return NextResponse.json({
      success: true,
      data: keywords,
    })
    
  } catch (error) {
    console.error('Keyword search error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to search keywords',
    }, { status: 500 })
  }
}
