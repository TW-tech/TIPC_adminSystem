import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ 
  adapter,
})

const nineBlocksData = [
  { id: 'food', name: '食' },
  { id: 'clothing', name: '衣' },
  { id: 'housing', name: '住' },
  { id: 'transportation', name: '行' },
  { id: 'education', name: '育' },
  { id: 'entertainment', name: '樂' },
  { id: 'event', name: '重要事件' },
  { id: 'festival', name: '經典節慶' },
  { id: 'industry', name: '指標產業' },
]

async function main() {

  // 清除現有資料
  await prisma.nineBlocks.deleteMany()
  console.log('✅ 已清除現有資料')

  // 插入新資料
  for (const block of nineBlocksData) {
    const created = await prisma.nineBlocks.create({  // create line right here
      data: block,
    })
    console.log(`✅ ${created.id} - ${created.name}`)
  }

  console.log('\n✨ 完成！')

}

main()
  .catch((e) => {
    console.error('❌ 錯誤:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
