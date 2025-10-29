import { useState, useEffect } from 'react';
import { Copy, Check, Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StructuredPrompt, ShotType, LightingType } from '../../types/prompt';
import { getCurrentUser } from '../../services/auth.service';

interface StructuredEditorProps {
  structuredData: StructuredPrompt;
  onUpdate: (data: StructuredPrompt) => void;
  finalPrompt: string;
}

const shotTypes: ShotType[] = [
  'wide_shot',
  'medium_shot',
  'close_up',
  'extreme_close_up',
  'aerial_view',
  'POV',
  'over_shoulder',
];

const lightingTypes: LightingType[] = [
  'natural',
  'studio',
  'golden_hour',
  'blue_hour',
  'dramatic',
  'soft',
  'neon',
  'backlit',
];

const StructuredEditor = ({ structuredData, onUpdate, finalPrompt }: StructuredEditorProps) => {
  const [localData, setLocalData] = useState<StructuredPrompt>(structuredData);
  const [copied, setCopied] = useState(false);
  const [moodInput, setMoodInput] = useState('');
  
  // 检查用户是否为 Pro 用户
  const user = getCurrentUser();
  const isPro = user?.subscriptionTier === 'pro';
  const isDisabled = !isPro;

  useEffect(() => {
    setLocalData(structuredData);
  }, [structuredData]);

  const handleChange = (field: keyof StructuredPrompt, value: string | string[]) => {
    if (isDisabled) return; // Pro Only 限制
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleAddMood = () => {
    if (isDisabled) return; // Pro Only 限制
    if (moodInput.trim() && !localData.mood.includes(moodInput.trim())) {
      const updated = { ...localData, mood: [...localData.mood, moodInput.trim()] };
      setLocalData(updated);
      onUpdate(updated);
      setMoodInput('');
    }
  };

  const handleRemoveMood = (moodToRemove: string) => {
    if (isDisabled) return; // Pro Only 限制
    const updated = { ...localData, mood: localData.mood.filter((m) => m !== moodToRemove) };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleCopyFinal = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pro Only 提示横幅 */}
      {!isPro && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Pro Feature Exclusive
              </h3>
              <p className="text-amber-100/90 mb-4">
                Structured Editor is a Pro-exclusive feature. Upgrade to Pro plan to unlock fine-tuning capabilities,
                including full control over subject, action, setting, shot type, lighting, composition, and mood.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Pro Now
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* 结构化字段编辑 */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Subject</label>
          <input
            type="text"
            value={localData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Main subject of your prompt"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          />
        </div>

        {/* Action */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Action</label>
          <input
            type="text"
            value={localData.action}
            onChange={(e) => handleChange('action', e.target.value)}
            placeholder="What is happening"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          />
        </div>

        {/* Setting */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Setting</label>
          <input
            type="text"
            value={localData.setting}
            onChange={(e) => handleChange('setting', e.target.value)}
            placeholder="Location or environment"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          />
        </div>

        {/* Shot Type */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Shot Type</label>
          <select
            value={localData.shotType}
            onChange={(e) => handleChange('shotType', e.target.value)}
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-800">
              Select shot type
            </option>
            {shotTypes.map((type) => (
              <option key={type} value={type} className="bg-slate-800">
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Lighting */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Lighting</label>
          <select
            value={localData.lighting}
            onChange={(e) => handleChange('lighting', e.target.value)}
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-800">
              Select lighting
            </option>
            {lightingTypes.map((type) => (
              <option key={type} value={type} className="bg-slate-800">
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Composition */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Composition</label>
          <input
            type="text"
            value={localData.composition}
            onChange={(e) => handleChange('composition', e.target.value)}
            placeholder="Composition details"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Mood Tags */}
      <div className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
        <label className="block text-sm font-medium text-purple-200 mb-2">Mood</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMood()}
            placeholder="Add mood tag (press Enter)"
            disabled={isDisabled}
            className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddMood}
            disabled={isDisabled}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localData.mood.map((mood, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-100"
            >
              {mood}
              <button
                onClick={() => handleRemoveMood(mood)}
                className="text-purple-300 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Parameters (Model-specific)
        </label>
        <input
          type="text"
          value={localData.parameters}
          onChange={(e) => handleChange('parameters', e.target.value)}
          placeholder="e.g., --ar 16:9 --style raw"
          disabled={isDisabled}
          className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed"
        />
      </div>

      {/* Final Prompt Preview */}
      <div className="pt-6 border-t border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-200">Final Prompt Preview</h3>
          <button
            onClick={handleCopyFinal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Final Prompt
              </>
            )}
          </button>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/40 rounded-xl p-6">
          <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{finalPrompt}</p>
        </div>
      </div>
    </div>
  );
};

export default StructuredEditor;

