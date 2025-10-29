import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, Eye, Copy, Check, Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import { Prompt, AIModel, PromptStyle } from '../types/prompt';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const PromptLibraryPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'viewsCount' | 'favoritesCount' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 从API获取提示词列表
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '50');
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        
        if (selectedModel !== 'all') {
          params.append('model', selectedModel);
        }
        if (selectedStyle !== 'all') {
          params.append('style', selectedStyle);
        }
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(`${API_BASE_URL}/prompts?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('获取提示词列表失败');
        }

        const data = await response.json();
        setPrompts(data.data?.prompts || []);
      } catch (err: any) {
        setError(err.message || '加载失败');
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    // 延迟搜索以减少API调用
    const timeoutId = setTimeout(() => {
      fetchPrompts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedModel, selectedStyle, selectedCategory, searchQuery, sortBy, sortOrder]);

  // 使用从API获取的数据（已经过滤）
  const filteredPrompts = Array.isArray(prompts) ? prompts : [];

  // 复制提示词
  const handleCopy = async (promptText: string, promptId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 跳转到详情页
  const handleCardClick = (promptId: string) => {
    navigate(`/library/${promptId}`);
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
          {/* 搜索栏和工具栏 */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts by title, description, or tags..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            
            {/* 工具栏 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  showAdvancedFilters
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-300 hover:bg-white/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex bg-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/20'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/20'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 基础过滤器 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModel | 'all')}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all" className="bg-slate-800">All Models</option>
                <option value="sora" className="bg-slate-800">Sora</option>
                <option value="veo" className="bg-slate-800">Veo</option>
                <option value="midjourney" className="bg-slate-800">Midjourney</option>
                <option value="stable_diffusion" className="bg-slate-800">Stable Diffusion</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as PromptStyle | 'all')}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all" className="bg-slate-800">All Styles</option>
                <option value="cinematic" className="bg-slate-800">Cinematic</option>
                <option value="photorealistic" className="bg-slate-800">Photorealistic</option>
                <option value="anime" className="bg-slate-800">Anime</option>
                <option value="cyberpunk" className="bg-slate-800">Cyberpunk</option>
                <option value="fantasy" className="bg-slate-800">Fantasy</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                <option value="video" className="bg-slate-800">Video</option>
                <option value="image" className="bg-slate-800">Image</option>
                <option value="creative" className="bg-slate-800">Creative</option>
                <option value="commercial" className="bg-slate-800">Commercial</option>
              </select>
            </div>
          </div>

          {/* 高级过滤器 */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-purple-200 text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="createdAt" className="bg-slate-800">Date Created</option>
                    <option value="updatedAt" className="bg-slate-800">Last Updated</option>
                    <option value="viewsCount" className="bg-slate-800">Most Viewed</option>
                    <option value="favoritesCount" className="bg-slate-800">Most Favorited</option>
                    <option value="title" className="bg-slate-800">Title A-Z</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-purple-200 text-sm font-medium mb-2">Order</label>
                  <div className="flex bg-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-4 py-3 transition-colors flex items-center justify-center gap-2 ${
                        sortOrder === 'desc' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/20'
                      }`}
                    >
                      <SortDesc className="w-4 h-4" />
                      Desc
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-4 py-3 transition-colors flex items-center justify-center gap-2 ${
                        sortOrder === 'asc' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/20'
                      }`}
                    >
                      <SortAsc className="w-4 h-4" />
                      Asc
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 结果统计 */}
          <div className="flex justify-between items-center text-purple-200">
            <span>
              Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-purple-300">
              {viewMode === 'grid' ? 'Grid View' : 'List View'}
            </span>
          </div>
        </div>

        {/* 加载和错误状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-purple-200 mt-4">Loading...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              重试
            </button>
          </div>
        )}

        {/* Prompts 网格 */}
        {!loading && !error && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCardClick(prompt.id)}
                className={`bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all duration-300 group cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* 预览图 */}
                <div className={`relative overflow-hidden bg-slate-800 ${
                  viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'
                }`}>
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
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{prompt.title}</h3>
                  <p className={`text-purple-200 text-sm mb-4 ${
                    viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'
                  }`}>
                    {prompt.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.slice(0, viewMode === 'list' ? 5 : 3).map((tag) => (
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
                      onClick={(e) => handleCopy(prompt.promptText, prompt.id, e)}
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
        )}

        {/* 无结果提示 */}
        {!loading && !error && filteredPrompts.length === 0 && (
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

