import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Eye, Copy, Check } from 'lucide-react';
import { Prompt, AIModel, PromptStyle } from '../types/prompt';

// 临时模拟数据（后续将从API获取）
const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Cyberpunk City at Night',
    description: 'A cinematic view of a futuristic cityscape with neon lights',
    promptText:
      'A cinematic wide shot of a futuristic cyberpunk city at night, neon signs reflecting on wet streets, flying cars in the distance, dramatic lighting with purple and blue tones, highly detailed, 8k resolution',
    model: 'sora',
    category: 'video',
    style: 'cyberpunk',
    tags: ['cityscape', 'futuristic', 'neon', 'night'],
    previewImageUrl: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800',
    authorId: 'user1',
    isPremium: false,
    isPublished: true,
    viewsCount: 1234,
    favoritesCount: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Fantasy Dragon Portrait',
    description: 'Majestic dragon in a mystical forest setting',
    promptText:
      'A close-up portrait of a majestic dragon with iridescent scales, surrounded by mystical glowing forest, golden hour lighting, fantasy art style, intricate details, ethereal atmosphere',
    model: 'midjourney',
    category: 'image',
    style: 'fantasy',
    tags: ['dragon', 'fantasy', 'portrait', 'mystical'],
    previewImageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800',
    authorId: 'user2',
    isPremium: true,
    isPublished: true,
    viewsCount: 2456,
    favoritesCount: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // 可以添加更多模拟数据
];

const PromptLibraryPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 过滤prompts
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModel = selectedModel === 'all' || prompt.model === selectedModel;
    const matchesStyle = selectedStyle === 'all' || prompt.style === selectedStyle;

    return matchesSearch && matchesModel && matchesStyle;
  });

  // 复制提示词
  const handleCopy = async (promptText: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Prompt Library</h1>
          <p className="text-xl text-purple-200">
            Discover and use thousands of professional AI prompts
          </p>
        </motion.div>

        {/* 搜索和过滤 */}
        <div className="mb-8 space-y-4">
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by title, description, or tags..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* 过滤器 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModel | 'all')}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all" className="bg-slate-800">
                  All Models
                </option>
                <option value="sora" className="bg-slate-800">
                  Sora
                </option>
                <option value="veo" className="bg-slate-800">
                  Veo
                </option>
                <option value="midjourney" className="bg-slate-800">
                  Midjourney
                </option>
                <option value="stable_diffusion" className="bg-slate-800">
                  Stable Diffusion
                </option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as PromptStyle | 'all')}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all" className="bg-slate-800">
                  All Styles
                </option>
                <option value="cinematic" className="bg-slate-800">
                  Cinematic
                </option>
                <option value="photorealistic" className="bg-slate-800">
                  Photorealistic
                </option>
                <option value="anime" className="bg-slate-800">
                  Anime
                </option>
                <option value="cyberpunk" className="bg-slate-800">
                  Cyberpunk
                </option>
                <option value="fantasy" className="bg-slate-800">
                  Fantasy
                </option>
              </select>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="text-purple-200">
            Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Prompts 网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all duration-300 group"
            >
              {/* 预览图 */}
              <div className="relative h-48 overflow-hidden bg-slate-800">
                {prompt.previewImageUrl ? (
                  <img
                    src={prompt.previewImageUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-300">
                    No Preview
                  </div>
                )}
                {prompt.isPremium && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    PRO
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{prompt.title}</h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{prompt.description}</p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 统计和操作 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {prompt.viewsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {prompt.favoritesCount}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(prompt.promptText, prompt.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* 模型标签 */}
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <span className="text-xs font-medium text-purple-300 uppercase">
                    {prompt.model}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 无结果提示 */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-purple-200">No prompts found matching your filters.</p>
            <p className="text-purple-300 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptLibraryPage;

