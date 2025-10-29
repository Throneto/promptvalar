import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Eye,
  Heart,
  UserPlus,
  Activity,
  LayoutDashboard,
  UserCircle,
  BookText
} from 'lucide-react';
import { getDashboardStats, getTopPrompts, type DashboardStats, type TopPrompt } from '../services/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPrompts, setTopPrompts] = useState<TopPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('未登录');
      }

      // 并行加载数据
      const [statsData, promptsData] = await Promise.all([
        getDashboardStats(token),
        getTopPrompts(token, 10),
      ]);

      setStats(statsData);
      setTopPrompts(promptsData);
    } catch (err: any) {
      console.error('加载仪表板数据失败:', err);
      setError(err.response?.data?.error?.message || err.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 导航菜单 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <LayoutDashboard className="w-5 h-5" />
              📊 仪表板
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <UserCircle className="w-5 h-5" />
              👥 用户管理
            </Link>
            <Link
              to="/admin/prompts"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <BookText className="w-5 h-5" />
              📝 提示词管理
            </Link>
          </div>
        </motion.div>

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">管理员仪表板</h1>
          <p className="text-purple-200">平台数据概览和管理</p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="总用户数"
            value={stats?.totalUsers || 0}
            subtitle={`${stats?.activeUsers || 0} 活跃`}
            color="blue"
            delay={0}
          />
          <StatCard
            icon={<FileText className="w-8 h-8" />}
            title="总提示词"
            value={stats?.totalPrompts || 0}
            subtitle={`本月新增 ${stats?.newPromptsThisMonth || 0}`}
            color="green"
            delay={0.1}
          />
          <StatCard
            icon={<CreditCard className="w-8 h-8" />}
            title="Pro 订阅"
            value={stats?.activeSubscriptions || 0}
            subtitle={`转化率 ${stats?.conversionRate || '0%'}`}
            color="purple"
            delay={0.2}
          />
          <StatCard
            icon={<UserPlus className="w-8 h-8" />}
            title="本月新用户"
            value={stats?.newUsersThisMonth || 0}
            subtitle={`总计 ${stats?.totalUsers || 0} 用户`}
            color="pink"
            delay={0.3}
          />
        </div>

        {/* 用户状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">用户状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-200">活跃用户</span>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats?.activeUsers || 0}</div>
              <div className="text-sm text-blue-200 mt-1">
                {stats?.totalUsers ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% 活跃率
              </div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200">Pro 用户</span>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats?.activeSubscriptions || 0}</div>
              <div className="text-sm text-purple-200 mt-1">
                {stats?.freeUsers || 0} 免费用户
              </div>
            </div>
            <div className="bg-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-200">非活跃</span>
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stats?.inactiveUsers || 0}</div>
              <div className="text-sm text-red-200 mt-1">
                {stats?.totalUsers ? ((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1) : 0}% 非活跃率
              </div>
            </div>
          </div>
        </motion.div>

        {/* 热门提示词 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">热门提示词 Top 10</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-purple-200 font-semibold">标题</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-semibold">模型</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-semibold">作者</th>
                  <th className="text-center py-3 px-4 text-purple-200 font-semibold">浏览</th>
                  <th className="text-center py-3 px-4 text-purple-200 font-semibold">收藏</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-semibold">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {topPrompts.map((prompt, index) => (
                  <motion.tr
                    key={prompt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-medium">{prompt.title}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200">
                        {prompt.model}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-200">{prompt.authorUsername}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-300">
                        <Eye className="w-4 h-4" />
                        <span>{prompt.viewsCount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-pink-300">
                        <Heart className="w-4 h-4" />
                        <span>{prompt.favoritesCount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-purple-200 text-sm">
                      {new Date(prompt.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 统计卡片组件
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'pink';
  delay: number;
}

function StatCard({ icon, title, value, subtitle, color, delay }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity" 
           style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center mb-4 text-white`}>
          {icon}
        </div>
        <h3 className="text-purple-200 text-sm font-medium mb-1">{title}</h3>
        <div className="text-4xl font-bold text-white mb-2">{value.toLocaleString()}</div>
        <p className="text-purple-300 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

