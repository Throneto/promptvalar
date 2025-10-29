import { Sparkles } from 'lucide-react';
import { AIModel, PromptStyle } from '../../types/prompt';
import PacmanLoader from '../common/PacmanLoader';

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
}: IdeaInputProps) => {
  return (
    <div className="space-y-6">
      {/* 文本输入区域 */}
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Describe your idea
        </label>
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          placeholder="Example: A cat astronaut floating in space, playing with colorful planets..."
          className="w-full h-40 px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* 模型和风格选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            AI Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AIModel)}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            disabled={isGenerating}
          >
            {models.map((model) => (
              <option key={model.value} value={model.value} className="bg-slate-800">
                {model.label} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* 风格选择 */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Style
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => onStyleChange(e.target.value as PromptStyle)}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            disabled={isGenerating}
          >
            {styles.map((style) => (
              <option key={style.value} value={style.value} className="bg-slate-800">
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* 生成按钮 */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !idea.trim()}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
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
    </div>
  );
};

export default IdeaInput;

