import { motion } from 'framer-motion';
import { BookOpen, Video, Image, Wand2, Lightbulb, TrendingUp, Award, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

/**
 * Guides Page
 * Tutorials and best practices for using PromptValar
 */
export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900">
      <SEO 
        title="Guides & Tutorials - PromptValar"
        description="Learn prompt engineering techniques, best practices, and tips for creating amazing AI-generated content with PromptValar."
        url="https://promptvalar.com/guides"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Lightbulb className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Guides & Tutorials</h1>
            <p className="text-xl text-teal-100">
              Master the art of AI prompt engineering with our comprehensive guides
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              <a href="#video-prompts" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                <Video className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Video Prompts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sora & Veo guides</p>
              </a>
              
              <a href="#image-prompts" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                <Image className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Image Prompts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Midjourney & DALL-E</p>
              </a>
              
              <a href="#best-practices" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                <Award className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Best Practices</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pro tips & tricks</p>
              </a>
              
              <a href="#examples" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                <Wand2 className="w-10 h-10 text-orange-600 dark:text-orange-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Examples</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Real-world use cases</p>
              </a>
            </motion.div>

            {/* Getting Started */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Getting Started with Prompt Engineering</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">What is Prompt Engineering?</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Prompt engineering is the art and science of crafting effective instructions for AI models to 
                    generate desired outputs. A well-crafted prompt can mean the difference between mediocre results 
                    and stunning, professional-quality content.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    With PromptValar, you don't need to be an expert—our AI helps you create optimized prompts 
                    automatically. But understanding the fundamentals will help you get even better results.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">The Anatomy of a Great Prompt</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Subject</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">The main focus of your creation</p>
                      <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
                        Example: "A majestic lion", "A futuristic cityscape", "A cozy coffee shop"
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Style & Aesthetics</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">The artistic direction and visual style</p>
                      <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
                        Example: "Cinematic", "Photorealistic", "Anime style", "Watercolor painting"
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Details & Context</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">Specific attributes and environmental context</p>
                      <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
                        Example: "Golden hour lighting", "Surrounded by cherry blossoms", "Urban setting"
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Technical Parameters</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">Quality and format specifications</p>
                      <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
                        Example: "4K resolution", "Wide angle", "Shallow depth of field"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Video Prompts */}
            <motion.div
              id="video-prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Creating Video Prompts (Sora & Veo)</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Video-Specific Considerations</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Video generation requires additional attention to motion, pacing, and temporal coherence. Here are 
                    key elements to consider:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Camera Movement:</strong>
                        <span className="text-gray-600 dark:text-gray-300"> Specify how the camera should move (pan, zoom, dolly, tracking shot)</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Action & Motion:</strong>
                        <span className="text-gray-600 dark:text-gray-300"> Describe what's happening and how subjects move</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Pacing:</strong>
                        <span className="text-gray-600 dark:text-gray-300"> Indicate the speed (slow motion, real-time, time-lapse)</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-3">•</span>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Transitions:</strong>
                        <span className="text-gray-600 dark:text-gray-300"> If applicable, describe scene transitions</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Example Video Prompts</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cinematic Drone Shot</h4>
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">Sora</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Aerial drone shot flying over a misty mountain range at sunrise, camera slowly ascending and 
                        rotating 360 degrees, revealing valleys filled with fog, golden hour lighting, cinematic color 
                        grading, 4K resolution, smooth camera movement"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Specific camera movement, lighting condition, quality parameters
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Showcase</h4>
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">Veo</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Close-up product video of a luxury watch on a rotating pedestal, camera slowly orbiting the 
                        watch, dramatic lighting highlighting the metallic surface and crystal details, black studio 
                        background, shallow depth of field, professional commercial style"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Product focus, rotation, lighting, professional quality
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nature Scene</h4>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">Sora</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Time-lapse of cherry blossom trees in full bloom, petals gently falling in the wind, camera 
                        static wide shot, blue sky background with fluffy white clouds moving across the frame, spring 
                        afternoon, vibrant colors, peaceful atmosphere"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Time-lapse effect, natural motion, atmospheric details
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Pro Tips for Video Prompts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✓ Do:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Be specific about camera movement</li>
                        <li>• Describe action and motion clearly</li>
                        <li>• Include lighting and atmosphere</li>
                        <li>• Specify duration if important</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✗ Avoid:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Overly complex multi-scene descriptions</li>
                        <li>• Physically impossible movements</li>
                        <li>• Too many simultaneous actions</li>
                        <li>• Vague or ambiguous instructions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image Prompts */}
            <motion.div
              id="image-prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Creating Image Prompts (Midjourney & DALL-E)</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Image-Specific Techniques</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Image generation benefits from detailed descriptions of composition, style, and visual elements:
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Example Image Prompts</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fantasy Character</h4>
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">Midjourney</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Portrait of a mystical elven warrior with silver hair and glowing blue eyes, wearing ornate 
                        armor with intricate Celtic patterns, forest background with magical floating lights, 
                        dramatic side lighting, fantasy art style, highly detailed, 8k, concept art"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Character details, clothing, environment, lighting, style tags
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Architectural Visualization</h4>
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">DALL-E 3</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Modern minimalist house with floor-to-ceiling windows, situated on a cliff overlooking the 
                        ocean, sunset lighting casting warm orange glow, contemporary architecture, clean lines, 
                        surrounded by native vegetation, photorealistic, architectural photography style"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Architectural style, location, lighting, photographic quality
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Abstract Art</h4>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">Midjourney</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300 font-mono text-sm mb-3">
                        "Abstract geometric composition with flowing liquid metal shapes, vibrant gradient colors 
                        transitioning from deep purple to electric blue to golden yellow, smooth reflective surfaces, 
                        floating in a dark void, modern digital art, high contrast, 3D render style"
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Key elements:</strong> Abstract concepts, color palette, material properties, style
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Style Modifiers & Keywords</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-purple-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Artistic Styles</h5>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Oil painting</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Watercolor</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Anime</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Concept art</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Impressionist</span>
                      </div>
                    </div>

                    <div className="border-2 border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quality Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Highly detailed</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">8K resolution</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Photorealistic</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Sharp focus</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Professional</span>
                      </div>
                    </div>

                    <div className="border-2 border-green-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Lighting</h5>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Golden hour</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Dramatic</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Soft lighting</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Backlit</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Studio lighting</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Best Practices */}
            <motion.div
              id="best-practices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-10 h-10 text-green-600 dark:text-green-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Best Practices & Pro Tips</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Universal Prompt Principles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
                      <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Be Specific</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        The more specific your description, the better the AI can understand your vision.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <p className="text-red-600 dark:text-red-400 mb-1">❌ "A cat"</p>
                          <p className="text-green-600 dark:text-green-400">✓ "A fluffy Persian cat with blue eyes sitting on a velvet cushion"</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                      <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Use Descriptive Language</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Rich, vivid descriptions help AI models create more nuanced outputs.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <p className="text-red-600 dark:text-red-400 mb-1">❌ "Nice lighting"</p>
                          <p className="text-green-600 dark:text-green-400">✓ "Warm golden hour sunlight filtering through trees"</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
                      <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Matters</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Place the most important elements at the beginning of your prompt.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <p className="text-green-600 dark:text-green-400">✓ Start with the main subject, then add details</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-6">
                      <Award className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Iterate & Refine</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Don't expect perfection on the first try. Refine your prompts based on results.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="bg-white dark:bg-gray-800 rounded p-3">
                          <p className="text-gray-700 dark:text-gray-300">Test different variations and learn what works best</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Common Mistakes to Avoid</h3>
                  <div className="space-y-4">
                    <div className="flex items-start bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                      <span className="text-red-600 dark:text-red-400 text-2xl mr-3">×</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Being Too Vague</h5>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          "A nice picture" won't give you good results. Be specific about what you want.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                      <span className="text-red-600 dark:text-red-400 text-2xl mr-3">×</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Overcomplicating</h5>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Too many conflicting elements can confuse the AI. Focus on a clear concept.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                      <span className="text-red-600 dark:text-red-400 text-2xl mr-3">×</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Ignoring Model Strengths</h5>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Each AI model has strengths. Use Sora for videos, Midjourney for artistic images, etc.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                      <span className="text-red-600 dark:text-red-400 text-2xl mr-3">×</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Forgetting Technical Parameters</h5>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Include quality, resolution, and format specifications for best results.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Examples & Use Cases */}
            <motion.div
              id="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Real-World Use Cases</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-400 transition-colors">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Marketing & Advertising</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Create stunning product visuals, social media content, and ad campaigns without expensive photoshoots.
                  </p>
                  <Link to="/library?category=marketing" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                    View Marketing Examples →
                  </Link>
                </div>

                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-400 transition-colors">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Content Creation</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Generate unique images and videos for blogs, YouTube thumbnails, and social media posts.
                  </p>
                  <Link to="/library?category=content" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold">
                    View Content Examples →
                  </Link>
                </div>

                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-green-400 transition-colors">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Game Development</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Create concept art, character designs, environment concepts, and promotional materials.
                  </p>
                  <Link to="/library?category=gaming" className="text-green-600 dark:text-green-400 hover:underline text-sm font-semibold">
                    View Gaming Examples →
                  </Link>
                </div>

                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-orange-400 transition-colors">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Education & Training</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Generate educational illustrations, explainer video content, and training materials.
                  </p>
                  <Link to="/library?category=education" className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-semibold">
                    View Education Examples →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-2xl p-8 md:p-12 text-center"
            >
              <h3 className="text-3xl font-bold mb-4">Ready to Create Amazing Prompts?</h3>
              <p className="text-xl mb-8 text-teal-100">
                Put these techniques into practice with PromptValar's AI-powered tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/studio" 
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Try Prompt Studio
                </Link>
                <Link 
                  to="/docs" 
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Read Documentation
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

