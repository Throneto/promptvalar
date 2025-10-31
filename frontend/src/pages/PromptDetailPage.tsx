import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Copy,
  Check,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  Share2,
  Edit,
  Loader2,
} from 'lucide-react';
import SEO from '../components/SEO';
import { generateArticleSchema, generateWebPageSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { getPromptById, toggleFavorite, getPrompts } from '../services/prompt.service';
import { getCurrentUser, isAuthenticated } from '../services/auth.service';

const PromptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [relatedPrompts, setRelatedPrompts] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  }, []);

  // 获取提示词详情
  useEffect(() => {
    const fetchPromptDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getPromptById(id);
        
        if (response.success && response.data) {
          setPrompt(response.data);
          setIsFavorited(response.data.isFavorited || false);
          
          // 检查是否是作者本人
          if (currentUser && response.data.author) {
            setIsOwner(currentUser.id === response.data.author.id);
          }
          
          // 获取相关提示词
          fetchRelatedPrompts(response.data);
        }
      } catch (err: any) {
        console.error('Failed to load prompt:', err);
        setError('加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptDetail();
  }, [id, currentUser]);

  // 复制提示词
  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    if (!prompt || !id) return;
    
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/library/${id}` } });
      return;
    }

    try {
      const response = await toggleFavorite(id);
      
      if (response.success) {
        const newFavoritedState = response.data.isFavorited;
        setIsFavorited(newFavoritedState);

        // 更新收藏数量
        setPrompt((prev: any) =>
          prev
            ? {
                ...prev,
                favoriteCount: newFavoritedState
                  ? prev.favoriteCount + 1
                  : prev.favoriteCount - 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error('收藏失败:', err);
      alert('操作失败，请稍后重试');
    }
  };

  // 编辑提示词
  const handleEdit = () => {
    if (id) {
      navigate(`/studio?edit=${id}`);
    }
  };

  // 分享提示词
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板！');
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // 获取相关提示词
  const fetchRelatedPrompts = async (currentPrompt: any) => {
    if (!currentPrompt) return;
    
    try {
      const response = await getPrompts({
        page: 1,
        limit: 6,
        modelType: currentPrompt.model,
        style: currentPrompt.style,
        category: currentPrompt.category,
      });
      
      if (response.success && response.data) {
        // 过滤掉当前提示词
        const related = response.data.prompts.filter((p: any) => p.id !== currentPrompt.id);
        setRelatedPrompts(related.slice(0, 4)); // 只显示4个相关提示词
      }
    } catch (error) {
      console.error('Failed to fetch related prompts:', error);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <SEO 
          title="Prompt Not Found - PromptValar"
          description="The requested prompt could not be found."
          url={`https://promptvalar.com/library/${id}`}
          noindex={true}
        />
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error || 'Prompt not found'}</p>
          <Link
            to="/library"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  // 生成SEO结构化数据
  const promptUrl = `https://promptvalar.com/library/${id}`;
  const promptDescription = prompt.description || `Professional AI prompt for ${prompt.model} - ${prompt.title}`;
  const articleSchema = generateArticleSchema(
    prompt.title,
    promptUrl,
    promptDescription,
    prompt.previewImage,
    prompt.createdAt,
    prompt.updatedAt,
    prompt.author?.username || 'PromptValar Community'
  );
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://promptvalar.com' },
    { name: 'Prompt Library', url: 'https://promptvalar.com/library' },
    { name: prompt.title, url: promptUrl },
  ]);

  const structuredData = {
    '@graph': [articleSchema, breadcrumbSchema]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-300">
      <SEO 
        title={`${prompt.title} - PromptValar Library`}
        description={promptDescription}
        url={promptUrl}
        keywords={`${prompt.title}, ${prompt.model} prompt, AI prompt, ${prompt.style} style, ${prompt.category} category`}
        type="article"
        image={prompt.previewImage || 'https://promptvalar.com/og-image.jpg'}
        publishedTime={prompt.createdAt}
        modifiedTime={prompt.updatedAt}
        author={prompt.author?.username || 'PromptValar Community'}
        structuredData={structuredData}
      />
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮和编辑按钮 */}
        <div className="mb-6 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </motion.button>

          {isOwner && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Edit size={18} />
              <span>编辑</span>
            </motion.button>
          )}
        </div>

        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：预览图和作者信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* 预览图 */}
            {prompt.previewImage ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                <img
                  src={prompt.previewImage}
                  alt={prompt.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg h-64 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {prompt.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* 作者卡片 */}
            {prompt.author && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-purple-600 dark:text-purple-400" />
                  作者信息
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {prompt.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{prompt.author.username}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{prompt.author.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 统计信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <Eye size={18} />
                    浏览量
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-semibold">{prompt.viewCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <Heart size={18} />
                    收藏数
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-semibold">{prompt.favoriteCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    创建时间
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 text-sm">{formatDate(prompt.createdAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：提示词内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* 标题和操作按钮 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{prompt.title}</h1>
                  {prompt.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{prompt.description}</p>
                  )}
                </div>
              </div>

              {/* 标签和元信息 */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {prompt.modelType}
                </span>
                {prompt.style && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    {prompt.style}
                  </span>
                )}
                {prompt.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {prompt.category}
                  </span>
                )}
              </div>

              {/* 标签列表 */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <Tag size={16} className="text-gray-500 dark:text-gray-400" />
                  {prompt.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-gray-600 dark:text-gray-400 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? '已复制！' : '复制提示词'}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
                    isFavorited
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? '已收藏' : '收藏'}
                </button>
                <button 
                  onClick={handleShare}
                  className="px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* 提示词内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4 text-lg">完整提示词</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 相关推荐 */}
          {relatedPrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPrompts.map((relatedPrompt, index) => (
                  <motion.div
                    key={relatedPrompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => navigate(`/library/${relatedPrompt.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    {/* 预览图 */}
                    <div className="relative h-32 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {relatedPrompt.previewImageUrl ? (
                        <img
                          src={relatedPrompt.previewImageUrl}
                          alt={relatedPrompt.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                          No Preview
                        </div>
                      )}
                      {relatedPrompt.isPremium && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          PRO
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                        {relatedPrompt.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {relatedPrompt.description}
                      </p>
                      
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {relatedPrompt.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 统计 */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {relatedPrompt.viewsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {relatedPrompt.favoritesCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;

