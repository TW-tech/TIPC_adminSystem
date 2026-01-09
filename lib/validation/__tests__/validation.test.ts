/**
 * 文章驗證測試範例
 * 展示如何使用驗證功能
 */

import {
  validateCreateArticle,
  collectReferencesFromBlocks,
  validateReferenceIntegrity,
  getReferenceUsageReport,
} from '../index'

// ✅ 正確的文章數據範例
const validArticle = {
  author: 'John Doe',
  title: '氣候變遷的影響',
  slug: 'climate-change-impact',
  publishedAt: new Date().toISOString(),
  
  blocks: [
    {
      type: 'text',
      data: {
        content: '根據最新研究[1]，全球氣溫持續上升。許多科學家認為[2]這將對生態系統造成重大影響。',
      },
      position: 0,
    },
    {
      type: 'image',
      data: {
        url: 'https://example.com/climate.jpg',
        alt: '氣候變遷圖表',
        caption: '2023年全球溫度變化趨勢[3]',
      },
      position: 1,
    },
    {
      type: 'quote',
      data: {
        content: '我們必須立即採取行動',
        author: 'Jane Smith',
        source: '環境保護年會 2024[1]',
      },
      position: 2,
    },
  ],
  
  annotations: [
    {
      id: 1,
      content: 'IPCC 第六次評估報告, 2021',
      url: 'https://www.ipcc.ch/report/ar6/',
    },
    {
      id: 2,
      content: 'Nature Climate Change, Vol 12, 2022',
      url: 'https://www.nature.com/nclimate/',
    },
    {
      id: 3,
      content: 'NASA Climate Data, 2023',
      url: 'https://climate.nasa.gov/',
    },
  ],
  
  videos: [
    {
      url: 'https://youtube.com/watch?v=example',
      title: '氣候變遷紀錄片',
      position: 0,
    },
  ],
  
  keywordIds: [1, 2, 3],
  nineBlockIds: [1],
}

// ❌ 錯誤範例 1: 缺少對應的 annotation
const missingAnnotation = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article',
  
  blocks: [
    {
      type: 'text',
      data: {
        content: '這篇文章引用了資料[1]和研究[2]，但是只提供了一個註解。',
      },
      position: 0,
    },
  ],
  
  annotations: [
    {
      id: 1,
      content: '唯一的註解',
    },
  ],
  // ❌ 缺少 annotation id=2
}

// ❌ 錯誤範例 2: 孤兒 annotation（沒有被引用）
const orphanAnnotation = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-2',
  
  blocks: [
    {
      type: 'text',
      data: {
        content: '這篇文章只引用了資料[1]。',
      },
      position: 0,
    },
  ],
  
  annotations: [
    {
      id: 1,
      content: '被引用的註解',
    },
    {
      id: 2,
      content: '孤兒註解，沒有任何 block 引用它',
    },
    // ❌ annotation id=2 沒有被任何 block 引用
  ],
}

// ❌ 錯誤範例 3: 錯誤的 block type
const invalidBlockType = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-3',
  
  blocks: [
    {
      type: 'video', // ❌ 不合法的 type（只能是 text, image, quote）
      data: {
        content: '這是一段影片',
      },
      position: 0,
    },
  ],
  
  annotations: [],
}

// ❌ 錯誤範例 4: 圖片 URL 格式錯誤
const invalidImageUrl = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-4',
  
  blocks: [
    {
      type: 'image',
      data: {
        url: 'not-a-valid-url', // ❌ 不是合法的 URL
        alt: '測試圖片',
      },
      position: 0,
    },
  ],
  
  annotations: [],
}

// 測試函數
function runTests() {
  console.log('=== 文章驗證測試 ===\n')
  
  // 測試 1: 正確的文章
  console.log('📝 測試 1: 驗證正確的文章')
  const result1 = validateCreateArticle(validArticle)
  console.log('結果:', result1.success ? '✅ 通過' : '❌ 失敗')
  if (!result1.success) {
    console.log('錯誤:', result1.errors)
  }
  
  // 顯示 reference 使用報告
  const report = getReferenceUsageReport(validArticle.blocks)
  console.log('\n📊 Reference 使用報告:')
  report.forEach(r => {
    console.log(`  [${r.refId}] 在 block ${r.blockIndex} (${r.blockType}): ${r.context}`)
  })
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // 測試 2: 缺少 annotation
  console.log('📝 測試 2: 缺少對應的 annotation')
  const result2 = validateCreateArticle(missingAnnotation)
  console.log('結果:', result2.success ? '✅ 通過' : '❌ 失敗（預期）')
  if (!result2.success) {
    console.log('錯誤:')
    result2.errors?.forEach(err => console.log('  ❌', err))
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // 測試 3: 孤兒 annotation
  console.log('📝 測試 3: 孤兒 annotation（沒有被引用）')
  const result3 = validateCreateArticle(orphanAnnotation)
  console.log('結果:', result3.success ? '✅ 通過' : '❌ 失敗（預期）')
  if (!result3.success) {
    console.log('錯誤:')
    result3.errors?.forEach(err => console.log('  ❌', err))
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // 測試 4: 錯誤的 block type
  console.log('📝 測試 4: 錯誤的 block type')
  const result4 = validateCreateArticle(invalidBlockType)
  console.log('結果:', result4.success ? '✅ 通過' : '❌ 失敗（預期）')
  if (!result4.success) {
    console.log('錯誤:')
    result4.errors?.forEach(err => console.log('  ❌', err))
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // 測試 5: 錯誤的圖片 URL
  console.log('📝 測試 5: 錯誤的圖片 URL')
  const result5 = validateCreateArticle(invalidImageUrl)
  console.log('結果:', result5.success ? '✅ 通過' : '❌ 失敗（預期）')
  if (!result5.success) {
    console.log('錯誤:')
    result5.errors?.forEach(err => console.log('  ❌', err))
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  console.log('✅ 所有測試完成！')
}

// 執行測試
// 在終端執行: npx tsx lib/validation/__tests__/validation.test.ts
runTests()

export { runTests }
