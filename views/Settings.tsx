
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Moon, Sun, Info, ChevronRight, ChevronDown, Cpu, Check, Download, Eye } from 'lucide-react';
import { Language, Theme, Task } from '../types';
import { Locales } from '../locales';
import { formatTime } from '../utils';

interface SettingsProps {
  t: Locales;
  language: Language;
  theme: Theme;
  tasks: Task[];
  onLanguageChange: (lang: Language) => void;
  onThemeChange: (theme: Theme) => void;
}

interface AIConfig {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

const Settings: React.FC<SettingsProps> = ({ t, language, theme, tasks, onLanguageChange, onThemeChange }) => {
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '',
    modelName: 'deepseek-v3-250324',
  });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    ai: false,
    language: false,
    appearance: false,
    download: false,
    about: false,
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ai_config');
    if (saved) {
      try {
        setAIConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved config');
      }
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleExportJSON = () => {
    const totalTime = tasks.reduce((acc, t) => acc + t.duration, 0);
    const sortedHistory = [...tasks].sort((a, b) => b.lastActive - a.lastActive);

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalTime: totalTime,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      tasks: sortedHistory.map(task => ({
        id: task.id,
        name: task.name,
        tag: task.tag,
        tagColor: task.tagColor,
        duration: task.duration,
        durationFormatted: formatTime(task.duration),
        lastActive: task.lastActive,
        lastActiveDate: new Date(task.lastActive).toISOString(),
        priority: task.priority,
        completed: task.completed,
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusflow-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPreviewData = () => {
    const totalTime = tasks.reduce((acc, t) => acc + t.duration, 0);
    return {
      exportedAt: new Date().toISOString(),
      totalTime: totalTime,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      recentTasks: tasks.slice(0, 3).map(t => ({
        name: t.name,
        tag: t.tag,
        duration: formatTime(t.duration),
      }))
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto py-8"
    >
      <h1 className="text-2xl font-bold mb-8">{t.settings.title}</h1>

      <div className="space-y-4">
        {/* AI Model Configuration Section */}
        <section className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('ai')}
            className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Cpu size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{t.settings.aiModel}</h3>
                <p className="text-[10px] text-zinc-500">{t.settings.configDesc}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.ai ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.ai && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      {t.settings.apiEndpoint}
                    </label>
                    <input
                      type="text"
                      value={aiConfig.apiEndpoint}
                      onChange={(e) => setAIConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                      placeholder={t.settings.endpointPlaceholder}
                      className="w-full px-3 py-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      {t.settings.apiKey}
                    </label>
                    <input
                      type="password"
                      value={aiConfig.apiKey}
                      onChange={(e) => setAIConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder={t.settings.apiKeyPlaceholder}
                      className="w-full px-3 py-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      {t.settings.modelName}
                    </label>
                    <input
                      type="text"
                      value={aiConfig.modelName}
                      onChange={(e) => setAIConfig(prev => ({ ...prev, modelName: e.target.value }))}
                      placeholder={t.settings.modelPlaceholder}
                      className="w-full px-3 py-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                    />
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    className="w-full mt-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 group text-xs"
                  >
                    {showSavedNotification ? (
                      <>
                        <Check size={14} className="animate-in fade-in zoom-in" />
                        <span>{t.settings.configSaved}</span>
                      </>
                    ) : (
                      <span>{t.settings.saveConfig}</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Language Section */}
        <section className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('language')}
            className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Globe size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{t.settings.language}</h3>
                <p className="text-[10px] text-zinc-500">{t.settings.selectLang}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.language ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.language && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-2">
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${language === 'en' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-zinc-500'}`}
                  >
                    <span className="text-xs font-medium">English</span>
                    {language === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />}
                  </button>
                  <button
                    onClick={() => onLanguageChange('zh')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${language === 'zh' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-zinc-500'}`}
                  >
                    <span className="text-xs font-medium">简体中文</span>
                    {language === 'zh' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Appearance Section */}
        <section className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('appearance')}
            className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{t.settings.appearance}</h3>
                <p className="text-[10px] text-zinc-500">Choose your visual style</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.appearance ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.appearance && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${theme === 'light' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 'hover:bg-black/[0.02] text-zinc-500 border border-transparent'}`}
                  >
                    <div className="w-full aspect-video rounded-lg bg-zinc-200 border border-zinc-300 flex items-center justify-center">
                      <Sun size={14} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{t.settings.theme.light}</span>
                  </button>
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/[0.02] text-zinc-500 border border-transparent'}`}
                  >
                    <div className="w-full aspect-video rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <Moon size={14} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{t.settings.theme.dark}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Download Data Section */}
        <section className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('download')}
            className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <Download size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{t.settings.download}</h3>
                <p className="text-[10px] text-zinc-500">{t.settings.downloadDesc}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.download ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.download && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Preview Toggle */}
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.05] hover:bg-black/[0.03] dark:hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Eye size={14} className="text-green-500" />
                      <span className="text-xs font-medium">{t.settings.previewData}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showPreview ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="text-zinc-500" />
                    </motion.div>
                  </button>

                  {/* Preview Content */}
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-300 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 overflow-y-auto border border-white/5">
                          {JSON.stringify(getPreviewData(), null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Download Button */}
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Download size={14} />
                    <span>{t.settings.downloadJSON}</span>
                  </button>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-lg p-2.5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">{t.settings.totalTasks}</p>
                      <p className="text-base font-bold">{tasks.length}</p>
                    </div>
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-lg p-2.5 text-center">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">{t.settings.completedTasks}</p>
                      <p className="text-base font-bold text-green-500">{tasks.filter(t => t.completed).length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* About Section */}
        <section className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('about')}
            className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                <Info size={16} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">{t.settings.about}</h3>
                <p className="text-[10px] text-zinc-500">{t.settings.version} 1.1.0</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.about ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.about && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t.settings.aboutDesc}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">{t.settings.developer}</p>
                      <p className="text-xs font-semibold">Ceci</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">{t.settings.email}</p>
                      <p className="text-xs font-semibold">gemdataservice@gmail.com</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  );
};

export default Settings;
