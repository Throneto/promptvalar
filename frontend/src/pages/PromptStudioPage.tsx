import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, Check } from 'lucide-react';
import { generatePrompt } from '../services/ai.service';
import { AIModel, PromptStyle, StructuredPrompt } from '../types/prompt';
import StepCard from '../components/studio/StepCard';
import IdeaInput from '../components/studio/IdeaInput';
import GeneratedPrompt from '../components/studio/GeneratedPrompt';
import StructuredEditor from '../components/studio/StructuredEditor';
import { PromptRating } from '../components/PromptRating';

const PromptStudioPage = () => {
  // Step 1: 用户输入
  const [idea, setIdea] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('sora');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('cinematic');

  // Step 2: AI生成的提示词
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generationLogId, setGenerationLogId] = useState<string>('');

  // Step 3: 结构化编辑
  const [structuredData, setStructuredData] = useState<StructuredPrompt>({
    subject: '',
    action: '',
    setting: '',
    shotType: '',
    lighting: '',
    composition: '',
    mood: [],
    parameters: '',
  });
  const [finalPrompt, setFinalPrompt] = useState('');

  // 生成提示词
  const handleGenerate = async () => {
    if (!idea.trim()) {
      setGenerationError('Please enter your idea first');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const result = await generatePrompt({
        idea: idea.trim(),
        model: selectedModel,
        style: selectedStyle,
      });

      setGeneratedPrompt(result.prompt);
      setStructuredData(result.structured);
      setFinalPrompt(result.prompt);
      setGenerationLogId(result.logId || ''); // 保存日志ID供评分使用
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      setGenerationError('Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 从结构化数据更新最终提示词
  const updateFinalPrompt = (updated: StructuredPrompt) => {
    setStructuredData(updated);
    
    // 组合结构化数据为最终提示词
    const parts = [
      updated.shotType && `${updated.shotType} shot of`,
      updated.subject,
      updated.action && `${updated.action}`,
      updated.setting && `in ${updated.setting}`,
      updated.lighting && `${updated.lighting} lighting`,
      updated.composition,
      updated.mood.length > 0 && `mood: ${updated.mood.join(', ')}`,
      updated.parameters,
    ].filter(Boolean);

    setFinalPrompt(parts.join(', '));
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
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-purple-400" />
            Prompt Studio
          </h1>
          <p className="text-xl text-purple-200">
            Transform your ideas into professional AI prompts in 3 simple steps
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Step 1: Idea Input */}
          <StepCard
            stepNumber={1}
            title="Start with Your Idea"
            description="Describe what you want to create in natural language"
          >
            <IdeaInput
              idea={idea}
              onIdeaChange={setIdea}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={generationError}
            />
          </StepCard>

          {/* Step 2: Generated Prompt */}
          {generatedPrompt && (
            <StepCard
              stepNumber={2}
              title="AI-Optimized Prompt"
              description="Review the professionally crafted prompt"
            >
              <GeneratedPrompt
                prompt={generatedPrompt}
                onRegenerate={handleGenerate}
                isRegenerating={isGenerating}
              />
              
              {/* 用户反馈组件 */}
              {generationLogId && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <PromptRating logId={generationLogId} />
                </div>
              )}
            </StepCard>
          )}

          {/* Step 3: Structured Editor */}
          {generatedPrompt && (
            <StepCard
              stepNumber={3}
              title="Fine-Tune with Structured Editor"
              description="Adjust individual components for precise control"
            >
              <StructuredEditor
                structuredData={structuredData}
                onUpdate={updateFinalPrompt}
                finalPrompt={finalPrompt}
              />
            </StepCard>
          )}
        </div>

        {/* 使用提示 */}
        {!generatedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-200 mb-4">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 text-purple-100">
                <li>• Be specific about what you want to create</li>
                <li>• Include details about mood, lighting, and composition</li>
                <li>• Choose the right AI model for your use case</li>
                <li>• Experiment with different styles to find what works best</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PromptStudioPage;

