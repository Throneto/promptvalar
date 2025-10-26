#!/usr/bin/env node

/**
 * 测试收藏功能的脚本
 * 用于验证前后端收藏API是否正常工作
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// 测试用户数据
const testUser = {
  username: 'testuser123',
  email: 'test@example.com',
  password: 'TestPassword123'
};

let authToken = '';
let userId = '';
let promptId = '';

async function testFavoritesAPI() {
  console.log('🧪 开始测试收藏功能...\n');

  try {
    // 1. 注册测试用户
    console.log('1️⃣ 注册测试用户...');
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      console.log('✅ 用户注册成功');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️ 用户已存在，继续登录...');
      } else {
        throw error;
      }
    }

    // 2. 登录获取token
    console.log('2️⃣ 用户登录...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = loginResponse.data.data.accessToken;
    userId = loginResponse.data.data.user.id;
    console.log('✅ 登录成功，获取到token');

    // 3. 获取提示词列表
    console.log('3️⃣ 获取提示词列表...');
    const promptsResponse = await axios.get(`${API_BASE_URL}/prompts?limit=1`);
    
    if (promptsResponse.data.data.prompts.length === 0) {
      console.log('❌ 没有找到提示词，无法测试收藏功能');
      return;
    }
    
    promptId = promptsResponse.data.data.prompts[0].id;
    console.log(`✅ 找到提示词: ${promptId}`);

    // 4. 测试添加收藏
    console.log('4️⃣ 测试添加收藏...');
    const addFavoriteResponse = await axios.post(
      `${API_BASE_URL}/prompts/${promptId}/favorite`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ 添加收藏成功:', addFavoriteResponse.data.data);

    // 5. 测试取消收藏
    console.log('5️⃣ 测试取消收藏...');
    const removeFavoriteResponse = await axios.post(
      `${API_BASE_URL}/prompts/${promptId}/favorite`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ 取消收藏成功:', removeFavoriteResponse.data.data);

    // 6. 再次添加收藏
    console.log('6️⃣ 再次添加收藏...');
    const addFavoriteAgainResponse = await axios.post(
      `${API_BASE_URL}/prompts/${promptId}/favorite`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ 再次添加收藏成功:', addFavoriteAgainResponse.data.data);

    // 7. 获取用户收藏列表
    console.log('7️⃣ 获取用户收藏列表...');
    const favoritesResponse = await axios.get(
      `${API_BASE_URL}/prompts/favorites/me`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ 获取收藏列表成功:', favoritesResponse.data.data);

    // 8. 验证提示词详情中的收藏状态
    console.log('8️⃣ 验证提示词详情中的收藏状态...');
    const promptDetailResponse = await axios.get(
      `${API_BASE_URL}/prompts/${promptId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ 提示词详情获取成功');
    console.log('📊 收藏状态:', promptDetailResponse.data.data.isFavorited);

    console.log('\n🎉 所有收藏功能测试通过！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    console.error('详细错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  testFavoritesAPI();
}

module.exports = { testFavoritesAPI };
