import { Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIModel, PromptStyle } from '../../types/prompt';
import PacmanLoader from '../common/PacmanLoader';

interface UsageInfo {
  remaining: number;
  limit: number;
  used: number;
  isPro: boolean;
}

interface IdeaInputProps {
  idea: string;
  onIdeaChange: (value: string) => void;
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  selectedStyle: PromptStyle;
  onStyleChange: (style: PromptStyle) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error?: string;
  usageInfo?: UsageInfo | null;
}

const models: { value: AIModel; label: string; description: string }[] = [
  { value: 'sora', label: 'Sora', description: 'OpenAI video generation' },
  { value: 'veo', label: 'Veo', description: 'Google video generation' },
  { value: 'nano_banana', label: 'Nano Banana', description: 'Fast animation model' },
  { value: 'seedream', label: 'Seedream', description: 'Artistic video generation' },
  { value: 'midjourney', label: 'Midjourney', description: 'Image generation' },
  { value: 'stable_diffusion', label: 'Stable Diffusion', description: 'Open-source image gen' },
];

const styles: { value: PromptStyle; label: string }[] = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'anime', label: 'Anime' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'commercial', label: 'Commercial' },
];

const IdeaInput = ({
  idea,
  onIdeaChange,
  selectedModel,
  onModelChange,
  selectedStyle,
  onStyleChange,
  onGenerate,
  isGenerating,
  error,
  usageInfo,
}: IdeaInputProps) => {
  // 检查是否达到限制
  const isLimitReached = usageInfo && !usageInfo.isPro && usageInfo.remaining <= 0;
  return (
    <div className="space-y-6">
      {/* 文本输入区域 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-purple-200 mb-2">
          Describe your idea
        </label>
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          placeholder="Example: A cat astronaut floating in space, playing with colorful planets..."
          className="w-full h-40 px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-purple-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* 模型和风格选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-purple-200 mb-2">
            AI Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AIModel)}
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-purple-500/30 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            disabled={isGenerating}
          >
            {models.map((model) => (
              <option key={model.value} value={model.value} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                {model.label} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* 风格选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-purple-200 mb-2">
            Style
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => onStyleChange(e.target.value as PromptStyle)}
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-purple-500/30 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            disabled={isGenerating}
          >
            {styles.map((style) => (
              <option key={style.value} value={style.value} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/50 rounded-lg p-4 text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {/* 使用次数信息和限制提示 */}
      {usageInfo && !usageInfo.isPro && (
        <div className={`rounded-lg p-4 border ${
          isLimitReached 
            ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/50'
            : usageInfo.remaining <= 5
            ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/50'
            : 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/50'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${
              isLimitReached 
                ? 'text-orange-600 dark:text-orange-400'
                : usageInfo.remaining <= 5
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-blue-600 dark:text-blue-400'
            }`} />
            <div className="flex-1">
              <p className={`font-medium ${
                isLimitReached 
                  ? 'text-orange-800 dark:text-orange-200'
                  : usageInfo.remaining <= 5
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {isLimitReached 
                  ? '已达到本月免费生成次数限制'
                  : `剩余 ${usageInfo.remaining} 次免费生成`
                }
              </p>
              <p className={`text-sm mt-1 ${
                isLimitReached 
                  ? 'text-orange-700 dark:text-orange-300'
                  : usageInfo.remaining <= 5
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {isLimitReached 
                  ? '升级到 Pro 版本获得无限次生成'
                  : `本月已使用 ${usageInfo.used} / ${usageInfo.limit} 次`
                }
              </p>
              {isLimitReached && (
                <Link 
                  to="/pricing" 
                  className="inline-block mt-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
                >
                  立即升级 →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 生成按钮 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !idea.trim() || isLimitReached || false}
          className="flex-1 md:flex-initial md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
        >
          {isGenerating ? (
            <>
              <PacmanLoader size={20} className="text-white" />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Prompt
            </>
          )}
        </button>
        
        {/* Pro 用户或剩余次数显示 */}
        {usageInfo && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {usageInfo.isPro ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium">
                <Sparkles className="w-4 h-4" />
                Pro 无限制
              </span>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-purple-600 dark:text-purple-400">{usageInfo.remaining}</span> / {usageInfo.limit}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaInput;

