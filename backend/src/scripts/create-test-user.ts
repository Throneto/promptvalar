import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function createTestUser() {
  try {
    console.log('🔍 检查测试用户是否已存在...');

    // 检查用户是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, 'test@tablevision.top'))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('ℹ️  测试用户已存在！');
      console.log('');
      console.log('📋 测试账号信息：');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 邮箱: test@tablevision.top');
      console.log('🔑 密码: Test123456');
      console.log('👤 用户名:', existingUser[0].username);
      console.log('🆔 用户ID:', existingUser[0].id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('🌐 现在可以使用这个账号登录：');
      console.log('   http://tablevision.top/login');
      process.exit(0);
    }

    console.log('✨ 创建新的测试用户...');

    // 创建新用户
    const hashedPassword = await bcrypt.hash('Test123456', 10);
    
    const [newUser] = await db
      .insert(users)
      .values({
        username: 'testuser',
        email: 'test@tablevision.top',
        passwordHash: hashedPassword,
        subscriptionTier: 'free',
      })
      .returning();

    console.log('✅ 测试用户创建成功！');
    console.log('');
    console.log('📋 测试账号信息：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 邮箱: test@tablevision.top');
    console.log('🔑 密码: Test123456');
    console.log('👤 用户名:', newUser.username);
    console.log('🆔 用户ID:', newUser.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🌐 现在可以使用这个账号登录测试：');
    console.log('   http://tablevision.top/login');
    console.log('');
    console.log('📝 测试步骤：');
    console.log('   1. 访问 http://tablevision.top/login');
    console.log('   2. 输入邮箱: test@tablevision.top');
    console.log('   3. 输入密码: Test123456');
    console.log('   4. 点击登录');
    console.log('   5. 进入 Studio 开始测试保存功能');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ 错误:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createTestUser();

