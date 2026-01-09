/**
 * Reference 完整性檢查工具
 * 確保文章中的所有 reference markers 都有對應的 annotations
 */

interface Block {
  type: string
  data: any
}

interface Annotation {
  id: number
  content: string
}

/**
 * 從 blocks 中收集所有使用的 reference markers
 * Reference markers 格式: [1], [2], [3] 等
 */
export function collectReferencesFromBlocks(blocks: Block[]): Set<number> {
  const usedRefs = new Set<number>()
  
  for (const block of blocks) {
    let textToSearch = ''
    
    // 根據 block type 提取需要檢查的文字
    switch (block.type) {
      case 'text':
        textToSearch = block.data.content || ''
        break
      case 'image':
        // 圖片的 caption 可能包含 reference markers
        textToSearch = block.data.caption || ''
        break
      case 'quote':
        textToSearch = (block.data.content || '') + ' ' + (block.data.source || '')
        break
    }
    
    // 使用正則表達式找出所有 [數字] 格式的 references
    // 例如: [1], [2], [10]
    const referencePattern = /\[(\d+)\]/g
    let match: RegExpExecArray | null
    
    while ((match = referencePattern.exec(textToSearch)) !== null) {
      const refId = parseInt(match[1], 10)
      usedRefs.add(refId)
    }
  }
  
  return usedRefs
}

/**
 * 檢查兩個 Set 是否相同
 */
function sameSet<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false
  }
  
  for (const item of set1) {
    if (!set2.has(item)) {
      return false
    }
  }
  
  return true
}

/**
 * 驗證 references 和 annotations 的完整性
 * 
 * 確保：
 * 1. 所有在 blocks 中使用的 reference markers 都有對應的 annotation
 * 2. 不會出現孤兒 annotation（沒有被任何 block 引用的 annotation）
 * 
 * @throws Error 如果發現不一致
 */
export function validateReferenceIntegrity(
  blocks: Block[],
  annotations: Annotation[]
): { valid: true } | { valid: false; errors: string[] } {
  const errors: string[] = []
  
  // 收集 blocks 中使用的所有 reference IDs
  const usedRefs = collectReferencesFromBlocks(blocks)
  
  // 收集所有 annotation IDs
  const annotationIds = new Set(annotations.map(a => a.id))
  
  // 檢查是否所有使用的 references 都有對應的 annotation
  for (const refId of usedRefs) {
    if (!annotationIds.has(refId)) {
      errors.push(`Reference [${refId}] is used in blocks but has no corresponding annotation`)
    }
  }
  
  // 檢查是否有孤兒 annotations（沒有被引用的 annotation）
  for (const annotationId of annotationIds) {
    if (!usedRefs.has(annotationId)) {
      errors.push(`Annotation with ID ${annotationId} exists but is not referenced in any block`)
    }
  }
  
  if (errors.length > 0) {
    return { valid: false, errors }
  }
  
  return { valid: true }
}

/**
 * 嚴格版本：如果發現不一致直接拋出錯誤
 * 適合用於 API 層的驗證
 */
export function assertReferenceIntegrity(
  blocks: Block[],
  annotations: Annotation[]
): void {
  const result = validateReferenceIntegrity(blocks, annotations)
  
  if (!result.valid) {
    throw new Error(
      `Reference integrity check failed:\n${result.errors.join('\n')}`
    )
  }
}

/**
 * 獲取詳細的 reference 使用報告
 * 用於調試和查看哪些 references 在哪些 blocks 中被使用
 */
export function getReferenceUsageReport(blocks: Block[]): {
  refId: number
  blockIndex: number
  blockType: string
  context: string
}[] {
  const report: {
    refId: number
    blockIndex: number
    blockType: string
    context: string
  }[] = []
  
  blocks.forEach((block, index) => {
    let textToSearch = ''
    
    switch (block.type) {
      case 'text':
        textToSearch = block.data.content || ''
        break
      case 'image':
        textToSearch = block.data.caption || ''
        break
      case 'quote':
        textToSearch = (block.data.content || '') + ' ' + (block.data.source || '')
        break
    }
    
    const referencePattern = /\[(\d+)\]/g
    let match: RegExpExecArray | null
    
    while ((match = referencePattern.exec(textToSearch)) !== null) {
      const refId = parseInt(match[1], 10)
      const matchIndex = match.index
      
      // 提取上下文（reference 前後各 20 個字元）
      const contextStart = Math.max(0, matchIndex - 20)
      const contextEnd = Math.min(textToSearch.length, matchIndex + match[0].length + 20)
      const context = textToSearch.substring(contextStart, contextEnd)
      
      report.push({
        refId,
        blockIndex: index,
        blockType: block.type,
        context: contextStart > 0 ? '...' + context : context,
      })
    }
  })
  
  return report
}
