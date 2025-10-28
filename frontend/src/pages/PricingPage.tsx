import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles, ArrowRight, Star, Shield, RefreshCcw, Users, Building2, Infinity } from 'lucide-react';
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            选择适合你的计划
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            从免费计划开始，随时升级到 Pro 解锁全部功能
          </p>

          {/* 计费周期切换 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              按月付费
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-white/20 rounded-full transition-colors hover:bg-white/30"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-purple-600 rounded-full transition-transform duration-300 ${
                  billingCycle === 'yearly' ? 'transform translate-x-8' : ''
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              按年付费
            </span>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full">
              省20%
            </span>
          </div>

          {/* 信任标识 */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>安全支付</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-blue-400" />
              <span>7天退款保证</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>10,000+ 用户信赖</span>
            </div>
          </div>

          {isTestMode && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-sm">
                🧪 测试模式已启用 - 无需真实支付
              </p>
            </div>
          )}
        </motion.div>

        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">{plans.free.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">¥0</span>
              <span className="text-gray-400 ml-2">永久免费</span>
            </div>

            <ul className="space-y-3 mb-8 min-h-[280px]">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('free')}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? '当前计划' : '免费开始'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform scale-105"
          >
            {/* 推荐标签 */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 text-sm font-bold">
              最受欢迎
            </div>

            <div className="flex items-center gap-3 mb-4 mt-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">{plans.pro.name}</h3>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                {billingCycle === 'yearly' && (
                  <span className="text-2xl font-bold text-gray-400 line-through">
                    ¥{plans.pro.price * 12}
                  </span>
                )}
                <span className="text-5xl font-bold text-white">
                  ¥{billingCycle === 'monthly' ? plans.pro.price : Math.floor(plans.pro.price * 12 * 0.8)}
                </span>
              </div>
              <span className="text-gray-300">/ {billingCycle === 'monthly' ? '月' : '年'}</span>
              {billingCycle === 'yearly' && (
                <div className="mt-2 text-green-400 text-sm font-semibold">
                  💰 节省 ¥{Math.floor(plans.pro.price * 12 * 0.2)} /年
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8 min-h-[280px]">
              {plans.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-medium text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={processingPlan === 'pro'}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
            >
              {processingPlan === 'pro' ? (
                '处理中...'
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  立即升级
                </>
              )}
            </button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-orange-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">企业版</h3>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">定制</span>
              <span className="text-gray-400 ml-2 block mt-2">按需报价</span>
            </div>

            <ul className="space-y-3 mb-8 min-h-[280px]">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Pro 版所有功能</span>
              </li>
              <li className="flex items-start gap-3">
                <Infinity className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">无限 AI 生成次数</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">多用户协作管理</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">专属客户经理</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">SLA 服务保障</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">私有化部署选项</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">定制化功能开发</span>
              </li>
            </ul>

            <button
              onClick={() => window.location.href = 'mailto:enterprise@promptvalar.com?subject=企业版咨询'}
              className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              联系销售
              <ArrowRight className="w-5 h-5" />
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

        {/* 用户评价 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            用户怎么说
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "PromptValar 彻底改变了我的内容创作流程。AI 生成的提示词质量非常高，节省了大量时间！"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  李
                </div>
                <div>
                  <p className="text-white font-semibold">李明</p>
                  <p className="text-gray-400 text-sm">视频创作者</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "作为设计师，我每天都用 PromptValar 生成创意灵感。Pro 版的高级功能完全值这个价格。"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  王
                </div>
                <div>
                  <p className="text-white font-semibold">王芳</p>
                  <p className="text-gray-400 text-sm">UI/UX 设计师</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "免费版就已经很好用了，升级到 Pro 后更是如虎添翼。客服响应也很及时，强烈推荐！"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  张
                </div>
                <div>
                  <p className="text-white font-semibold">张伟</p>
                  <p className="text-gray-400 text-sm">自媒体运营</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            常见问题
          </h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
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
                我们通过 Stripe 支持信用卡、借记卡、支付宝、微信支付等多种支付方式，安全可靠。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                可以随时升级或降级吗？
              </h3>
              <p className="text-gray-300">
                是的，你可以随时升级到 Pro 计划。降级将在当前计费周期结束后生效，不会影响已付费的使用权限。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                有退款政策吗？
              </h3>
              <p className="text-gray-300">
                我们提供 7 天无理由退款保证。如果您对服务不满意，可以在购买后 7 天内申请全额退款。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                Pro 版有使用限制吗？
              </h3>
              <p className="text-gray-300">
                Pro 版提供无限次 AI 生成，没有每月使用限制。但为保证服务质量，我们有合理使用政策。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                企业版如何定价？
              </h3>
              <p className="text-gray-300">
                企业版根据团队规模、功能需求和使用量定制报价。请联系我们的销售团队获取专属方案。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                学生或教育机构有优惠吗？
              </h3>
              <p className="text-gray-300">
                我们为学生和教育机构提供特别优惠。请使用教育邮箱联系我们申请教育折扣。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">
                数据安全有保障吗？
              </h3>
              <p className="text-gray-300">
                我们使用业界标准的加密技术保护您的数据，定期备份，并严格遵守数据隐私法规。
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/50">
            <h2 className="text-4xl font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              加入数千名创作者，使用 PromptValar 提升你的 AI 创作效率
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-purple-500/50"
              >
                免费开始使用
              </button>
              <button
                onClick={() => handleSubscribe('pro')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors duration-200 border border-white/20"
              >
                升级到 Pro
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

