import { motion } from 'framer-motion';
import { Target, Heart, Users, Zap, Shield, Globe, TrendingUp, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

/**
 * About Page
 * Information about PromptValar's mission, vision, and team
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900">
      <SEO 
        title="About Us - PromptValar"
        description="Learn about PromptValar's mission to democratize AI prompt engineering and make professional AI tools accessible to everyone."
        url="https://promptvalar.com/about"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-6xl font-bold mb-6">About PromptValar</h1>
            <p className="text-2xl text-purple-100 leading-relaxed">
              Empowering creators worldwide with professional AI prompt engineering tools
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Target className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-200 leading-relaxed mb-6">
                At PromptValar, we believe that everyone should have access to powerful AI tools, regardless of their 
                technical background. Our mission is to democratize AI prompt engineering by providing an intuitive, 
                professional-grade platform that transforms natural language into optimized prompts for cutting-edge 
                AI models.
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-200 leading-relaxed">
                We're building the future where creators, designers, marketers, and dreamers can harness the full 
                potential of AI to bring their visions to life—without needing to become prompt engineering experts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Story</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6 text-gray-600 dark:text-gray-200 leading-relaxed">
                <p className="text-lg">
                  PromptValar was born from a simple observation: while AI technology was advancing at an incredible pace, 
                  the barrier to effectively using these tools remained frustratingly high. Content creators, designers, 
                  and professionals spent hours learning prompt engineering techniques, experimenting with different 
                  formats, and trying to understand the nuances of various AI models.
                </p>
                <p className="text-lg">
                  We saw an opportunity to change this. In 2024, our founding team—a group of AI researchers, UX designers, 
                  and creative professionals—came together with a shared vision: to build a platform that makes professional 
                  prompt engineering as easy as having a conversation.
                </p>
                <p className="text-lg">
                  Today, PromptValar serves thousands of users worldwide, from independent creators to enterprise teams, 
                  helping them generate better AI outputs in less time. But we're just getting started. Our roadmap includes 
                  exciting features like collaborative workspaces, advanced analytics, custom model fine-tuning, and much more.
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Join us on this journey to make AI accessible, powerful, and delightful for everyone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              
              {/* Value 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">User-First</h3>
                <p className="text-gray-600 dark:text-gray-200">
                  Every feature we build starts with understanding our users' needs and challenges. Your success is our success.
                </p>
              </motion.div>

              {/* Value 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-200">
                  We continuously push boundaries, exploring new AI models and techniques to give you the best tools available.
                </p>
              </motion.div>

              {/* Value 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Trust</h3>
                <p className="text-gray-600 dark:text-gray-200">
                  Your data security and privacy are paramount. We're transparent about how we handle your information.
                </p>
              </motion.div>

              {/* Value 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-200">
                  Professional AI tools should be available to everyone, from hobbyists to enterprises, worldwide.
                </p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-3">AI-Powered Generation</h3>
                <p className="text-gray-200 mb-4">
                  Transform your ideas into professional prompts using advanced AI models including Claude 3.5 Sonnet, 
                  optimized for Sora, Veo, Midjourney, and more.
                </p>
                <Link to="/studio" className="text-purple-300 hover:text-purple-200 font-semibold">
                  Try Prompt Studio →
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-3">Curated Library</h3>
                <p className="text-gray-200 mb-4">
                  Access thousands of professionally crafted prompts from our community. Filter by model, style, and category 
                  to find exactly what you need.
                </p>
                <Link to="/library" className="text-purple-300 hover:text-purple-200 font-semibold">
                  Browse Library →
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-3">Structured Editor</h3>
                <p className="text-gray-200 mb-4">
                  Fine-tune every aspect of your prompts with our intuitive component-based editor. Perfect control over 
                  subjects, styles, camera angles, and more.
                </p>
                <Link to="/docs" className="text-purple-300 hover:text-purple-200 font-semibold">
                  Learn More →
                </Link>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">PromptValar by Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10K+</div>
                <div className="text-xl text-gray-600 dark:text-gray-200">Active Users</div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">50K+</div>
                <div className="text-xl text-gray-600 dark:text-gray-200">Prompts Generated</div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">15+</div>
                <div className="text-xl text-gray-600 dark:text-gray-200">AI Models Supported</div>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">98%</div>
                <div className="text-xl text-gray-600 dark:text-gray-200">User Satisfaction</div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-200 text-center mb-12 max-w-3xl mx-auto">
              We're a passionate team of AI researchers, engineers, designers, and creators dedicated to making 
              AI accessible to everyone.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">AI</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Research Team</h3>
                  <p className="text-gray-600 dark:text-gray-200">
                    Experts in machine learning and natural language processing, constantly exploring new AI models 
                    and optimization techniques.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">UX</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Design Team</h3>
                  <p className="text-gray-600 dark:text-gray-200">
                    Designers obsessed with creating beautiful, intuitive interfaces that make complex technology 
                    feel simple and delightful.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">DEV</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Engineering Team</h3>
                  <p className="text-gray-600 dark:text-gray-200">
                    Full-stack engineers building robust, scalable systems that power millions of AI generations 
                    with reliability and speed.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">CS</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Customer Success</h3>
                  <p className="text-gray-600 dark:text-gray-200">
                    Dedicated support specialists who ensure every user gets the most out of PromptValar and achieves 
                    their creative goals.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision for the Future */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
              <div className="flex items-center gap-4 mb-6">
                <TrendingUp className="w-10 h-10" />
                <h2 className="text-4xl font-bold">Our Vision for the Future</h2>
              </div>
              <div className="space-y-4 text-lg">
                <p>
                  We envision a world where AI is not just a tool for tech experts, but a collaborative partner 
                  accessible to everyone with a creative vision.
                </p>
                <p>
                  In the coming years, we plan to expand PromptValar with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Real-time collaboration features for teams</li>
                  <li>Custom AI model fine-tuning for enterprise users</li>
                  <li>Advanced analytics and A/B testing for prompts</li>
                  <li>Multi-language support to serve creators worldwide</li>
                  <li>Integration with popular creative tools and workflows</li>
                  <li>Educational resources and certification programs</li>
                </ul>
                <p className="font-semibold pt-4">
                  Together, we're not just using AI—we're shaping how humanity collaborates with artificial intelligence 
                  to create, innovate, and inspire.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-gray-200 mb-8">
              Whether you're a creative professional, a hobbyist, or just curious about AI, 
              there's a place for you at PromptValar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link 
                to="/pricing" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-lg font-semibold text-lg transition-all duration-200 border border-white/20"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600 dark:text-gray-200 mb-8">
                Have questions, feedback, or just want to say hello? We'd love to hear from you!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">General Inquiries</h3>
                  <a href="mailto:hello@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    hello@promptvalar.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Support</h3>
                  <a href="mailto:support@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    support@promptvalar.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Partnerships</h3>
                  <a href="mailto:partners@promptvalar.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    partners@promptvalar.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

