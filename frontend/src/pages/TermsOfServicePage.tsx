import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Users } from 'lucide-react';
import SEO from '../components/SEO';

/**
 * Terms of Service Page
 * Legal terms and conditions for using PromptValar
 */
export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <SEO 
        title="Terms of Service - PromptValar"
        description="Read the terms and conditions for using PromptValar's AI prompt engineering platform."
        url="https://promptvalar.com/terms"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-purple-100">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-purple-200 mt-4">
              Last Updated: January 1, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and PromptValar 
                ("Company," "we," "us," or "our") concerning your access to and use of the PromptValar website 
                (https://promptvalar.com) and any related services (collectively, the "Services").
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these 
                Terms, you must not access or use our Services.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
                  <p className="text-yellow-800">
                    <strong>Important:</strong> These Terms include provisions that limit our liability and require you 
                    to resolve disputes through arbitration on an individual basis, not as part of a class or 
                    representative action.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Eligibility</h2>
              </div>
              <p className="text-gray-600 mb-4">To use our Services, you must:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Be at least 13 years of age (or the age of majority in your jurisdiction)</li>
                <li>Have the legal capacity to enter into a binding contract</li>
                <li>Not be prohibited from using the Services under applicable laws</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
            </motion.div>

            {/* User Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">User Accounts</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <p className="text-gray-600">
                    When you create an account with us, you must provide information that is accurate, complete, and current. 
                    Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Security</h3>
                  <p className="text-gray-600 mb-2">You are responsible for:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Maintaining the confidentiality of your account password</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized access or security breach</li>
                    <li>Ensuring you log out at the end of each session</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Termination</h3>
                  <p className="text-gray-600">
                    We reserve the right to suspend or terminate your account at any time for any reason, including but 
                    not limited to violation of these Terms, fraudulent activity, or abuse of our Services.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Acceptable Use */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Acceptable Use Policy</h2>
              </div>
              
              <p className="text-gray-600 mb-4">You agree not to use our Services to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Distribute spam, malware, or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Services</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data of other users</li>
                <li>Use the Services for any commercial purpose without authorization</li>
                <li>Create content that promotes violence, hate speech, or illegal activities</li>
              </ul>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Intellectual Property Rights</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Content</h3>
                  <p className="text-gray-600">
                    The Services and their entire contents, features, and functionality (including but not limited to all 
                    information, software, text, displays, images, video, and audio, and the design, selection, and arrangement 
                    thereof) are owned by PromptValar, its licensors, or other providers of such material and are protected by 
                    copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Content</h3>
                  <p className="text-gray-600 mb-2">
                    You retain ownership of the prompts and content you create using our Services ("User Content"). By using 
                    our Services, you grant us:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>A worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content 
                    for the purpose of providing and improving our Services</li>
                    <li>The right to make User Content available to other users if you choose to publish it in our library</li>
                    <li>The right to use aggregated, anonymized data for analytics and improvement purposes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated Content</h3>
                  <p className="text-gray-600">
                    Content generated by our AI models based on your input is provided to you for your use. However, you 
                    acknowledge that similar or identical content may be generated for other users with similar inputs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Subscription and Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscription and Payment Terms</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Subscription Plans</h3>
                  <p className="text-gray-600">
                    We offer both free and paid subscription plans. Paid subscriptions are billed on a recurring basis 
                    (monthly or annually) and will automatically renew unless you cancel before the renewal date.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Processing</h3>
                  <p className="text-gray-600 mb-2">
                    Payments are processed securely through Stripe. By providing payment information, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>You are authorized to use the payment method provided</li>
                    <li>All payment information is accurate and current</li>
                    <li>You will maintain sufficient funds or credit to complete payments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Changes</h3>
                  <p className="text-gray-600">
                    We reserve the right to change our pricing at any time. Price changes will not affect your current 
                    subscription period but will apply upon renewal. We will provide at least 30 days' notice of any price changes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancellation</h3>
                  <p className="text-gray-600">
                    You may cancel your subscription at any time through your account settings. Cancellations will take 
                    effect at the end of the current billing period. No refunds will be provided for partial subscription periods.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Prohibited Uses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">Prohibited Uses</h2>
              </div>
              
              <p className="text-gray-600 mb-4">In addition to the Acceptable Use Policy, you specifically agree not to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Use our Services to generate content for illegal purposes</li>
                <li>Create prompts that instruct AI models to produce harmful content</li>
                <li>Circumvent usage limits or restrictions on your account</li>
                <li>Reverse engineer or attempt to extract source code from our Services</li>
                <li>Resell or redistribute access to our Services without authorization</li>
                <li>Use our Services to compete with us or create a similar service</li>
              </ul>
            </motion.div>

            {/* Disclaimers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Disclaimers and Limitations of Liability</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Warranties</h3>
                  <p className="text-gray-600">
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                    INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR 
                    NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES 
                    OR OTHER HARMFUL COMPONENTS.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated Content Disclaimer</h3>
                  <p className="text-gray-600">
                    AI-generated content is provided for informational purposes only. We make no guarantees about the accuracy, 
                    completeness, or suitability of AI-generated content. You are solely responsible for reviewing and verifying 
                    all AI-generated content before use.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                  <p className="text-gray-600 mb-2">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PROMPTVALAR, ITS AFFILIATES, DIRECTORS, EMPLOYEES, 
                    OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT 
                    NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF 
                    THE SERVICES.
                  </p>
                  <p className="text-gray-600">
                    OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICES SHALL NOT EXCEED THE AMOUNT 
                    YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Indemnification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-600">
                You agree to indemnify, defend, and hold harmless PromptValar and its affiliates, officers, directors, employees, 
                and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's 
                fees, arising out of or in any way connected with:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>Your access to or use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights, including intellectual property rights</li>
                <li>Your User Content</li>
              </ul>
            </motion.div>

            {/* Dispute Resolution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Informal Resolution</h3>
                  <p className="text-gray-600">
                    If you have any dispute with us, you agree to first contact us at legal@promptvalar.com and attempt to 
                    resolve the dispute informally for at least 30 days before initiating any formal proceedings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Arbitration</h3>
                  <p className="text-gray-600">
                    If we cannot resolve the dispute informally, any dispute arising out of or relating to these Terms or 
                    the Services will be resolved through binding arbitration in accordance with the rules of the American 
                    Arbitration Association, rather than in court, except that you may assert claims in small claims court 
                    if your claims qualify.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Class Action Waiver</h3>
                  <p className="text-gray-600">
                    YOU AGREE THAT ANY ARBITRATION OR PROCEEDING SHALL BE LIMITED TO THE DISPUTE BETWEEN US AND YOU INDIVIDUALLY. 
                    TO THE FULL EXTENT PERMITTED BY LAW, NO ARBITRATION OR PROCEEDING SHALL BE JOINED WITH ANY OTHER, NO DISPUTE 
                    SHALL BE ARBITRATED ON A CLASS-ACTION BASIS, AND THERE IS NO RIGHT OR AUTHORITY FOR ANY DISPUTE TO BE BROUGHT 
                    IN A PURPORTED REPRESENTATIVE CAPACITY.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, 
                without regard to its conflict of law provisions.
              </p>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting 
                the new Terms on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-600">
                Your continued use of the Services after any changes indicates your acceptance of the new Terms. If you do not 
                agree to the new Terms, you must stop using the Services.
              </p>
            </motion.div>

            {/* Severability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Severability and Waiver</h2>
              <p className="text-gray-600 mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the 
                remaining provisions shall remain in full force and effect.
              </p>
              <p className="text-gray-600">
                No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.
              </p>
            </motion.div>

            {/* Entire Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
              <p className="text-gray-600">
                These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire 
                agreement between you and PromptValar regarding the Services and supersede all prior agreements and understandings.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Email:</strong> legal@promptvalar.com</li>
                <li><strong>Support:</strong> support@promptvalar.com</li>
                <li><strong>Website:</strong> https://promptvalar.com</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

