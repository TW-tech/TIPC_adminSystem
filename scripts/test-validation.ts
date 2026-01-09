/**
 * 直接測試驗證功能
 * 運行: npx tsx scripts/test-validation.ts
 */

import { validateCreateArticle } from '../lib/validation'

console.log('🔍 開始驗證測試\n')
console.log('='.repeat(60))

// 測試 1: ✅ 正確的文章
console.log('\n📝 測試 1: 正確的文章數據')
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
}

const result1 = validateCreateArticle(validArticle)
console.log('結果:', result1.success ? '✅ 通過' : '❌ 失敗')
if (!result1.success) {
  console.log('錯誤:', result1.errors)
}

console.log('\n' + '='.repeat(60))

// 測試 2: ❌ 缺少 annotation
console.log('\n📝 測試 2: 缺少對應的 annotation')
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
}

const result2 = validateCreateArticle(missingAnnotation)
console.log('結果:', result2.success ? '✅ 通過' : '❌ 失敗（預期）')
if (!result2.success) {
  console.log('錯誤:')
  result2.errors?.forEach(err => console.log('  ❌', err))
}

console.log('\n' + '='.repeat(60))

// 測試 3: ❌ 孤兒 annotation
console.log('\n📝 測試 3: 孤兒 annotation（沒有被引用）')
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
  ],
}

const result3 = validateCreateArticle(orphanAnnotation)
console.log('結果:', result3.success ? '✅ 通過' : '❌ 失敗（預期）')
if (!result3.success) {
  console.log('錯誤:')
  result3.errors?.forEach(err => console.log('  ❌', err))
}

console.log('\n' + '='.repeat(60))

// 測試 4: ❌ 錯誤的 block type
console.log('\n📝 測試 4: 錯誤的 block type')
const invalidBlockType = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-3',
  
  blocks: [
    {
      type: 'video', // 不合法的 type
      data: {
        content: '這是一段影片',
      },
      position: 0,
    },
  ],
  
  annotations: [],
}

const result4 = validateCreateArticle(invalidBlockType)
console.log('結果:', result4.success ? '✅ 通過' : '❌ 失敗（預期）')
if (!result4.success) {
  console.log('錯誤:')
  result4.errors?.forEach(err => console.log('  ❌', err))
}

console.log('\n' + '='.repeat(60))

// 測試 5: ❌ 錯誤的圖片 URL
console.log('\n📝 測試 5: 錯誤的圖片 URL 格式')
const invalidImageUrl = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-4',
  
  blocks: [
    {
      type: 'image',
      data: {
        url: 'not-a-valid-url',
        alt: '測試圖片',
      },
      position: 0,
    },
  ],
  
  annotations: [],
}

const result5 = validateCreateArticle(invalidImageUrl)
console.log('結果:', result5.success ? '✅ 通過' : '❌ 失敗（預期）')
if (!result5.success) {
  console.log('錯誤:')
  result5.errors?.forEach(err => console.log('  ❌', err))
}

console.log('\n' + '='.repeat(60))

// 測試 6: ❌ 空的文字內容
console.log('\n📝 測試 6: 空的文字內容')
const emptyContent = {
  author: 'John Doe',
  title: '測試文章',
  slug: 'test-article-5',
  
  blocks: [
    {
      type: 'text',
      data: {
        content: '', // 空字串
      },
      position: 0,
    },
  ],
  
  annotations: [],
}

const result6 = validateCreateArticle(emptyContent)
console.log('結果:', result6.success ? '✅ 通過' : '❌ 失敗（預期）')
if (!result6.success) {
  console.log('錯誤:')
  result6.errors?.forEach(err => console.log('  ❌', err))
}

console.log('\n' + '='.repeat(60))
console.log('\n✅ 所有測試完成！\n')

// 總結
const totalTests = 6
const passedTests = [result1, result2, result3, result4, result5, result6].filter(
  (r, i) => i === 0 ? r.success : !r.success
).length

console.log('📊 測試總結:')
console.log(`   通過: ${passedTests}/${totalTests}`)
console.log(`   失敗: ${totalTests - passedTests}/${totalTests}`)

if (passedTests === totalTests) {
  console.log('\n🎉 所有測試都符合預期！驗證系統運作正常。\n')
} else {
  console.log('\n⚠️  部分測試未符合預期，請檢查驗證邏輯。\n')
}
