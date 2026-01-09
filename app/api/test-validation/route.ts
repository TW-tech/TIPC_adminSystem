import { NextRequest, NextResponse } from 'next/server'
import { validateCreateArticle } from '@/lib/validation'

/**
 * GET /api/test-validation
 * 測試驗證功能
 */
export async function GET() {
  const results: any[] = []
  
  // 測試 1: 正確的文章
  const validArticle = {
    author: 'Test Author',
    title: 'Test Article',
    slug: 'test-article',
    blocks: [
      {
        type: 'text',
        data: { content: '測試內容[1]和更多內容[2]' },
        position: 0,
      },
      {
        type: 'image',
        data: {
          url: 'https://example.com/image.jpg',
          caption: '圖片說明[1]',
        },
        position: 1,
      },
    ],
    annotations: [
      { id: 1, content: '註解1', url: 'https://example.com' },
      { id: 2, content: '註解2' },
    ],
  }
  
  const result1 = validateCreateArticle(validArticle)
  results.push({
    test: '正確的文章',
    success: result1.success,
    errors: result1.errors,
  })
  
  // 測試 2: 缺少 annotation
  const missingAnnotation = {
    author: 'Test',
    title: 'Test',
    slug: 'test',
    blocks: [
      {
        type: 'text',
        data: { content: '引用[1]和[2]' },
        position: 0,
      },
    ],
    annotations: [
      { id: 1, content: '只有一個註解' },
    ],
  }
  
  const result2 = validateCreateArticle(missingAnnotation)
  results.push({
    test: '缺少 annotation（應該失敗）',
    success: result2.success,
    errors: result2.errors,
  })
  
  // 測試 3: 孤兒 annotation
  const orphanAnnotation = {
    author: 'Test',
    title: 'Test',
    slug: 'test',
    blocks: [
      {
        type: 'text',
        data: { content: '只引用[1]' },
        position: 0,
      },
    ],
    annotations: [
      { id: 1, content: '被引用的註解' },
      { id: 2, content: '孤兒註解' },
    ],
  }
  
  const result3 = validateCreateArticle(orphanAnnotation)
  results.push({
    test: '孤兒 annotation（應該失敗）',
    success: result3.success,
    errors: result3.errors,
  })
  
  // 測試 4: 錯誤的 block type
  const invalidBlockType = {
    author: 'Test',
    title: 'Test',
    slug: 'test',
    blocks: [
      {
        type: 'video', // 錯誤的類型
        data: { content: 'test' },
        position: 0,
      },
    ],
    annotations: [],
  }
  
  const result4 = validateCreateArticle(invalidBlockType)
  results.push({
    test: '錯誤的 block type（應該失敗）',
    success: result4.success,
    errors: result4.errors,
  })
  
  return NextResponse.json({
    message: '驗證測試完成',
    results,
  })
}
