import { motion } from 'framer-motion';
import { BookOpen, Rocket, Settings, Code, Zap, Shield, HelpCircle, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

/**
 * Documentation Page
 * Comprehensive guides and documentation for using PromptValar
 */
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900">
      <SEO 
        title="Documentation - PromptValar"
        description="Learn how to use PromptValar with our comprehensive documentation, tutorials, and API reference."
        url="https://promptvalar.com/docs"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-blue-100">
              Everything you need to know about using PromptValar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Navigation</h3>
                  <nav className="space-y-2">
                    <a href="#getting-started" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      Getting Started
                    </a>
                    <a href="#prompt-studio" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      Prompt Studio
                    </a>
                    <a href="#ai-models" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      AI Models
                    </a>
                    <a href="#prompt-library" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      Prompt Library
                    </a>
                    <a href="#account-settings" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      Account Settings
                    </a>
                    <a href="#subscription" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      Subscription & Billing
                    </a>
                    <a href="#faq" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors">
                      FAQ
                    </a>
                  </nav>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link to="/guides" className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                      View Guides
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-12"
              >

                {/* Getting Started */}
                <section id="getting-started" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Getting Started</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Welcome to PromptValar!</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        PromptValar is an AI prompt engineering platform that helps you create professional prompts for 
                        various AI models including Sora, Veo, Midjourney, and more. Whether you're a content creator, 
                        designer, or AI enthusiast, our tools make it easy to generate high-quality AI outputs.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Step 1: Create Your Account</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Start by <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">creating a free account</Link>. 
                        You'll get access to:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>20 AI generations per month</li>
                        <li>Access to the Prompt Library</li>
                        <li>Save and manage your prompts</li>
                        <li>Basic AI models</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Step 2: Create Your First Prompt</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Head to the <Link to="/studio" className="text-blue-600 dark:text-blue-400 hover:underline">Prompt Studio</Link> and:
                      </p>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>Describe what you want to create in natural language</li>
                        <li>Click "Generate Prompt" to get an AI-optimized version</li>
                        <li>Use the structured editor to fine-tune details</li>
                        <li>Copy your prompt and use it with your favorite AI tool</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Step 3: Explore the Library</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Browse our <Link to="/library" className="text-blue-600 dark:text-blue-400 hover:underline">Prompt Library</Link> for 
                        inspiration. You can filter by model, style, and category to find prompts that match your needs.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Prompt Studio */}
                <section id="prompt-studio" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Prompt Studio</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">How It Works</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Prompt Studio is our flagship feature that transforms your ideas into professional AI prompts 
                        using advanced language models.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">The Three-Step Process</h4>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">1. Input Your Idea</h5>
                          <p className="text-gray-600 dark:text-gray-300">
                            Describe what you want to create in plain English. For example: "A futuristic cityscape at sunset 
                            with flying cars and neon lights"
                          </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">2. AI Generation</h5>
                          <p className="text-gray-600 dark:text-gray-300">
                            Our AI analyzes your input and generates an optimized prompt with proper structure, keywords, 
                            and technical parameters suited for your chosen AI model.
                          </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">3. Fine-tune & Export</h5>
                          <p className="text-gray-600 dark:text-gray-300">
                            Use the structured editor to adjust subjects, styles, lighting, camera angles, and more. 
                            Then copy your final prompt with one click.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Structured Editor Components</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Subject</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">The main focus of your prompt</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Style</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Artistic style and aesthetic</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Lighting</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Lighting conditions and mood</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Camera</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Camera angle and perspective</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Environment</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Setting and background details</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/30">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Technical</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Quality, resolution, and format</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* AI Models */}
                <section id="ai-models" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Supported AI Models</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      PromptValar optimizes prompts for various AI models, each with unique strengths and characteristics.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6 border border-transparent dark:border-blue-500/30 dark:bg-gray-700/50">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">🎬 Sora (OpenAI)</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          Revolutionary text-to-video model capable of generating high-quality videos up to one minute long.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong className="dark:text-gray-300">Best for:</strong> Cinematic videos, realistic motion, complex scenes
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6 border border-transparent dark:border-purple-500/30 dark:bg-gray-700/50">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">🎥 Veo (Google)</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          Google's advanced video generation model with excellent understanding of physics and motion.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong className="dark:text-gray-300">Best for:</strong> Realistic videos, natural movement, product demonstrations
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6 border border-transparent dark:border-green-500/30 dark:bg-gray-700/50">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">🎨 Midjourney</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          Industry-leading image generation model known for artistic, high-quality outputs.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong className="dark:text-gray-300">Best for:</strong> Artistic images, concept art, detailed illustrations
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6 border border-transparent dark:border-orange-500/30 dark:bg-gray-700/50">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">🖼️ DALL-E 3</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          OpenAI's image generation model with excellent text rendering and instruction following.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong className="dark:text-gray-300">Best for:</strong> Photorealistic images, text in images, specific compositions
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-6 border border-transparent dark:border-indigo-500/30 dark:bg-gray-700/50">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">⚡ Stable Diffusion</h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          Open-source image generation model with extensive customization options.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong className="dark:text-gray-300">Best for:</strong> Custom styles, fine-tuned models, high volume generation
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Prompt Library */}
                <section id="prompt-library" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Prompt Library</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      Our curated library contains thousands of professionally crafted prompts from our community.
                    </p>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Features</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-3">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">Search & Filter:</strong>
                            <span className="text-gray-600 dark:text-gray-300"> Find prompts by keywords, model type, style, or category</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-3">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">Favorites:</strong>
                            <span className="text-gray-600 dark:text-gray-300"> Save prompts to your personal collection for quick access</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-3">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">One-Click Copy:</strong>
                            <span className="text-gray-600 dark:text-gray-300"> Instantly copy any prompt to your clipboard</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-3">•</span>
                          <div>
                            <strong className="text-gray-900 dark:text-gray-100">Community Ratings:</strong>
                            <span className="text-gray-600 dark:text-gray-300"> See which prompts produce the best results</span>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Publishing Your Prompts</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Share your best prompts with the community:
                      </p>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>Create or edit a prompt in Prompt Studio</li>
                        <li>Click "Publish to Library"</li>
                        <li>Add tags and a description</li>
                        <li>Your prompt becomes available to the community</li>
                      </ol>
                    </div>
                  </div>
                </section>

                {/* Account Settings */}
                <section id="account-settings" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Profile Management</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">Manage your account information:</p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>Update your email address</li>
                        <li>Change your password</li>
                        <li>Set your display name</li>
                        <li>Configure notification preferences</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Privacy & Security</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">Control your data and security:</p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>Two-factor authentication (2FA)</li>
                        <li>Active session management</li>
                        <li>Data export and deletion</li>
                        <li>Privacy settings for published prompts</li>
                      </ul>
                    </div>

                  </div>
                </section>

                {/* Subscription */}
                <section id="subscription" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Subscription & Billing</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Plans Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Free Plan</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• 20 AI generations/month</li>
                            <li>• Basic AI models</li>
                            <li>• Access to library</li>
                            <li>• Save up to 50 prompts</li>
                          </ul>
                        </div>
                        <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/30">
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Pro Plan</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li>• Unlimited AI generations</li>
                            <li>• Advanced AI models</li>
                            <li>• Premium library access</li>
                            <li>• Unlimited prompt storage</li>
                            <li>• Priority support</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link to="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                          View detailed pricing →
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Managing Your Subscription</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">From your subscription management page, you can:</p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        <li>Upgrade or downgrade your plan</li>
                        <li>Update payment method</li>
                        <li>View billing history</li>
                        <li>Download invoices</li>
                        <li>Cancel subscription</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Cancellation Policy</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        You can cancel your subscription at any time. You'll continue to have Pro access until the end 
                        of your billing period. See our <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Refund Policy</Link> for 
                        more details.
                      </p>
                    </div>
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        How accurate are the AI-generated prompts?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our AI is trained on thousands of successful prompts and optimized for each specific AI model. 
                        However, you can always fine-tune the results using our structured editor.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Can I use the generated prompts commercially?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Yes! All prompts you create with PromptValar are yours to use for any purpose, including 
                        commercial projects.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        What happens if I run out of AI generations?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Free plan users receive 20 generations per month. Once exhausted, you can either wait for 
                        the monthly reset or upgrade to Pro for unlimited generations.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Do you store the AI outputs I generate?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        We only store the prompts you create, not the actual AI-generated images or videos. Your 
                        prompts are private unless you choose to publish them to the library.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Can I cancel my Pro subscription anytime?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Yes, you can cancel at any time. You'll retain Pro access until the end of your current 
                        billing period. See our <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Refund Policy</Link> for details.
                      </p>
                    </div>
                  </div>
                </section>

              </motion.div>
            </div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-xl mb-6">
                Our support team is here to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@promptvalar.com" 
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Email Support
                </a>
                <Link 
                  to="/guides" 
                  className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-lg font-semibold hover:bg-white/20 dark:hover:bg-white/30 transition-colors border border-white/20"
                >
                  View Guides
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

