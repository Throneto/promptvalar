import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Save, CheckCircle } from 'lucide-react';
import { generatePrompt, UsageInfo } from '../services/ai.service';
import { 
  getPromptById, 
  createPrompt, 
  updatePrompt, 
  type CreatePromptRequest 
} from '../services/prompt.service';
import { getCurrentUser } from '../services/auth.service';
import { getUserUsageStats } from '../services/subscription.service';
import { AIModel, PromptStyle, StructuredPrompt } from '../types/prompt';
import StepCard from '../components/studio/StepCard';
import IdeaInput from '../components/studio/IdeaInput';
import GeneratedPrompt from '../components/studio/GeneratedPrompt';
import StructuredEditor from '../components/studio/StructuredEditor';
import { PromptRating } from '../components/PromptRating';
import SavePromptDialog, { SavePromptData } from '../components/studio/SavePromptDialog';

const DRAFT_KEY = 'promptvalar_draft';

const PromptStudioPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

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

  // 保存对话框
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveData, setSaveData] = useState<Partial<SavePromptData>>({});

  // 成功消息
  const [successMessage, setSuccessMessage] = useState('');

  // 使用统计信息
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);

  // 加载编辑模式数据
  useEffect(() => {
    if (editId) {
      loadPromptForEdit(editId);
    } else {
      // 尝试加载草稿
      loadDraft();
    }
  }, [editId]);

  // 加载用户使用统计信息
  useEffect(() => {
    const loadUsageStats = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      try {
        const stats = await getUserUsageStats();
        setUsageInfo({
          remaining: stats.remaining,
          limit: stats.limit,
          used: stats.used,
          isPro: stats.isPro,
        });
      } catch (error) {
        console.error('Failed to load usage stats:', error);
      }
    };

    loadUsageStats();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (!isEditMode && (idea || generatedPrompt || finalPrompt)) {
      const draft = {
        idea,
        selectedModel,
        selectedStyle,
        generatedPrompt,
        structuredData,
        finalPrompt,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [idea, selectedModel, selectedStyle, generatedPrompt, structuredData, finalPrompt, isEditMode]);

  // 加载要编辑的提示词
  const loadPromptForEdit = async (id: string) => {
    try {
      const response = await getPromptById(id);
      if (response.success && response.data) {
        const prompt = response.data;
        
        // 检查是否是作者本人
        const currentUser = getCurrentUser();
        if (currentUser?.id !== prompt.author?.id) {
          alert('You can only edit your own prompts');
          navigate('/studio');
          return;
        }

        // 加载数据
        setIsEditMode(true);
        setEditingPromptId(id);
        setGeneratedPrompt(prompt.content);
        setFinalPrompt(prompt.content);
        setSelectedModel(prompt.modelType as AIModel);
        setSelectedStyle((prompt.style || 'cinematic') as PromptStyle);
        
        // 设置保存数据
        setSaveData({
          title: prompt.title,
          description: prompt.description || '',
          category: prompt.category || '',
          tags: prompt.tags || [],
          previewImage: prompt.previewImage || '',
        });
      }
    } catch (error) {
      console.error('Failed to load prompt:', error);
      alert('Failed to load prompt');
      navigate('/studio');
    }
  };

  // 加载草稿
  const loadDraft = () => {
    try {
      const draftStr = localStorage.getItem(DRAFT_KEY);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();
        
        // 只加载24小时内的草稿
        if (draftAge < 24 * 60 * 60 * 1000) {
          setIdea(draft.idea || '');
          setSelectedModel(draft.selectedModel || 'sora');
          setSelectedStyle(draft.selectedStyle || 'cinematic');
          setGeneratedPrompt(draft.generatedPrompt || '');
          setStructuredData(draft.structuredData || {});
          setFinalPrompt(draft.finalPrompt || '');
        } else {
          // 清除过期草稿
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  // 清除草稿
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

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
      setGenerationLogId(result.logId || '');

      // 更新使用信息
      if (result.usage) {
        setUsageInfo(result.usage);
      }
    } catch (error: any) {
      console.error('Failed to generate prompt:', error);
      
      // 检查是否达到限制
      if (error.response?.data?.error?.code === 'GENERATION_LIMIT_REACHED') {
        setGenerationError(
          'You have reached your monthly generation limit. Upgrade to Pro for unlimited generations.'
        );
      } else {
        setGenerationError('Failed to generate prompt. Please try again.');
      }
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

  // 打开保存对话框
  const handleOpenSaveDialog = () => {
    if (!finalPrompt.trim()) {
      alert('Please generate a prompt first');
      return;
    }
    setShowSaveDialog(true);
  };

  // 保存提示词
  const handleSavePrompt = async (data: SavePromptData) => {
    try {
      const promptData: CreatePromptRequest = {
        title: data.title,
        description: data.description || undefined,
        content: finalPrompt,
        modelType: selectedModel,
        style: selectedStyle,
        category: data.category || undefined,
        tags: data.tags,
        previewImage: data.previewImage,
      };

      let savedPrompt;
      if (isEditMode && editingPromptId) {
        // 更新现有提示词
        const response = await updatePrompt(editingPromptId, promptData);
        savedPrompt = response.data;
        setSuccessMessage('Prompt updated successfully!');
      } else {
        // 创建新提示词
        const response = await createPrompt(promptData);
        savedPrompt = response.data;
        setSuccessMessage('Prompt saved successfully!');
        clearDraft(); // 清除草稿
      }

      // 显示成功消息
      setTimeout(() => {
        setSuccessMessage('');
        // 跳转到详情页
        navigate(`/library/${savedPrompt.id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to save prompt:', error);
      throw new Error(error.response?.data?.error?.message || 'Failed to save, please try again later');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* 成功消息 */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">{successMessage}</span>
          </motion.div>
        )}

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            {isEditMode ? 'Edit Prompt' : 'Prompt Studio'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-purple-200">
            {isEditMode 
              ? 'Update your prompt and save changes'
              : 'Transform your ideas into professional AI prompts in 3 simple steps'
            }
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
              usageInfo={usageInfo}
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
              
              {/* 保存按钮 */}
              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenSaveDialog}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl flex items-center gap-3 transition-all"
                >
                  <Save className="w-6 h-6" />
                  {isEditMode ? 'Update Prompt' : 'Save Prompt'}
                </motion.button>
              </div>
            </StepCard>
          )}
        </div>

        {/* 保存对话框 */}
        <SavePromptDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSavePrompt}
          initialData={saveData}
          isEditMode={isEditMode}
        />

        {/* 使用提示 */}
        {!generatedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 backdrop-blur-sm border border-purple-300 dark:border-purple-500/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-4">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 text-gray-800 dark:text-purple-100">
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

