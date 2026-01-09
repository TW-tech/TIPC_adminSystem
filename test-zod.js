console.log('Test starting...')

try {
  const { z } = require('zod')
  console.log('✅ Zod loaded successfully')
  
  const schema = z.string()
  const result = schema.safeParse('hello')
  console.log('✅ Zod validation works:', result.success)
  
} catch (error) {
  console.error('❌ Error:', error.message)
}

console.log('Test completed')
