import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config'

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
})

// Create adapter
const adapter = new PrismaPg(pool)

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter })

async function createTestUser() {
  try {
    const usersToCreate = [
      {
        account: 'admin',
        password: 'TIPC_admin_2026!!',
        title: 'admin'
      },
      {
        account: 'editor',
        password: 'TIPC_editor_2026!',
        title: 'editor'
      }
    ]

    console.log('開始創建用戶...\n')

    for (const userData of usersToCreate) {
      // 檢查是否已存在
      const existingUser = await prisma.users.findUnique({
        where: { account: userData.account },
      })

      if (existingUser) {
        console.log(`⚠️  用戶 ${userData.account} 已存在，跳過`)
        continue
      }

      // 加密密碼
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // 創建用戶
      const user = await prisma.users.create({
        data: {
          account: userData.account,
          password: hashedPassword,
          title: userData.title,
        },
      })

      console.log(`✅ 用戶創建成功！`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`帳號: ${userData.account}`)
      console.log(`密碼: ${userData.password}`)
      console.log(`角色: ${userData.title}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━\n')
    }

    console.log('所有用戶創建完成！')
    console.log('\n請訪問: http://localhost:3000/login')
  } catch (error) {
    console.error('❌ 創建用戶失敗:', error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

createTestUser()
