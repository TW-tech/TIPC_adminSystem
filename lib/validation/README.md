# 文章驗證系統

完整的文章數據驗證系統，包含 **Zod Schema 驗證** 和 **Reference 完整性檢查**。

## 📋 目錄

- [功能特性](#功能特性)
- [快速開始](#快速開始)
- [API 使用範例](#api-使用範例)
- [驗證規則](#驗證規則)
- [測試](#測試)

## ✨ 功能特性

### 1. Zod Schema 驗證（API 層）

- ✅ 驗證 block type（只能是 `text`, `image`, `quote`）
- ✅ 驗證 block.data 結構
  - `text`: 必須有 `content`
  - `image`: 必須有合法的 `url`，可選 `alt` 和 `caption`
  - `quote`: 必須有 `content`，可選 `author` 和 `source`
- ✅ 驗證 annotation 結構
  - 必須有 `id` 和 `content`
  - `url` 是可選的，但如果提供必須是合法 URL

### 2. Reference 完整性檢查（超重要）

確保所有在文章 blocks 中使用的 reference markers（如 `[1]`, `[2]`）都有對應的 annotation。

**檢查內容：**
- ✅ 所有使用的 references 都有對應的 annotation
- ✅ 不會出現孤兒 annotation（沒有被引用的 annotation）

**Reference 搜尋範圍：**
- `text` block: `data.content`
- `image` block: `data.caption`
- `quote` block: `data.content` + `data.source`

## 🚀 快速開始

### 安裝依賴

```bash
npm install zod
```

### 基本使用

```typescript
import { validateCreateArticle, assertValidCreateArticle } from '@/lib/validation'

// 方式 1: 使用 validate（返回結果對象）
const result = validateCreateArticle(articleData)
if (result.success) {
  console.log('驗證通過:', result.data)
} else {
  console.log('驗證失敗:', result.errors)
}

// 方式 2: 使用 assert（驗證失敗直接拋錯）
try {
  const validatedData = assertValidCreateArticle(articleData)
  // 驗證通過，繼續處理
} catch (error) {
  console.error('驗證失敗:', error.message)
}
```

## 📝 API 使用範例

### 在 API Route 中使用

```typescript
// app/api/articles/route.ts
import { assertValidCreateArticle } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🔥 完整驗證（Zod + Reference 完整性）
    const validatedData = assertValidCreateArticle(body)
    
    // 驗證通過，創建文章
    const article = await prisma.article.create({
      data: {
        ...validatedData,
        // ... 其他處理
      },
    })
    
    return NextResponse.json({ success: true, data: article })
    
  } catch (error) {
    if (error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

## ✅ 驗證規則

### Block Type 驗證

只允許以下三種類型：
- `text` - 文字內容
- `image` - 圖片
- `quote` - 引用

### Block Data 驗證

#### Text Block
```typescript
{
  type: 'text',
  data: {
    content: string // 必填，不能為空
  },
  position: number // 必填，>= 0
}
```

#### Image Block
```typescript
{
  type: 'image',
  data: {
    url: string      // 必填，必須是合法 URL
    alt?: string     // 可選
    caption?: string // 可選，可包含 [1], [2] 等 reference markers
  },
  position: number
}
```

#### Quote Block
```typescript
{
  type: 'quote',
  data: {
    content: string  // 必填，不能為空
    author?: string  // 可選
    source?: string  // 可選，可包含 reference markers
  },
  position: number
}
```

### Annotation 驗證

```typescript
{
  id: number,        // 必填，正整數
  content: string,   // 必填，不能為空
  url?: string      // 可選，如果提供必須是合法 URL
}
```

### Reference 完整性規則

1. **所有使用的 references 必須有對應的 annotation**
   ```typescript
   // ✅ 正確
   blocks: [
     { type: 'text', data: { content: '研究顯示[1]...' } }
   ]
   annotations: [
     { id: 1, content: '...' }
   ]
   
   // ❌ 錯誤：缺少 annotation id=1
   blocks: [
     { type: 'text', data: { content: '研究顯示[1]...' } }
   ]
   annotations: []
   ```

2. **不能有孤兒 annotation**
   ```typescript
   // ✅ 正確
   blocks: [
     { type: 'text', data: { content: '研究[1]和調查[2]...' } }
   ]
   annotations: [
     { id: 1, content: '...' },
     { id: 2, content: '...' }
   ]
   
   // ❌ 錯誤：annotation id=3 沒有被引用
   blocks: [
     { type: 'text', data: { content: '研究[1]...' } }
   ]
   annotations: [
     { id: 1, content: '...' },
     { id: 3, content: '...' }  // 孤兒 annotation
   ]
   ```

## 🧪 測試

執行測試查看各種驗證情境：

```bash
npx tsx lib/validation/__tests__/validation.test.ts
```

測試包含：
- ✅ 正確的文章數據
- ❌ 缺少 annotation
- ❌ 孤兒 annotation
- ❌ 錯誤的 block type
- ❌ 錯誤的 URL 格式

## 🛠️ 工具函數

### collectReferencesFromBlocks

收集 blocks 中所有使用的 reference IDs。

```typescript
import { collectReferencesFromBlocks } from '@/lib/validation'

const blocks = [
  { type: 'text', data: { content: '文章[1]提到[2]...' } }
]

const refs = collectReferencesFromBlocks(blocks)
// Set(2) { 1, 2 }
```

### validateReferenceIntegrity

檢查 references 和 annotations 的完整性。

```typescript
import { validateReferenceIntegrity } from '@/lib/validation'

const result = validateReferenceIntegrity(blocks, annotations)
if (!result.valid) {
  console.error(result.errors)
}
```

### getReferenceUsageReport

獲取詳細的 reference 使用報告（用於調試）。

```typescript
import { getReferenceUsageReport } from '@/lib/validation'

const report = getReferenceUsageReport(blocks)
// [
//   {
//     refId: 1,
//     blockIndex: 0,
//     blockType: 'text',
//     context: '...文章[1]提到...'
//   }
// ]
```

## 📦 文件結構

```
lib/validation/
├── README.md                    # 本文件
├── index.ts                     # 主要導出
├── article.schema.ts            # Zod schemas
├── reference-integrity.ts       # Reference 完整性檢查
└── __tests__/
    └── validation.test.ts       # 測試範例
```

## 🎯 最佳實踐

1. **在 API 層使用 `assertValid*` 函數**
   - 驗證失敗會直接拋錯，方便 catch 處理

2. **在 UI 層使用 `validate*` 函數**
   - 返回結果對象，可以展示詳細錯誤給用戶

3. **開發時使用 `getReferenceUsageReport`**
   - 可以快速查看哪些 references 在哪裡被使用

4. **測試時確保涵蓋所有驗證情境**
   - 正確的數據
   - 各種錯誤情況（缺少 annotation、孤兒 annotation、錯誤格式等）

## ❓ FAQ

### Q: Reference markers 的格式是什麼？
A: `[數字]` 格式，例如 `[1]`, `[2]`, `[10]` 等。

### Q: 如果圖片 caption 中沒有 reference 怎麼辦？
A: 沒問題！Reference 是可選的。驗證只確保**使用的 references** 都有對應的 annotation。

### Q: 可以有多個 block 引用同一個 annotation 嗎？
A: 可以！一個 annotation 可以被多個 blocks 引用。

### Q: Annotation 的 ID 必須連續嗎？
A: 不需要。可以使用任意正整數作為 ID，只要引用匹配即可。

## 📄 License

MIT
