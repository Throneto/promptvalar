import { motion } from 'framer-motion';
import { DollarSign, RefreshCw, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

/**
 * Refund Policy Page
 * Detailed information about our refund and cancellation policies
 */
export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900">
      <SEO 
        title="Refund Policy - PromptValar"
        description="Learn about PromptValar's refund and cancellation policies for subscriptions and services."
        url="https://promptvalar.com/refund-policy"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <DollarSign className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-xl text-green-100">
              Clear and fair refund terms for your peace of mind
            </p>
            <p className="text-sm text-green-200 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-600 dark:text-gray-100 leading-relaxed mb-4">
                At PromptValar, we strive to provide exceptional service and value to all our users. This Refund Policy 
                outlines the terms and conditions under which refunds may be issued for our subscription services.
              </p>
              <p className="text-gray-600 dark:text-gray-100 leading-relaxed">
                By subscribing to any of our paid plans, you acknowledge that you have read, understood, and agree to 
                this Refund Policy.
              </p>
            </motion.div>

            {/* Subscription Refunds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Refund Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7-Day Money-Back Guarantee</h3>
                  <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4 mb-4">
                    <div className="flex">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 dark:text-green-100 font-semibold mb-2">New Subscribers Only</p>
                        <p className="text-green-700 dark:text-green-100">
                          If you are not satisfied with our Pro subscription within the first 7 days of your initial 
                          purchase, you may request a full refund. This guarantee applies to your first subscription only.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-100">To qualify for the 7-day money-back guarantee, you must:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-100 space-y-2 ml-4 mt-2">
                    <li>Be a first-time Pro subscriber</li>
                    <li>Submit your refund request within 7 days of your initial purchase date</li>
                    <li>Provide a brief explanation of why you're requesting a refund</li>
                    <li>Not have violated our Terms of Service</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Renewal Refunds</h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <XCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 dark:text-yellow-100 font-semibold mb-2">No Refunds for Renewals</p>
                        <p className="text-yellow-700 dark:text-yellow-100">
                          Subscription renewals (monthly or annual) are not eligible for refunds. However, you can cancel 
                          your subscription at any time to prevent future charges.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-100">
                    When you cancel your subscription, you will continue to have access to Pro features until the end of 
                    your current billing period. After that, your account will automatically revert to the Free plan.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Partial Refunds</h3>
                  <p className="text-gray-600 dark:text-gray-100 mb-2">
                    We do not provide partial refunds for unused subscription time except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-100 space-y-2 ml-4">
                    <li>Service disruption lasting more than 48 consecutive hours (pro-rated credit)</li>
                    <li>Significant feature removal affecting your subscription value (case-by-case basis)</li>
                    <li>Billing errors or unauthorized charges (full refund of erroneous charges)</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cancellation Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Cancel</h3>
                  <p className="text-gray-600 dark:text-gray-100 mb-3">You can cancel your subscription at any time through:</p>
                  <ol className="list-decimal list-inside text-gray-600 dark:text-gray-100 space-y-2 ml-4">
                    <li>Navigate to your <Link to="/dashboard/subscription" className="text-blue-600 dark:text-blue-400 hover:underline">Subscription Management</Link> page</li>
                    <li>Click the "Cancel Subscription" button</li>
                    <li>Confirm your cancellation</li>
                    <li>Receive a confirmation email</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Happens After Cancellation</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-100">
                          <strong>Immediate Effect:</strong> Your subscription is marked for cancellation, and no future 
                          charges will be made.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-100">
                          <strong>Access Continuation:</strong> You maintain full Pro access until the end of your current 
                          billing period.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-100">
                          <strong>Data Retention:</strong> Your prompts and favorites are preserved and accessible under 
                          the Free plan limits.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-100">
                          <strong>Reactivation:</strong> You can resubscribe at any time to regain Pro access.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Automatic Renewal</h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    All subscriptions automatically renew at the end of each billing period unless cancelled. We will send 
                    you a reminder email 7 days before your subscription renews to give you time to cancel if desired.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Refund Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How to Request a Refund</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-100">
                  If you believe you are eligible for a refund under this policy, please follow these steps:
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Contact Support</h4>
                        <p className="text-gray-600 dark:text-gray-100">
                          Email us at <a href="mailto:refunds@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">refunds@promptvalar.com</a> with 
                          the subject line "Refund Request"
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Provide Information</h4>
                        <p className="text-gray-600 dark:text-gray-100">
                          Include your account email, subscription date, and reason for the refund request
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Wait for Review</h4>
                        <p className="text-gray-600 dark:text-gray-100">
                          Our team will review your request within 2-3 business days
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Receive Refund</h4>
                        <p className="text-gray-600 dark:text-gray-100">
                          If approved, refunds are processed within 5-10 business days to your original payment method
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>

            {/* Exceptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Refund Exceptions</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-100 mb-4">Refunds will NOT be issued in the following cases:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-100">
                    <strong>Violation of Terms:</strong> Accounts terminated for violating our Terms of Service
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-100">
                    <strong>Late Requests:</strong> Refund requests submitted after the 7-day window (for initial purchases)
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-100">
                    <strong>Abuse:</strong> Repeated subscription and cancellation patterns indicating abuse of the policy
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-100">
                    <strong>Change of Mind:</strong> Renewals or subscriptions older than 7 days (unless exceptional circumstances)
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-100">
                    <strong>Third-Party Issues:</strong> Technical issues with third-party AI providers (we'll provide credits instead)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Billing Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Billing Errors and Disputes</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Unauthorized Charges</h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    If you notice an unauthorized charge on your account, please contact us immediately at{' '}
                    <a href="mailto:billing@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">billing@promptvalar.com</a>. 
                    We will investigate and issue a full refund if the charge was made in error.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Duplicate Charges</h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    If you are accidentally charged multiple times for the same subscription period, we will refund the 
                    duplicate charges immediately upon verification.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Failed Cancellation</h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    If you cancelled your subscription but were still charged, please provide proof of cancellation (such as 
                    a confirmation email), and we will issue a full refund for the erroneous charge.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refund Payment Method</h2>
              <p className="text-gray-600 dark:text-gray-100 mb-4">
                All approved refunds will be processed through the same payment method used for the original purchase:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-100 space-y-2 ml-4">
                <li><strong>Credit/Debit Card:</strong> 5-10 business days to appear on your statement</li>
                <li><strong>PayPal:</strong> 3-5 business days</li>
                <li><strong>Other Methods:</strong> Timing varies by provider</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-100 mt-4">
                <em>Note:</em> Refund processing times depend on your financial institution and may take longer during peak periods.
              </p>
            </motion.div>

            {/* Credits and Alternatives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Account Credits</h2>
              <p className="text-gray-600 dark:text-gray-100 mb-4">
                In some cases, we may offer account credits as an alternative to refunds:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-100 space-y-2 ml-4">
                <li>Service disruptions or performance issues</li>
                <li>Technical problems affecting your experience</li>
                <li>Goodwill gestures for long-term customers</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-100 mt-4">
                Account credits can be applied to future subscription payments or used for additional AI generation credits.
              </p>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Can I get a refund if I'm not satisfied after 7 days?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    Unfortunately, the 7-day money-back guarantee only applies to your initial purchase. After that period, 
                    we recommend cancelling to avoid future charges, but refunds for already-paid subscription periods are 
                    not provided.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    What happens to my AI generation credits if I cancel?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    Unused AI generation credits do not carry over after cancellation. However, you can continue using 
                    your Pro features and credits until the end of your billing period.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Can I switch from monthly to annual and get a refund for the monthly payment?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    When you upgrade from monthly to annual, we'll credit the unused portion of your monthly subscription 
                    towards your annual payment. This ensures you don't pay twice for the same period.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    What if I forgot to cancel before renewal?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-100">
                    We understand this can happen. While renewals aren't typically refunded, we may make exceptions on a 
                    case-by-case basis if you contact us within 48 hours of the charge and haven't used Pro features since renewal.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h2>
              <p className="text-gray-600 dark:text-gray-100 mb-4">
                If you have questions about our refund policy or need assistance with a refund request, we're here to help:
              </p>
              <ul className="text-gray-600 dark:text-gray-100 space-y-2">
                <li><strong>Refund Requests:</strong> <a href="mailto:refunds@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">refunds@promptvalar.com</a></li>
                <li><strong>Billing Questions:</strong> <a href="mailto:billing@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">billing@promptvalar.com</a></li>
                <li><strong>General Support:</strong> <a href="mailto:support@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@promptvalar.com</a></li>
                <li><strong>Response Time:</strong> 24-48 hours (weekdays)</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  This Refund Policy is part of our <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link> and 
                  should be read in conjunction with our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

