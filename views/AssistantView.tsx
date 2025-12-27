
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, RotateCcw } from 'lucide-react';
import { Locales } from '../locales';
import OpenAI from 'openai';
import { TaskPriority } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantViewProps {
  t: Locales;
  messages: Message[];
  history: any[];
  onUpdate: (messages: Message[], history: any[]) => void;
  onReset: () => void;
  onTasksAdded?: (tasks: Array<{name: string, priority: TaskPriority}>) => void;
}

interface AIConfig {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

// Get AI configuration from localStorage
const getAIConfig = (): AIConfig => {
  const saved = localStorage.getItem('ai_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse AI config');
    }
  }
  // Default configuration
  return {
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '',
    modelName: 'deepseek-v3-250324',
  };
};

const AssistantView: React.FC<AssistantViewProps> = ({
  t,
  messages,
  history,
  onUpdate,
  onReset,
  onTasksAdded
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const config = getAIConfig();

    if (!config.apiKey) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please configure your API key in Settings to use the AI Assistant.'
      };
      onUpdate([...messages, { role: 'user', content: input }, errorMessage], history);
      setInput('');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    // Update local and parent state immediately for user message
    onUpdate(newMessages, history);
    setInput('');
    setIsLoading(true);

    try {
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.apiEndpoint,
        dangerouslyAllowBrowser: true,
      });

      // Build conversation history
      const conversationMessages = [
        {
          role: 'system' as const,
          content: "You are an expert productivity coach for an app called FocusFlow. Your goal is to help users maintain deep focus. When the user asks for help with tasks or priorities, respond naturally and include a JSON block at the end in this exact format: ```json\n{\"tasks\": [{\"name\": \"task name\", \"priority\": \"high|medium|low\"}]}\n```. Keep responses concise and encouraging.",
        },
        ...history.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: input,
        }
      ];

      const completion = await client.chat.completions.create({
        model: config.modelName,
        messages: conversationMessages,
        extra_headers: { 'x-is-encrypted': 'true' } as any,
      });

      const responseText = completion.choices[0]?.message?.content || 'Sorry, I encountered an issue. Please try again later.';

      // Try to extract tasks from response
      let detectedTasks: Array<{name: string, priority: TaskPriority}> = [];
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.tasks && Array.isArray(parsed.tasks)) {
            detectedTasks = parsed.tasks;
          }
        } catch (e) {
          console.log('Failed to parse task JSON');
        }
      }

      // Clean response text (remove JSON block if present)
      const cleanText = responseText.replace(/```json[\s\S]*?```/, '').trim();

      const aiMessage: Message = { role: 'assistant', content: cleanText };

      const updatedMessages = [...newMessages, aiMessage];
      const updatedHistory = [
        ...history,
        { role: 'user', content: input },
        { role: 'assistant', content: cleanText }
      ];

      // Update parent state with both message and history
      onUpdate(updatedMessages, updatedHistory);

      if (detectedTasks.length > 0 && onTasksAdded) {
        onTasksAdded(detectedTasks);
      }
    } catch (error) {
      console.error('AI Assistant Error:', error);
      onUpdate(
        [...newMessages, { role: 'assistant', content: 'Sorry, I encountered an issue. Please try again later.' }],
        history
      );
    } finally {
      setIsLoading(false);
    }
  };

  const config = getAIConfig();
  const providerName = config.apiEndpoint.includes('volces.com') ? 'Volcengine Ark' : 'Custom AI';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col pt-8"
    >
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.assistant.title}</h1>
            <p className="text-zinc-500 text-[10px]">Powered by {providerName} (Multi-turn Support)</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest"
        >
          <RotateCcw size={12} />
          Reset Chat
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-4 space-y-4 mb-6 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-zinc-800 dark:text-zinc-300'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 p-3 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.assistant.placeholder}
          className="w-full bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl py-3 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs shadow-xl"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default AssistantView;
