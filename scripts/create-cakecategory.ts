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

const cakeCategorieData = [
  { id: '文化記憶', name: '文化記憶' },
  { id: '文化資產與文化活動', name: '文化資產與文化活動' },
  { id: '產業/品牌', name: '產業/品牌' },
  { id: '地方創生', name: '地方創生' }
]

async function main() {

  // 清除現有資料
  await prisma.cakeCategory.deleteMany()
  console.log('✅ 已清除現有資料')

  // 插入新資料
  for (const block of cakeCategorieData) {
    const created = await prisma.cakeCategory.create({  // create line right here
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
