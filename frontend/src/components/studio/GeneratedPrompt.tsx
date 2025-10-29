import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import PacmanLoader from '../common/PacmanLoader';

interface GeneratedPromptProps {
  prompt: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const GeneratedPrompt = ({ prompt, onRegenerate, isRegenerating }: GeneratedPromptProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* 提示词显示区域 */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{prompt}</p>
        </div>

        {/* 复制成功提示 */}
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Copied!
          </motion.div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>

        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegenerating ? (
            <>
              <PacmanLoader size={16} className="text-white" />
              <span>Regenerating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratedPrompt;

