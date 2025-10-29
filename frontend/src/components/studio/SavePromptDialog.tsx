import { useState, FormEvent } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PacmanLoader from '../common/PacmanLoader';

interface SavePromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SavePromptData) => Promise<void>;
  initialData?: Partial<SavePromptData>;
  isEditMode?: boolean;
}

export interface SavePromptData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  previewImage?: string;
}

const CATEGORIES = [
  { value: 'video', label: 'Video Generation' },
  { value: 'image', label: 'Image Generation' },
  { value: 'animation', label: 'Animation' },
  { value: 'photography', label: 'Photography' },
  { value: 'art', label: 'Art Creation' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
];

const POPULAR_TAGS = [
  'cinematic', 'realistic', 'artistic', 'abstract', 
  'fantasy', 'sci-fi', 'nature', 'portrait',
  'landscape', 'urban', 'vintage', 'modern'
];

function SavePromptDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = {},
  isEditMode = false 
}: SavePromptDialogProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState(initialData.previewImage || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
        previewImage: previewImage.trim() || undefined,
      });
      
      // 成功后关闭对话框
      onClose();
    } catch (err: any) {
      console.error('Save failed:', err);
      setError(err.message || 'Failed to save, please try again later');
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* 对话框 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* 头部 */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Prompt' : 'Save Prompt'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={saving}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your prompt a name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
                minLength={3}
                maxLength={255}
                disabled={saving}
              />
              <p className="mt-1 text-xs text-gray-500">
                {title.length}/255 characters
              </p>
            </div>

            {/* 描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and features of this prompt..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                disabled={saving}
              />
            </div>

            {/* 分类 */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={saving}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              
              {/* 已选标签 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                        disabled={saving}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* 标签输入 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Enter tag and press Enter..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  disabled={saving || !tagInput.trim()}
                >
                  Add
                </button>
              </div>

              {/* 推荐标签 */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      disabled={saving}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 预览图 URL */}
            <div>
              <label htmlFor="previewImage" className="block text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Preview Image URL
              </label>
              <input
                type="url"
                id="previewImage"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Provide an image URL as preview
              </p>
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <PacmanLoader size={20} className="text-white" />
                    <span>正在保存...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditMode ? '更新' : '保存'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SavePromptDialog;

