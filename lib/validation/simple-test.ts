/**
 * 簡單測試 - 驗證模組是否正常工作
 */

import {
  validateCreateArticle,
} from './index'

console.log('🔍 開始測試...\n')

// 測試數據
const testData = {
  author: 'Test Author',
  title: 'Test Article',
  slug: 'test-article',
  
  blocks: [
    {
      type: 'text',
      data: {
        content: '這是測試內容[1]',
      },
      position: 0,
    },
  ],
  
  annotations: [
    {
      id: 1,
      content: '這是註解',
    },
  ],
}

console.log('📝 測試數據:', JSON.stringify(testData, null, 2))
console.log('\n🔄 執行驗證...\n')

const result = validateCreateArticle(testData)

if (result.success) {
  console.log('✅ 驗證通過！')
  console.log('驗證後的數據:', result.data)
} else {
  console.log('❌ 驗證失敗！')
  console.log('錯誤:', result.errors)
}

console.log('\n✅ 測試完成')
