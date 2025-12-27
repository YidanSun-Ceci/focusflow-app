
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import HistoryView from './views/HistoryView';
import AssistantView from './views/AssistantView';
import CommandPalette from './components/CommandPalette';
import MenuBarPopover from './components/MenuBarPopover';
import IdleOverlay from './components/IdleOverlay';
import WelcomeScreen from './components/WelcomeScreen';
import { ViewType, TaskStatus, Task, Language, Theme, TaskPriority } from './types';
import { locales } from './locales';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', name: 'Design FocusFlow UI', tag: 'Design', tagColor: 'bg-blue-500', duration: 3600, lastActive: Date.now(), priority: 'high', completed: true },
  { id: '2', name: 'Refactor Auth Logic', tag: 'Code', tagColor: 'bg-purple-500', duration: 1800, lastActive: Date.now() - 3600000, priority: 'medium', completed: false },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.IDLE);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMenuPopoverOpen, setIsMenuPopoverOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [idleStartTime, setIdleStartTime] = useState<number>(0);
  const [idleElapsedTime, setIdleElapsedTime] = useState<number>(0);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [savedTasks, setSavedTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const hasSeenWelcome = localStorage.getItem('focusflow_welcome_seen');
    return !hasSeenWelcome;
  });

  // Assistant State Persistence
  const [assistantMessages, setAssistantMessages] = useState<AIMessage[]>([]);
  const [assistantHistory, setAssistantHistory] = useState<any[]>([]);

  const t = locales[language];

  // Auto-generate task tag and color based on task name
  const generateTaskTag = (taskName: string): { tag: string; tagColor: string } => {
    const lowerName = taskName.toLowerCase();

    // Design/UI related
    if (lowerName.match(/design|ui|ux|figma|sketch|wireframe|mockup|prototype/)) {
      return { tag: 'Design', tagColor: 'bg-pink-500' };
    }
    // Code/Development related
    if (lowerName.match(/code|develop|implement|build|program|debug|refactor|fix|bug/)) {
      return { tag: 'Code', tagColor: 'bg-blue-500' };
    }
    // Meeting related
    if (lowerName.match(/meeting|call|discussion|sync|standup|review/)) {
      return { tag: 'Meeting', tagColor: 'bg-purple-500' };
    }
    // Documentation related
    if (lowerName.match(/document|docs|write|blog|article|readme/)) {
      return { tag: 'Docs', tagColor: 'bg-green-500' };
    }
    // Testing related
    if (lowerName.match(/test|testing|qa|质检|测试/)) {
      return { tag: 'Testing', tagColor: 'bg-orange-500' };
    }
    // Research/Learning related
    if (lowerName.match(/research|learn|study|读|学习|阅读|explore/)) {
      return { tag: 'Learn', tagColor: 'bg-indigo-500' };
    }
    // Planning related
    if (lowerName.match(/plan|planning|strategy|roadmap|架构|规划/)) {
      return { tag: 'Planning', tagColor: 'bg-cyan-500' };
    }
    // Default
    return { tag: 'General', tagColor: 'bg-gray-500' };
  };


  // Initialize assistant messages
  useEffect(() => {
    if (assistantMessages.length === 0) {
      setAssistantMessages([{ role: 'assistant', content: t.assistant.initialMessage }]);
    }
  }, [language]);

  // Theme management
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (status === TaskStatus.FOCUSING) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Sync timer to task state
  useEffect(() => {
    if (currentTask && status !== TaskStatus.IDLE) {
      setSavedTasks(prev => prev.map(t =>
        t.id === currentTask.id ? { ...t, duration: timer, lastActive: Date.now() } : t
      ));
    }
  }, [timer, status]);

  // Sync state to localStorage for menubar window
  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(savedTasks));
  }, [savedTasks]);

  useEffect(() => {
    if (currentTask) {
      localStorage.setItem('focusflow_current_task', JSON.stringify(currentTask));
    } else {
      localStorage.removeItem('focusflow_current_task');
    }
  }, [currentTask]);

  useEffect(() => {
    localStorage.setItem('focusflow_timer', String(timer));
  }, [timer]);

  useEffect(() => {
    localStorage.setItem('focusflow_status', status);
  }, [status]);


  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Idle Detection
  useEffect(() => {
    let timeout: any;
    let idleInterval: any;

    const resetIdle = () => {
      clearTimeout(timeout);
      clearInterval(idleInterval);

      if (isIdle) {
        setIsIdle(false);
        setIdleStartTime(0);
        setIdleElapsedTime(0);
      }

      timeout = setTimeout(() => {
        if (status === TaskStatus.FOCUSING) {
          setIsIdle(true);
          setIdleStartTime(Date.now());
          setIdleElapsedTime(0);

          // Start counting idle time
          idleInterval = setInterval(() => {
            setIdleElapsedTime(prev => prev + 1);
          }, 1000);
        }
      }, 300000); // 5 mins
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);

    resetIdle(); // Initialize

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(timeout);
      clearInterval(idleInterval);
    };
  }, [status, isIdle]);

  const handleStartTask = (taskName: string) => {
    const existing = savedTasks.find(t => t.name.toLowerCase() === taskName.toLowerCase());
    const { tag, tagColor } = generateTaskTag(taskName);
    const newTask: Task = existing || {
      id: Math.random().toString(36).substring(7),
      name: taskName,
      tag,
      tagColor,
      duration: 0,
      lastActive: Date.now(),
      priority: 'medium',
      completed: false
    };

    if (!existing) {
      setSavedTasks(prev => [newTask, ...prev]);
    } else if (existing.completed) {
      // Re-activate if completed
      setSavedTasks(prev => prev.map(t => t.id === existing.id ? { ...t, completed: false } : t));
    }

    setCurrentTask(newTask);
    setTimer(newTask.duration);
    setStatus(TaskStatus.FOCUSING);
    setIsCommandPaletteOpen(false);
  };

  const handleAddTask = (taskData: Partial<Task>) => {
    const { tag, tagColor } = taskData.tag && taskData.tagColor
      ? { tag: taskData.tag, tagColor: taskData.tagColor }
      : generateTaskTag(taskData.name || 'Untitled Task');

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      name: taskData.name || 'Untitled Task',
      tag,
      tagColor,
      duration: 0,
      lastActive: Date.now(),
      priority: taskData.priority || 'medium',
      completed: false
    };
    setSavedTasks(prev => [newTask, ...prev]);
  };

  const handleToggleCompleteTask = (id: string) => {
    setSavedTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (currentTask?.id === id) {
      handleStopTimer();
    }
  };

  const handleAddTasksFromAI = useCallback((tasks: Array<{name: string, priority: TaskPriority}>) => {
    setSavedTasks(prev => {
      const newTasksList = [...prev];
      tasks.forEach(aiTask => {
        const existingIndex = newTasksList.findIndex(t => t.name.toLowerCase() === aiTask.name.toLowerCase());
        if (existingIndex === -1) {
          newTasksList.unshift({
            id: Math.random().toString(36).substring(7),
            name: aiTask.name,
            tag: 'AI Suggested',
            tagColor: 'bg-indigo-500',
            duration: 0,
            lastActive: Date.now(),
            priority: aiTask.priority || 'medium',
            completed: false
          });
        }
      });
      return newTasksList.sort((a, b) => {
        const prioMap = { high: 0, medium: 1, low: 2 };
        return prioMap[a.priority] - prioMap[b.priority];
      });
    });
  }, []);

  const handleToggleTimer = () => {
    if (status === TaskStatus.FOCUSING) {
      setStatus(TaskStatus.PAUSED);
    } else if (status === TaskStatus.PAUSED) {
      setStatus(TaskStatus.FOCUSING);
    }
  };

  const handleStopTimer = () => {
    setStatus(TaskStatus.IDLE);
    setTimer(0);
    setCurrentTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setSavedTasks(prev => prev.filter(t => t.id !== id));
    // If deleting current task, stop it
    if (currentTask?.id === id) {
      handleStopTimer();
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setSavedTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    // If updating current task, update it as well
    if (currentTask?.id === id) {
      setCurrentTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleUpdateAssistant = (messages: AIMessage[], history: any[]) => {
    setAssistantMessages(messages);
    setAssistantHistory(history);
  };

  const handleResetAssistant = () => {
    setAssistantMessages([{ role: 'assistant', content: locales[language].assistant.initialMessage }]);
    setAssistantHistory([]);
  };

  const handleIdleResolve = (action: 'keep' | 'meeting' | 'rest' | 'discard') => {
    const idleTime = idleElapsedTime;

    if (action === 'keep') {
      // Keep the idle time in current task - do nothing, just continue
      setIsIdle(false);
      setIdleStartTime(0);
      setIdleElapsedTime(0);
    } else if (action === 'discard') {
      // Remove idle time from timer
      setTimer(prev => Math.max(0, prev - idleTime));
      setIsIdle(false);
      setIdleStartTime(0);
      setIdleElapsedTime(0);
    } else {
      // Create a new task for meeting or rest
      const taskName = action === 'meeting' ? 'Meeting' : 'Break / Rest';
      const { tag, tagColor } = action === 'meeting'
        ? { tag: 'Meeting', tagColor: 'bg-purple-500' }
        : { tag: 'Rest', tagColor: 'bg-blue-500' };

      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        name: taskName,
        tag,
        tagColor,
        duration: idleTime,
        lastActive: Date.now(),
        priority: 'low',
        completed: true // Mark as completed automatically
      };

      setSavedTasks(prev => [newTask, ...prev]);

      // Remove idle time from current task
      setTimer(prev => Math.max(0, prev - idleTime));
      setIsIdle(false);
      setIdleStartTime(0);
      setIdleElapsedTime(0);
    }
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('focusflow_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const handleResetWelcome = () => {
    localStorage.removeItem('focusflow_welcome_seen');
    setShowWelcome(true);
  };

  const lifetimeTime = useMemo(() => savedTasks.reduce((acc, t) => acc + t.duration, 0), [savedTasks]);

  return (
    <>
      {/* Welcome Screen */}
      {showWelcome && <WelcomeScreen t={t} onComplete={handleWelcomeComplete} />}

      <div className="relative h-screen w-screen overflow-hidden flex bg-background-light dark:bg-background-dark text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30">
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none opacity-10 ${
        status === TaskStatus.FOCUSING ? 'bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3)_0%,_transparent_70%)]' : 
        status === TaskStatus.PAUSED ? 'bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.2)_0%,_transparent_70%)]' : ''
      }`} />

      <Sidebar activeView={currentView} onViewChange={setCurrentView} onShowWelcome={handleResetWelcome} t={t} />

      <main className="flex-1 relative overflow-y-auto pt-12 px-12 pb-12">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <Dashboard
              key="dashboard"
              status={status}
              timer={timer}
              currentTask={currentTask}
              savedTasks={savedTasks}
              t={t}
              onToggle={handleToggleTimer}
              onStop={handleStopTimer}
              onStart={handleStartTask}
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          )}
          {currentView === 'analytics' && (
            <Analytics key="analytics" history={savedTasks} t={t} />
          )}
          {currentView === 'history' && (
            <HistoryView key="history" history={savedTasks} t={t} totalTime={lifetimeTime} />
          )}
          {currentView === 'assistant' && (
            <AssistantView 
              key="assistant" 
              t={t} 
              messages={assistantMessages}
              history={assistantHistory}
              onUpdate={handleUpdateAssistant}
              onReset={handleResetAssistant}
              onTasksAdded={handleAddTasksFromAI} 
            />
          )}
          {currentView === 'settings' && (
            <Settings
              key="settings"
              t={t}
              language={language}
              theme={theme}
              tasks={savedTasks}
              onLanguageChange={setLanguage}
              onThemeChange={setTheme}
            />
          )}
        </AnimatePresence>
      </main>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button 
          onClick={() => setIsMenuPopoverOpen(!isMenuPopoverOpen)}
          className="w-8 h-8 rounded-md bg-white/10 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Monitor size={16} className="text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuPopoverOpen && (
          <MenuBarPopover
            status={status}
            timer={timer}
            currentTask={currentTask}
            recentTasks={savedTasks}
            onClose={() => setIsMenuPopoverOpen(false)}
            onStartTask={handleStartTask}
            onToggle={handleToggleTimer}
            onStop={handleStopTimer}
          />
        )}
        {isCommandPaletteOpen && (
          <CommandPalette 
            onClose={() => setIsCommandPaletteOpen(false)} 
            onSelect={handleStartTask}
          />
        )}
        {isIdle && <IdleOverlay t={t} onResolve={handleIdleResolve} idleTime={idleElapsedTime} />}
      </AnimatePresence>
    </div>
    </>
  );
};

export default App;
