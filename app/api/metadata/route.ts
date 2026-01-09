import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/metadata
 * 获取文章编辑器需要的所有元数据
 */
export async function GET() {
  try {
    const [nineBlocks, cakeCategories, keywords] = await Promise.all([
      prisma.nineBlocks.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.cakeCategory.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.keyWords.findMany({
        orderBy: { name: 'asc' },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        nineBlocks,
        cakeCategories,
        keywords,
      },
    })
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metadata' },
      { status: 500 }
    )
  }
}
