import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { StructuredPrompt, ShotType, LightingType } from '../../types/prompt';

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

  useEffect(() => {
    setLocalData(structuredData);
  }, [structuredData]);

  const handleChange = (field: keyof StructuredPrompt, value: string | string[]) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleAddMood = () => {
    if (moodInput.trim() && !localData.mood.includes(moodInput.trim())) {
      const updated = { ...localData, mood: [...localData.mood, moodInput.trim()] };
      setLocalData(updated);
      onUpdate(updated);
      setMoodInput('');
    }
  };

  const handleRemoveMood = (moodToRemove: string) => {
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
      {/* 结构化字段编辑 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Subject</label>
          <input
            type="text"
            value={localData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Main subject of your prompt"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Shot Type */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Shot Type</label>
          <select
            value={localData.shotType}
            onChange={(e) => handleChange('shotType', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Mood Tags */}
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Mood</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMood()}
            placeholder="Add mood tag (press Enter)"
            className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <button
            onClick={handleAddMood}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
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
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Parameters (Model-specific)
        </label>
        <input
          type="text"
          value={localData.parameters}
          onChange={(e) => handleChange('parameters', e.target.value)}
          placeholder="e.g., --ar 16:9 --style raw"
          className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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

