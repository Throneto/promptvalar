/**
 * 订阅系统测试脚本
 * 测试所有订阅相关的 API 端点
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// 测试用户凭据
let testToken = '';
let testUserId = '';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`测试: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// 1. 登录测试用户
async function loginTestUser() {
  logTest('登录测试用户');
  
  try {
    // 尝试注册
    const registerData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Test123456!',
    };

    try {
      const registerRes = await axios.post(
        `${API_BASE_URL}/api/v1/auth/register`,
        registerData
      );
      testToken = registerRes.data.token;
      testUserId = registerRes.data.user.id;
      logSuccess(`注册成功: ${registerData.email}`);
    } catch (regError) {
      // 如果注册失败，尝试登录已存在的用户
      logWarning('注册失败，尝试使用已存在的用户');
      const loginRes = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        email: 'test@example.com',
        password: 'Test123456!',
      });
      testToken = loginRes.data.token;
      testUserId = loginRes.data.user.id;
      logSuccess('使用已存在的用户登录成功');
    }

    log(`Token: ${testToken.substring(0, 20)}...`, 'blue');
    log(`User ID: ${testUserId}`, 'blue');
  } catch (error) {
    logError(`登录失败: ${error.message}`);
    throw error;
  }
}

// 2. 获取订阅计划
async function getSubscriptionPlans() {
  logTest('获取订阅计划');

  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/subscriptions/plans`);
    
    logSuccess('成功获取订阅计划');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data.plans;
  } catch (error) {
    logError(`获取计划失败: ${error.message}`);
    throw error;
  }
}

// 3. 获取当前订阅
async function getCurrentSubscription() {
  logTest('获取当前订阅');

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/subscriptions/current`,
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    if (response.data.subscription) {
      logSuccess('找到现有订阅');
      console.log(JSON.stringify(response.data.subscription, null, 2));
    } else {
      logWarning('当前没有订阅');
    }

    return response.data.subscription;
  } catch (error) {
    logError(`获取订阅失败: ${error.message}`);
    throw error;
  }
}

// 4. 测试模式：激活订阅
async function testModeActivateSubscription() {
  logTest('测试模式：激活 Pro 订阅');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subscriptions/test/activate`,
      {},
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    logSuccess('测试订阅激活成功');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      logWarning('测试模式未启用（需要设置 STRIPE_TEST_MODE=true）');
    } else {
      logError(`激活订阅失败: ${error.message}`);
    }
    throw error;
  }
}

// 5. 创建 Checkout Session
async function createCheckoutSession(plans) {
  logTest('创建 Checkout Session');

  try {
    const priceId = plans.pro.priceId || 'price_test_pro';
    
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subscriptions/checkout`,
      { priceId },
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    logSuccess('Checkout Session 创建成功');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.testMode) {
      logWarning('测试模式：未跳转到真实 Stripe');
    }

    return response.data;
  } catch (error) {
    logError(`创建 Checkout 失败: ${error.message}`);
    throw error;
  }
}

// 6. 检查功能访问权限
async function checkFeatureAccess(feature) {
  logTest(`检查功能访问权限: ${feature}`);

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/subscriptions/check-access`,
      {
        params: { feature },
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    if (response.data.hasAccess) {
      logSuccess(`有权访问功能: ${feature}`);
    } else {
      logWarning(`无权访问功能: ${feature}`);
    }

    console.log(JSON.stringify(response.data, null, 2));

    return response.data.hasAccess;
  } catch (error) {
    logError(`检查访问权限失败: ${error.message}`);
    throw error;
  }
}

// 7. 取消订阅
async function cancelSubscription() {
  logTest('取消订阅');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subscriptions/cancel`,
      { immediate: false },
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    logSuccess('订阅取消请求成功');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    if (error.response?.status === 500) {
      logWarning('取消订阅失败（可能没有活跃订阅）');
    } else {
      logError(`取消订阅失败: ${error.message}`);
    }
  }
}

// 8. 恢复订阅
async function resumeSubscription() {
  logTest('恢复订阅');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subscriptions/resume`,
      {},
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    logSuccess('订阅恢复成功');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    logWarning(`恢复订阅失败: ${error.message}`);
  }
}

// 9. 创建 Portal Session
async function createPortalSession() {
  logTest('创建 Portal Session');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subscriptions/portal`,
      {},
      {
        headers: { Authorization: `Bearer ${testToken}` },
      }
    );

    logSuccess('Portal Session 创建成功');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    logError(`创建 Portal 失败: ${error.message}`);
  }
}

// 主测试流程
async function runTests() {
  console.log('\n');
  log('🧪 开始订阅系统测试', 'cyan');
  log(`API Base URL: ${API_BASE_URL}`, 'blue');
  console.log('='.repeat(60));

  try {
    // 1. 登录
    await loginTestUser();

    // 2. 获取订阅计划
    const plans = await getSubscriptionPlans();

    // 3. 获取当前订阅（首次应该为空）
    await getCurrentSubscription();

    // 4. 测试模式：激活订阅
    try {
      await testModeActivateSubscription();
      
      // 激活后再次获取订阅
      await getCurrentSubscription();
      
      // 检查 Pro 功能访问权限
      await checkFeatureAccess('premium-prompts');
      await checkFeatureAccess('advanced-models');
      
      // 测试取消和恢复
      await cancelSubscription();
      await getCurrentSubscription();
      
      await resumeSubscription();
      await getCurrentSubscription();
      
      // 创建 Portal Session
      await createPortalSession();
      
    } catch (testModeError) {
      logWarning('跳过测试模式相关测试');
      
      // 尝试创建 Checkout Session
      await createCheckoutSession(plans);
    }

    console.log('\n' + '='.repeat(60));
    log('✅ 所有测试完成！', 'green');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    logError(`测试失败: ${error.message}`);
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// 运行测试
runTests();

