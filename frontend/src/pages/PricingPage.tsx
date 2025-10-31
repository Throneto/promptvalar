import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Star,
  Infinity,
  TrendingUp,
  Users,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { generateWebPageSchema } from '../utils/structuredData';
import {
  getSubscriptionPlans,
  createCheckoutSession,
  testModeActivateSubscription,
  type SubscriptionPlans,
} from '../services/subscription';

/**
 * Pricing Page
 * Display subscription plans and handle purchase flow
 */
export default function PricingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlans | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Get authentication token
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  // 生成结构化数据
  const webPageSchema = generateWebPageSchema(
    'Pricing - PromptValar',
    'https://promptvalar.com/pricing',
    'Choose the perfect subscription plan for your AI prompt engineering needs. Free, Pro, and Enterprise plans available with transparent pricing.',
    ['en', 'zh-CN']
  );

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
      setError('Unable to load subscription plans. Please refresh the page.');
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

      // Create Checkout Session
      const priceId = plans.pro.priceId || 'price_test_pro';
      const result = await createCheckoutSession(token, priceId);

      setIsTestMode(result.testMode);

      if (result.testMode) {
        // Test mode: directly activate subscription
        await testModeActivateSubscription(token);
        alert('✅ Test Mode: Pro subscription activated!');
        navigate('/dashboard/subscription');
      } else {
        // Production mode: redirect to Stripe Checkout
        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || 'Subscription failed. Please try again later.');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-gray-900 dark:text-white text-center">
          <p className="text-xl mb-4">{error || 'Failed to load'}</p>
          <button
            onClick={loadPlans}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-20 px-4 transition-colors duration-300">
      <SEO 
        title="Pricing Plans - PromptValar"
        description="Choose the perfect subscription plan for your AI prompt engineering needs. Free, Pro, and Enterprise plans available with transparent pricing and flexible billing options."
        url="https://promptvalar.com/pricing"
        keywords="PromptValar pricing, AI prompt tool pricing, subscription plans, AI tool pricing, prompt engineering cost"
        structuredData={webPageSchema}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-2 bg-purple-500/20 dark:bg-purple-500/20 border border-purple-500/50 rounded-full px-6 py-2">
              <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <span className="text-purple-900 dark:text-purple-200 font-medium">Simple, Transparent Pricing</span>
            </div>
          </motion.div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Start with our free plan and upgrade anytime to unlock premium features. 
            No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-900 dark:text-white/60 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-900 dark:text-white/60 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                Save 20%
              </span>
            </button>
          </div>

          {isTestMode && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-sm">
                🧪 Test Mode Enabled - No real payment required
              </p>
            </div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plans.free.name}</h3>
              </div>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-full text-sm font-bold">
                Starter
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-700 dark:text-gray-300">/ month</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('free')}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 group shadow-md border border-gray-300 dark:border-slate-600"
            >
              {isLoggedIn ? 'Current Plan' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-700 to-pink-700 dark:from-purple-600 dark:to-pink-600 rounded-2xl p-8 border-2 border-purple-400 relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            {/* Recommended Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-8 py-2 text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>

            <div className="flex items-center justify-between mb-6 mt-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-300" />
                <h3 className="text-2xl font-bold text-white drop-shadow-md">{plans.pro.name}</h3>
              </div>
              <div className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold">
                Best Value
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white drop-shadow-lg">
                  ${billingCycle === 'monthly' ? plans.pro.price : Math.round(plans.pro.price * 0.8 * 12)}
                </span>
                <span className="text-white/90 font-medium">
                  / {billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-green-200 mt-2 font-bold drop-shadow-md">
                  Save ${Math.round(plans.pro.price * 0.2 * 12)}/year
                </p>
              )}
              <p className="text-white/90 mt-2 font-medium">Everything you need to scale</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plans.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-semibold drop-shadow-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={processingPlan === 'pro'}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 group"
            >
              {processingPlan === 'pro' ? (
                'Processing...'
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Upgrade to Pro
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 dark:border-white/10">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">10,000+</div>
              <div className="text-sm text-gray-950 dark:text-gray-400">Active Users</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 dark:border-white/10">
              <Star className="w-8 h-8 text-yellow-500 dark:text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.9/5</div>
              <div className="text-sm text-gray-950 dark:text-gray-400">User Rating</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 dark:border-white/10">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">500K+</div>
              <div className="text-sm text-gray-950 dark:text-gray-400">Prompts Created</div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 dark:border-white/10">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24/7</div>
              <div className="text-sm text-gray-950 dark:text-gray-400">Support</div>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Detailed Feature Comparison
          </h2>

          <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-white/20 max-w-5xl mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/20">
                  <th className="text-left p-6 text-gray-900 dark:text-white font-bold">Feature</th>
                  <th className="text-center p-6 text-gray-900 dark:text-white font-bold">Free</th>
                  <th className="text-center p-6 text-gray-900 dark:text-white font-bold bg-purple-100 dark:bg-purple-600/20">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-950 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Infinity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      AI Generations
                    </div>
                  </td>
                  <td className="p-6 text-center text-gray-950 dark:text-gray-300">
                    {plans.free.limits.aiGenerationsPerMonth} / month
                  </td>
                  <td className="p-6 text-center text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-600/10 font-semibold">
                    Unlimited
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-950 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      Premium Prompt Library
                    </div>
                  </td>
                  <td className="p-6 text-center text-gray-950 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                  </td>
                  <td className="p-6 text-center text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-600/10">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-950 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      Advanced AI Models
                    </div>
                  </td>
                  <td className="p-6 text-center text-gray-950 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                  </td>
                  <td className="p-6 text-center text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-600/10">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-950 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Priority Support
                    </div>
                  </td>
                  <td className="p-6 text-center text-gray-950 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                  </td>
                  <td className="p-6 text-center text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-600/10">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-950 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Team Collaboration
                    </div>
                  </td>
                  <td className="p-6 text-center text-gray-950 dark:text-gray-300">
                    <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                  </td>
                  <td className="p-6 text-center text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-600/10">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">Q:</span>
                How do I cancel my subscription?
              </h3>
              <p className="text-gray-950 dark:text-gray-300 leading-relaxed">
                You can cancel your subscription anytime from your account settings. After cancellation, 
                you'll continue to have access to Pro features until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">Q:</span>
                What payment methods do you accept?
              </h3>
              <p className="text-gray-950 dark:text-gray-300 leading-relaxed">
                We accept all major credit cards, debit cards, and other payment methods through our secure 
                payment processor Stripe. All transactions are encrypted and secure.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">Q:</span>
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-950 dark:text-gray-300 leading-relaxed">
                Yes! You can upgrade to Pro at any time and start enjoying premium features immediately. 
                Downgrades will take effect at the end of your current billing cycle.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">Q:</span>
                Is there a refund policy?
              </h3>
              <p className="text-gray-950 dark:text-gray-300 leading-relaxed">
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our Pro plan, 
                contact our support team within 30 days of purchase for a full refund.
              </p>
            </div>

            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">Q:</span>
                Do you offer discounts for annual plans?
              </h3>
              <p className="text-gray-950 dark:text-gray-300 leading-relaxed">
                Absolutely! Save 20% when you choose our annual billing option. That's 2 months free 
                compared to paying monthly. Switch anytime in your account settings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/50">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to supercharge your AI workflow?
            </h2>
            <p className="text-xl text-gray-950 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using PromptValar to create 
              amazing AI-powered content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-purple-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => handleSubscribe('pro')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50"
              >
                Get Pro Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
