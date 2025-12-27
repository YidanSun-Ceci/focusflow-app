import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, AlertCircle } from 'lucide-react';
import { TaskPriority } from '../types';
import { Locales } from '../locales';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    tag: string;
    tagColor: string;
    priority: TaskPriority;
  }) => void;
  initialData?: {
    name?: string;
    tag?: string;
    tagColor?: string;
    priority?: TaskPriority;
  };
  t: Locales;
  mode: 'create' | 'edit';
}

const PRESET_TAGS = [
  { name: 'Design', color: 'bg-pink-500' },
  { name: 'Code', color: 'bg-blue-500' },
  { name: 'Meeting', color: 'bg-purple-500' },
  { name: 'Docs', color: 'bg-green-500' },
  { name: 'Testing', color: 'bg-orange-500' },
  { name: 'Learn', color: 'bg-indigo-500' },
  { name: 'Planning', color: 'bg-cyan-500' },
  { name: 'General', color: 'bg-gray-500' },
];

const TAG_COLORS = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-gray-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-rose-500',
];

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  t,
  mode,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [tag, setTag] = useState(initialData?.tag || '');
  const [tagColor, setTagColor] = useState(initialData?.tagColor || 'bg-gray-500');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
  const [isCustomTag, setIsCustomTag] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        tag: tag || 'General',
        tagColor: tagColor,
        priority,
      });
      onClose();
      // Reset form
      setName('');
      setTag('');
      setTagColor('bg-gray-500');
      setPriority('medium');
      setIsCustomTag(false);
    }
  };

  const handleSelectPresetTag = (presetName: string, presetColor: string) => {
    setTag(presetName);
    setTagColor(presetColor);
    setIsCustomTag(false);
  };

  const handleCustomTagToggle = () => {
    setIsCustomTag(true);
    setTag('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-6 w-full max-w-md mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">
              {mode === 'create' ? t.dashboard.addTask : 'Edit Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                Task Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name..."
                className="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-terminal-green/50 transition-all"
                autoFocus
              />
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Tag size={12} /> Tag
              </label>

              {/* Preset Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_TAGS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetTag(preset.name, preset.color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white transition-all ${
                      preset.color
                    } ${
                      tag === preset.name && !isCustomTag
                        ? 'ring-2 ring-terminal-green ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCustomTagToggle}
                  className={`text-xs font-bold text-terminal-green hover:text-terminal-green-dim transition-colors ${
                    isCustomTag ? 'underline' : ''
                  }`}
                >
                  + Custom Tag
                </button>

                {isCustomTag && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Enter custom tag name..."
                      className="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-terminal-green/50 transition-all text-sm"
                    />

                    {/* Color Picker */}
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                        Select Color:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTagColor(color)}
                            className={`w-8 h-8 rounded-full ${color} transition-all ${
                              tagColor === color
                                ? 'ring-2 ring-terminal-green ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 scale-110'
                                : 'opacity-70 hover:opacity-100 hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                <AlertCircle size={12} /> {t.priority.label}
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500 text-white ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                          : 'bg-zinc-500 text-white ring-2 ring-zinc-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                        : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    {t.priority[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 px-4 py-2.5 bg-terminal-green hover:bg-terminal-green-dim disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg font-bold text-sm transition-all shadow-lg shadow-terminal-green/20"
              >
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDialog;
