import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Settings,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentSubscription,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
  testModeActivateSubscription,
  type Subscription,
} from '../services/subscription';

/**
 * 订阅管理页面
 * 用户可以查看和管理他们的订阅
 */
export default function SubscriptionManagementPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadSubscription();
  }, [token, navigate]);

  const loadSubscription = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getCurrentSubscription(token);
      setSubscription(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load subscription:', err);
      setError('无法加载订阅信息');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!token) return;

    try {
      setProcessing(true);
      setError(null);
      const result = await createPortalSession(token);
      
      setIsTestMode(result.testMode);

      if (result.testMode) {
        // 测试模式：显示本地管理界面
        setSuccessMessage('测试模式：使用下方按钮管理订阅');
      } else {
        // 生产模式：跳转到 Stripe Portal
        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (err: any) {
      console.error('Failed to create portal session:', err);
      setError(err.response?.data?.message || '无法打开订阅管理');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!token) return;

    const confirmed = window.confirm(
      '确定要取消订阅吗？取消后，你仍然可以使用 Pro 功能直到当前计费周期结束。'
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setError(null);
      const result = await cancelSubscription(token, false);
      
      setIsTestMode(result.testMode);
      setSuccessMessage(result.message);
      
      // 重新加载订阅信息
      await loadSubscription();
    } catch (err: any) {
      console.error('Failed to cancel subscription:', err);
      setError(err.response?.data?.message || '取消订阅失败');
    } finally {
      setProcessing(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!token) return;

    try {
      setProcessing(true);
      setError(null);
      const result = await resumeSubscription(token);
      
      setIsTestMode(result.testMode);
      setSuccessMessage(result.message);
      
      // 重新加载订阅信息
      await loadSubscription();
    } catch (err: any) {
      console.error('Failed to resume subscription:', err);
      setError(err.response?.data?.message || '恢复订阅失败');
    } finally {
      setProcessing(false);
    }
  };

  const handleTestModeActivate = async () => {
    if (!token) return;

    try {
      setProcessing(true);
      setError(null);
      await testModeActivateSubscription(token);
      setSuccessMessage('✅ 测试模式：Pro 订阅已激活！');
      
      // 重新加载订阅信息
      await loadSubscription();
      
      // 刷新用户信息
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to activate test subscription:', err);
      setError(err.response?.data?.message || '激活失败');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            活跃
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" />
            已取消
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" />
            {status || '未知'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  const isPro = user?.subscriptionTier === 'pro';
  const hasSubscription = subscription !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">订阅管理</h1>
          <p className="text-gray-300">管理你的订阅和付费信息</p>
        </motion.div>

        {/* 测试模式提示 */}
        {isTestMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-400 text-center">
                🧪 测试模式已启用 - 无需真实支付
              </p>
            </div>
          </motion.div>
        )}

        {/* 成功消息 */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <p className="text-green-400 text-center">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {/* 错误消息 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          </motion.div>
        )}

        {/* 当前订阅状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">当前计划</h2>
            </div>
            {isPro && (
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold">
                Pro 会员
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 mb-2">订阅层级</p>
              <p className="text-white text-xl font-semibold">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </p>
            </div>

            {hasSubscription && subscription && (
              <>
                <div>
                  <p className="text-gray-400 mb-2">订阅状态</p>
                  {getStatusBadge(subscription.status)}
                </div>

                <div>
                  <p className="text-gray-400 mb-2">计费周期开始</p>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    {formatDate(subscription.currentPeriodStart)}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">计费周期结束</p>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    {formatDate(subscription.currentPeriodEnd)}
                  </div>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="md:col-span-2">
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                      <p className="text-yellow-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        你的订阅将在 {formatDate(subscription.currentPeriodEnd)} 结束
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {!isPro ? (
            // 免费用户：显示升级按钮
            <>
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200"
              >
                <Zap className="w-5 h-5" />
                升级到 Pro
                <ArrowUpRight className="w-5 h-5" />
              </button>

              {/* 测试模式：激活按钮 */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleTestModeActivate}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  🧪 测试：激活 Pro
                </button>
              )}
            </>
          ) : (
            // Pro 用户：显示管理按钮
            <>
              <button
                onClick={handleManageSubscription}
                disabled={processing}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              >
                <Settings className="w-5 h-5" />
                {processing ? '处理中...' : '管理订阅'}
              </button>

              <button
                onClick={handleManageSubscription}
                disabled={processing}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                更新支付方式
              </button>

              {subscription && subscription.cancelAtPeriodEnd ? (
                <button
                  onClick={handleResumeSubscription}
                  disabled={processing}
                  className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  恢复订阅
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={processing}
                  className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  <AlertCircle className="w-5 h-5" />
                  取消订阅
                </button>
              )}
            </>
          )}
        </motion.div>

        {/* Pro 功能列表 */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6">你的 Pro 权益</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {              [
                '无限次 AI 生成',
                '访问所有高级提示词',
                '所有 AI 模型支持',
                '优先客户支持',
                '高级编辑器功能',
                '提示词历史记录',
                '无广告体验',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 账单历史 */}
        {isPro && hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6">账单信息</h3>
            <p className="text-gray-300 mb-4">
              如需查看详细账单历史和下载发票，请点击"管理订阅"按钮访问 Stripe 客户门户。
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={processing}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              查看账单历史
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

