# 驗證功能使用指南

## 📖 使用範例

### 1. 在 API Route 中使用（推薦）

```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { assertValidCreateArticle } from '@/lib/validation'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🔥 完整驗證：Zod Schema + Reference 完整性檢查
    // 如果驗證失敗，會直接拋出錯誤
    const validatedData = assertValidCreateArticle(body)
    
    // 驗證通過，創建文章
    const article = await prisma.article.create({
      data: {
        author: validatedData.author,
        title: validatedData.title,
        slug: validatedData.slug,
        blocks: {
          create: validatedData.blocks,
        },
        annotations: {
          create: validatedData.annotations,
        },
      },
    })
    
    return NextResponse.json({ success: true, data: article })
    
  } catch (error) {
    // 驗證錯誤處理
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 2. 在 Client 端使用（前端驗證）

```typescript
// components/ArticleForm.tsx
'use client'

import { useState } from 'react'
import { validateCreateArticle } from '@/lib/validation'

export default function ArticleForm() {
  const [errors, setErrors] = useState<string[]>([])
  
  const handleSubmit = async (formData: any) => {
    // 前端驗證
    const validation = validateCreateArticle(formData)
    
    if (!validation.success) {
      setErrors(validation.errors || [])
      return
    }
    
    // 驗證通過，發送到後端
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    })
    
    // ...
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((err, i) => (
            <div key={i} className="error">{err}</div>
          ))}
        </div>
      )}
      {/* 表單欄位 */}
    </form>
  )
}
```

### 3. 只驗證 Reference 完整性

```typescript
import { validateReferenceIntegrity } from '@/lib/validation'

const blocks = [
  { type: 'text', data: { content: '引用[1]和[2]' }, position: 0 }
]

const annotations = [
  { id: 1, content: '註解1' },
  { id: 2, content: '註解2' }
]

const result = validateReferenceIntegrity(blocks, annotations)

if (!result.valid) {
  console.error('Reference 完整性檢查失敗:', result.errors)
}
```

### 4. 獲取 Reference 使用報告（調試用）

```typescript
import { getReferenceUsageReport } from '@/lib/validation'

const blocks = [
  {
    type: 'text',
    data: { content: '根據研究[1]和數據[2]顯示...' },
    position: 0
  },
  {
    type: 'image',
    data: {
      url: 'https://example.com/chart.jpg',
      caption: '統計圖表[1]'
    },
    position: 1
  }
]

const report = getReferenceUsageReport(blocks)

console.log('Reference 使用報告:')
report.forEach(item => {
  console.log(`[${item.refId}] 在 block ${item.blockIndex} (${item.blockType})`)
  console.log(`  上下文: ${item.context}`)
})

// 輸出:
// [1] 在 block 0 (text)
//   上下文: 根據研究[1]和數據[2]顯示...
// [2] 在 block 0 (text)
//   上下文: 根據研究[1]和[2]顯示...
// [1] 在 block 1 (image)
//   上下文: 統計圖表[1]
```

### 5. 在 Server Action 中使用

```typescript
// app/actions/article.ts
'use server'

import { assertValidCreateArticle } from '@/lib/validation'
import { prisma } from '@/lib/prisma'

export async function createArticle(formData: FormData) {
  try {
    const data = {
      author: formData.get('author'),
      title: formData.get('title'),
      slug: formData.get('slug'),
      blocks: JSON.parse(formData.get('blocks') as string),
      annotations: JSON.parse(formData.get('annotations') as string),
    }
    
    // 驗證
    const validatedData = assertValidCreateArticle(data)
    
    // 創建文章
    const article = await prisma.article.create({
      data: validatedData,
    })
    
    return { success: true, data: article }
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

## 🧪 測試

執行測試腳本：

```bash
npx tsx scripts/test-validation.ts
```

這會執行 6 個測試案例：
1. ✅ 正確的文章數據
2. ❌ 缺少對應的 annotation
3. ❌ 孤兒 annotation
4. ❌ 錯誤的 block type
5. ❌ 錯誤的圖片 URL
6. ❌ 空的文字內容

## 📋 驗證規則摘要

### Block Types
只允許: `text`, `image`, `quote`

### Reference Markers
格式: `[1]`, `[2]`, `[10]` 等

搜尋範圍:
- `text` block: `data.content`
- `image` block: `data.caption`
- `quote` block: `data.content` + `data.source`

### 完整性檢查
1. ✅ 所有使用的 references 都有對應的 annotation
2. ✅ 所有 annotations 都有被引用（不能有孤兒）

## 🔍 常見錯誤

### 錯誤 1: 缺少 annotation
```typescript
// ❌ 錯誤
blocks: [
  { type: 'text', data: { content: '引用[1]和[2]' } }
]
annotations: [
  { id: 1, content: '只有一個' }
]
// 錯誤: Reference [2] is used in blocks but has no corresponding annotation
```

### 錯誤 2: 孤兒 annotation
```typescript
// ❌ 錯誤
blocks: [
  { type: 'text', data: { content: '只引用[1]' } }
]
annotations: [
  { id: 1, content: '被引用的' },
  { id: 2, content: '孤兒' }
]
// 錯誤: Annotation with ID 2 exists but is not referenced in any block
```

### 錯誤 3: 錯誤的 block type
```typescript
// ❌ 錯誤
{
  type: 'video', // 不允許
  data: { ... }
}
// 錯誤: blocks[0].type: Invalid enum value. Expected 'text' | 'image' | 'quote'
```

### 錯誤 4: 空內容
```typescript
// ❌ 錯誤
{
  type: 'text',
  data: { content: '' } // 不能為空
}
// 錯誤: blocks[0].data.content: Text content cannot be empty
```

## 🎯 最佳實踐

1. **API 層使用 `assertValid*`**
   - 驗證失敗直接拋錯，統一錯誤處理

2. **Client 層使用 `validate*`**
   - 返回詳細錯誤，展示給用戶

3. **開發時使用 `getReferenceUsageReport`**
   - 快速定位 reference 使用位置

4. **測試覆蓋所有場景**
   - 正確案例 + 各種錯誤案例
