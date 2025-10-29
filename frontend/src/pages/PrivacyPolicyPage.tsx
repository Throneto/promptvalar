import { motion } from 'framer-motion';
import { Shield, Eye, Lock, UserCheck, Database, Mail } from 'lucide-react';
import SEO from '../components/SEO';

/**
 * Privacy Policy Page
 * Detailed information about how we collect, use, and protect user data
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900">
      <SEO 
        title="Privacy Policy - PromptValar"
        description="Learn how PromptValar collects, uses, and protects your personal information. Your privacy is our priority."
        url="https://promptvalar.com/privacy"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">
              Your privacy matters to us. Learn how we protect your data.
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Welcome to PromptValar ("we," "our," or "us"). We are committed to protecting your personal information 
                and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our website and services.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By using PromptValar, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </motion.div>

            {/* Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Personal Information</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">We collect personal information that you voluntarily provide to us when you:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>Register for an account</li>
                    <li>Subscribe to our services</li>
                    <li>Use our AI prompt generation features</li>
                    <li>Contact our support team</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mt-3">This information may include:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>Name and email address</li>
                    <li>Username and password</li>
                    <li>Payment information (processed securely through Stripe)</li>
                    <li>Profile information and preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Usage Data</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">We automatically collect certain information when you use our services:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and features used</li>
                    <li>Time and date of your visits</li>
                    <li>Prompts you create and save</li>
                    <li>AI generation usage statistics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Cookies and Tracking Technologies</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We use cookies and similar tracking technologies to track activity on our service and store certain information. 
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">How We Use Your Information</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">We use the information we collect for various purposes:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process your transactions and manage your subscriptions</li>
                <li>To send you technical notices, updates, and support messages</li>
                <li>To respond to your comments, questions, and customer service requests</li>
                <li>To send you marketing and promotional communications (with your consent)</li>
                <li>To monitor and analyze usage patterns and trends</li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To personalize your experience and provide content tailored to your interests</li>
                <li>To enforce our Terms of Service and protect our legal rights</li>
              </ul>
            </motion.div>

            {/* Information Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Information Sharing and Disclosure</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">We may share your information in the following situations:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Service Providers</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We share information with third-party service providers who perform services on our behalf, such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4 mt-2">
                    <li>Payment processing (Stripe)</li>
                    <li>Cloud hosting services</li>
                    <li>Email delivery services</li>
                    <li>Analytics providers</li>
                    <li>AI model providers (Claude/OpenRouter)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Legal Requirements</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We may disclose your information if required to do so by law or in response to valid requests by 
                    public authorities (e.g., a court or government agency).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Business Transfers</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred. 
                    We will provide notice before your information is transferred and becomes subject to a different privacy policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Public Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Prompts you choose to make public in our library may be viewed by other users. Please be mindful of 
                    the information you choose to share publicly.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Security</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Encryption of data in transit using SSL/TLS</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we 
                strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>
            </motion.div>

            {/* Data Retention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                When you delete your account, we will delete or anonymize your personal information within 30 days, 
                except where we are required to retain it for legal, accounting, or security purposes.
              </p>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Privacy Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                <li><strong>Restrict Processing:</strong> Request restriction of processing your information</li>
                <li><strong>Object:</strong> Object to our processing of your personal information</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                To exercise these rights, please contact us at privacy@promptvalar.com. We will respond to your request 
                within 30 days.
              </p>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our services are not intended for individuals under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately so we can delete such information.
              </p>
            </motion.div>

            {/* International Transfers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">International Data Transfers</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your information may be transferred to and maintained on computers located outside of your state, province, 
                country, or other governmental jurisdiction where data protection laws may differ.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We ensure that appropriate safeguards are in place to protect your information in accordance with this 
                Privacy Policy and applicable laws.
              </p>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy 
                Policy are effective when they are posted on this page.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Us</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Email:</strong> privacy@promptvalar.com</li>
                <li><strong>Website:</strong> https://promptvalar.com</li>
                <li><strong>Support:</strong> support@promptvalar.com</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

