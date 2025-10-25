import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.service';
import { getPrompts, getMyFavorites } from '../services/prompt.service';
import { User, FileText, Heart, TrendingUp, Calendar, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    promptCount: 0,
    favoriteCount: 0,
    viewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // 获取用户的提示词数量
      const promptsResponse = await getPrompts({ limit: 1 });
      
      // 获取用户的收藏数量
      const favoritesResponse = await getMyFavorites({ limit: 1 });
      
      setStats({
        promptCount: promptsResponse.data.pagination.total,
        favoriteCount: favoritesResponse.data.pagination.total,
        viewCount: 0, // 这里可以从后端获取总浏览量
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getSubscriptionLabel = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'Pro会员';
      case 'premium':
        return 'Premium会员';
      default:
        return '免费版';
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">个人中心</h1>
          <p className="text-gray-600">管理您的个人信息和内容</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：用户信息卡片 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* 头部渐变背景 */}
              <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500"></div>
              
              {/* 用户头像和信息 */}
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.username}</h2>
                  
                  {/* 订阅徽章 */}
                  <div className={`mt-2 px-4 py-1 rounded-full text-white text-sm font-semibold ${getSubscriptionBadgeColor(user.subscriptionTier)}`}>
                    {getSubscriptionLabel(user.subscriptionTier)}
                  </div>
                </div>

                {/* 用户详细信息 */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">加入于 {formatDate(user.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">账号状态：正常</span>
                  </div>
                </div>

                {/* 编辑按钮 */}
                <Link
                  to="/dashboard/settings"
                  className="mt-6 w-full btn-primary text-center block"
                >
                  编辑个人资料
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 右侧：统计和快捷操作 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 统计卡片 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">数据统计</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 提示词数量 */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 text-purple-500" />
                    <span className="text-sm text-gray-500">我的提示词</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.promptCount}</p>
                  <p className="text-sm text-gray-600 mt-1">个提示词</p>
                </div>

                {/* 收藏数量 */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-8 h-8 text-pink-500" />
                    <span className="text-sm text-gray-500">我的收藏</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.favoriteCount}</p>
                  <p className="text-sm text-gray-600 mt-1">个收藏</p>
                </div>

                {/* 浏览量 */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <span className="text-sm text-gray-500">总浏览量</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.viewCount}</p>
                  <p className="text-sm text-gray-600 mt-1">次浏览</p>
                </div>
              </div>
            </motion.div>

            {/* 快捷操作 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">快捷操作</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 创建提示词 */}
                <Link
                  to="/studio"
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">创建提示词</h4>
                      <p className="text-sm text-gray-600">使用AI Studio创建新提示词</p>
                    </div>
                  </div>
                </Link>

                {/* 浏览提示词库 */}
                <Link
                  to="/library"
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">浏览提示词库</h4>
                      <p className="text-sm text-gray-600">发现优质提示词</p>
                    </div>
                  </div>
                </Link>

                {/* 我的提示词 */}
                <Link
                  to="/dashboard/prompts"
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">我的提示词</h4>
                      <p className="text-sm text-gray-600">管理您创建的提示词</p>
                    </div>
                  </div>
                </Link>

                {/* 我的收藏 */}
                <Link
                  to="/dashboard/favorites"
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">我的收藏</h4>
                      <p className="text-sm text-gray-600">查看收藏的提示词</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

