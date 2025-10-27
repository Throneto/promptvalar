import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getSubscriptionPlans,
  createCheckoutSession,
  testModeActivateSubscription,
  type SubscriptionPlans,
} from '../services/subscription';

/**
 * 定价页面
 * 展示订阅计划并处理购买流程
 */
export default function PricingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlans | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  // 获取认证 token
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionPlans();
      setPlans(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('无法加载订阅计划，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType: 'free' | 'pro') => {
    if (planType === 'free') {
      navigate('/register');
      return;
    }

    if (!isLoggedIn) {
      navigate('/login?redirect=/pricing');
      return;
    }

    if (!token || !plans) return;

    try {
      setProcessingPlan(planType);
      setError(null);

      // 创建 Checkout Session
      const priceId = plans.pro.priceId || 'price_test_pro';
      const result = await createCheckoutSession(token, priceId);

      setIsTestMode(result.testMode);

      if (result.testMode) {
        // 测试模式：直接激活订阅
        await testModeActivateSubscription(token);
        alert('✅ 测试模式：Pro 订阅已激活！');
        navigate('/dashboard/subscription');
      } else {
        // 生产模式：跳转到 Stripe Checkout
        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || '订阅失败，请稍后重试');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error || '加载失败'}</p>
          <button
            onClick={loadPlans}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题部分 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            选择适合你的计划
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            从免费计划开始，随时升级到 Pro 解锁全部功能
          </p>
          {isTestMode && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-sm">
                🧪 测试模式已启用 - 无需真实支付
              </p>
            </div>
          )}
        </motion.div>

        {/* 定价卡片 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">{plans.free.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">¥0</span>
              <span className="text-gray-400 ml-2">/ 月</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('free')}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? '当前计划' : '开始使用'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            {/* 推荐标签 */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-bold">
              推荐
            </div>

            <div className="flex items-center gap-3 mb-4 mt-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">{plans.pro.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">
                ¥{plans.pro.price}
              </span>
              <span className="text-gray-300 ml-2">/ 月</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={processingPlan === 'pro'}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPlan === 'pro' ? (
                '处理中...'
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  升级到 Pro
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* 错误提示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          </motion.div>
        )}

        {/* 功能对比表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            详细功能对比
          </h2>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-6 text-white">功能</th>
                  <th className="text-center p-6 text-white">Free</th>
                  <th className="text-center p-6 text-white bg-purple-600/20">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-gray-300">AI 生成次数</td>
                  <td className="p-6 text-center text-gray-300">
                    {plans.free.limits.aiGenerationsPerMonth} 次/月
                  </td>
                  <td className="p-6 text-center text-white bg-purple-600/10">
                    无限次
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-gray-300">高级提示词库</td>
                  <td className="p-6 text-center text-gray-300">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="p-6 text-center text-white bg-purple-600/10">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-gray-300">高级 AI 模型</td>
                  <td className="p-6 text-center text-gray-300">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="p-6 text-center text-white bg-purple-600/10">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-gray-300">优先客户支持</td>
                  <td className="p-6 text-center text-gray-300">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="p-6 text-center text-white bg-purple-600/10">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 text-gray-300">API 访问</td>
                  <td className="p-6 text-center text-gray-300">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="p-6 text-center text-white bg-purple-600/10">
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            常见问题
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                如何取消订阅？
              </h3>
              <p className="text-gray-300">
                你可以随时在账户设置中取消订阅。取消后，你仍然可以使用 Pro
                功能直到当前计费周期结束。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-300">
                我们通过 Stripe 支持信用卡、借记卡等多种支付方式，安全可靠。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                可以随时升级或降级吗？
              </h3>
              <p className="text-gray-300">
                是的，你可以随时升级到 Pro 计划。降级将在当前计费周期结束后生效。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

