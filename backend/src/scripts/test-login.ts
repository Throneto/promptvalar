import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function testLogin() {
  try {
    console.log('🔍 测试登录功能...\n');

    const email = 'test@tablevision.top';
    const password = 'Test123456';

    // 1. 查找用户
    console.log('1️⃣ 查找用户:', email);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      console.log('❌ 用户不存在');
      process.exit(1);
    }

    console.log('✅ 用户找到:');
    console.log('   - ID:', user.id);
    console.log('   - 用户名:', user.username);
    console.log('   - 邮箱:', user.email);
    console.log('   - 密码哈希前缀:', user.passwordHash.substring(0, 30));

    // 2. 验证密码
    console.log('\n2️⃣ 验证密码...');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      console.log('❌ 密码不匹配');
      console.log('   输入密码:', password);
      console.log('   存储哈希:', user.passwordHash);
      process.exit(1);
    }

    console.log('✅ 密码验证成功');

    // 3. 生成tokens
    console.log('\n3️⃣ 生成JWT tokens...');
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      console.log('❌ JWT密钥未配置');
      console.log('   JWT_SECRET:', JWT_SECRET ? '已配置' : '未配置');
      console.log('   JWT_REFRESH_SECRET:', JWT_REFRESH_SECRET ? '已配置' : '未配置');
      process.exit(1);
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        subscription: user.subscriptionTier,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        subscription: user.subscriptionTier,
        tokenType: 'refresh',
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Tokens生成成功');
    console.log('   Access Token (前50字符):', accessToken.substring(0, 50) + '...');
    console.log('   Refresh Token (前50字符):', refreshToken.substring(0, 50) + '...');

    // 4. 组装响应数据
    console.log('\n4️⃣ 组装响应数据...');
    const result = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };

    console.log('✅ 登录流程完整测试成功！');
    console.log('\n📋 返回数据示例:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n✅ 所有测试通过！登录功能应该可以正常工作。');
    console.log('\n💡 如果前端登录仍然失败，请检查：');
    console.log('   1. 前端API地址配置');
    console.log('   2. 浏览器控制台错误');
    console.log('   3. 网络请求（Network标签）');
    console.log('   4. CORS配置');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testLogin();

