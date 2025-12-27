
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Plus, Search, Tag, Clock, AlertCircle, CheckCircle, Trash2, Edit2, X, Check } from 'lucide-react';
import { TaskStatus, Task, TaskPriority } from '../types';
import { formatTime, getStatusColor } from '../utils';
import { Locales } from '../locales';
import TaskDialog from '../components/TaskDialog';

interface DashboardProps {
  status: TaskStatus;
  timer: number;
  currentTask: Task | null;
  savedTasks: Task[];
  t: Locales;
  onToggle: () => void;
  onStop: () => void;
  onStart: (name: string) => void;
  onAddTask: (task: Partial<Task>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
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

const Dashboard: React.FC<DashboardProps> = ({
  status, timer, currentTask, savedTasks, t, onToggle, onStop, onStart, onAddTask, onToggleComplete, onDeleteTask, onUpdateTask
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagValue, setEditTagValue] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPriorityId, setEditingPriorityId] = useState<string | null>(null);
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const progress = (timer % 3600) / 3600; 

  const getPriorityColor = (p: TaskPriority) => {
    switch(p) {
        case 'high': return 'text-red-500';
        case 'medium': return 'text-amber-500';
        case 'low': return 'text-zinc-500';
        default: return 'text-zinc-500';
    }
  };

  const handleTaskDialogSubmit = (data: {
    name: string;
    tag: string;
    tagColor: string;
    priority: TaskPriority;
  }) => {
    if (editingTask) {
      // Edit existing task
      onUpdateTask(editingTask.id, {
        name: data.name,
        tag: data.tag,
        tagColor: data.tagColor,
        priority: data.priority,
      });
      setEditingTask(null);
    } else {
      // Create new task
      onAddTask(data);
    }
    setIsTaskDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto w-full pt-20"
    >
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="112" cy="112" r="108"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-black/5 dark:text-white/5"
          />
          <motion.circle
            cx="112" cy="112" r="108"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={678}
            animate={{ strokeDashoffset: 678 - (678 * progress) }}
            transition={{ duration: 1, ease: "linear" }}
            className={status === TaskStatus.FOCUSING ? 'text-terminal-green shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'text-terminal-amber shadow-[0_0_10px_rgba(255,176,0,0.3)]'}
          />
        </svg>

        <div className="z-10 text-center">
          <motion.h1
            key={timer}
            initial={{ opacity: 0.8, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-mono tracking-tight text-zinc-900 dark:text-white dark:retro-glow"
          >
            {formatTime(timer)}
          </motion.h1>
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <span className={`text-[9px] uppercase tracking-[0.3em] font-bold ${getStatusColor(status)}`}>
              {status === TaskStatus.FOCUSING ? t.dashboard.focusing : status === TaskStatus.PAUSED ? t.dashboard.paused : t.dashboard.ready}
            </span>
            {status !== TaskStatus.IDLE && (
               <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1 h-1 rounded-full ${status === TaskStatus.FOCUSING ? 'bg-emerald-500 dark:bg-terminal-green' : 'bg-amber-500 dark:bg-terminal-amber'}`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {status === TaskStatus.IDLE ? (
            <motion.div 
              key="idle-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={16} className="text-zinc-500 dark:text-zinc-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-terminal-green transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={t.dashboard.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inputValue && onStart(inputValue)}
                  className="w-full bg-white dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-terminal-green/20 rounded-xl py-3 pl-12 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-terminal-green/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm"
                />
                <button
                  onClick={() => inputValue && onStart(inputValue)}
                  disabled={!inputValue}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-500 hover:bg-emerald-600 dark:bg-terminal-green dark:hover:bg-terminal-green-dim disabled:opacity-50 text-white dark:text-black rounded-lg transition-all shadow-lg shadow-emerald-500/20 dark:shadow-terminal-green/20 text-xs font-bold uppercase tracking-wider"
                >
                  {t.dashboard.start}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-500">{t.dashboard.savedTasks}</h3>
                  <button
                    onClick={handleOpenCreateDialog}
                    className="text-[9px] text-emerald-600 dark:text-terminal-green font-bold flex items-center gap-1 hover:text-emerald-700 dark:hover:text-terminal-green-dim transition-colors"
                  >
                    <Plus size={10} /> {t.dashboard.addTask}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {savedTasks.length === 0 ? (
                    <div className="col-span-2 py-6 text-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-xl text-zinc-500 dark:text-zinc-600 text-[10px] italic bg-white/50 dark:bg-transparent">
                      {t.dashboard.noTasks}
                    </div>
                  ) : (
                    savedTasks.map(task => (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-terminal-green/10 shadow-sm dark:shadow-none transition-all flex flex-col gap-2 group relative ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      >
                        {/* Top row: Tag and Actions */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            {editingTagId === task.id ? (
                              <div className="relative z-10">
                                {/* Preset Tag Grid */}
                                <div className="absolute left-0 top-0 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-black/10 dark:border-white/10 p-2 min-w-[200px]">
                                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                                    {PRESET_TAGS.map((preset) => (
                                      <button
                                        key={preset.name}
                                        onClick={() => {
                                          onUpdateTask(task.id, { tag: preset.name, tagColor: preset.color });
                                          setEditingTagId(null);
                                          setShowCustomTagInput(false);
                                        }}
                                        className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wide text-white ${preset.color} hover:opacity-80 transition-opacity`}
                                      >
                                        {preset.name}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Custom Tag Toggle */}
                                  <button
                                    onClick={() => setShowCustomTagInput(!showCustomTagInput)}
                                    className="w-full text-[8px] font-bold text-terminal-green hover:text-terminal-green-dim transition-colors text-left px-1 py-1"
                                  >
                                    {showCustomTagInput ? '− Hide Custom' : '+ Custom Tag'}
                                  </button>

                                  {/* Custom Tag Input */}
                                  {showCustomTagInput && (
                                    <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 space-y-1.5">
                                      <input
                                        type="text"
                                        value={editTagValue}
                                        onChange={(e) => setEditTagValue(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && editTagValue.trim()) {
                                            onUpdateTask(task.id, { tag: editTagValue });
                                            setEditingTagId(null);
                                            setShowCustomTagInput(false);
                                          } else if (e.key === 'Escape') {
                                            setEditingTagId(null);
                                            setShowCustomTagInput(false);
                                          }
                                        }}
                                        placeholder="Enter custom tag..."
                                        className="w-full px-2 py-1 rounded text-[8px] bg-black/5 dark:bg-white/5 border border-terminal-green/30 outline-none focus:border-terminal-green text-zinc-900 dark:text-white"
                                        autoFocus
                                      />
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            if (editTagValue.trim()) {
                                              onUpdateTask(task.id, { tag: editTagValue });
                                              setEditingTagId(null);
                                              setShowCustomTagInput(false);
                                            }
                                          }}
                                          className="flex-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-500 text-[7px] font-bold"
                                        >
                                          <Check size={10} className="mx-auto" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingTagId(null);
                                            setShowCustomTagInput(false);
                                          }}
                                          className="flex-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-500 text-[7px] font-bold"
                                        >
                                          <X size={10} className="mx-auto" />
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Close Button */}
                                  {!showCustomTagInput && (
                                    <button
                                      onClick={() => {
                                        setEditingTagId(null);
                                        setShowCustomTagInput(false);
                                      }}
                                      className="w-full mt-1 px-2 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[8px] font-bold transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingTagId(task.id);
                                  setEditTagValue(task.tag);
                                  setShowCustomTagInput(false);
                                }}
                                className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white w-fit ${task.tagColor} hover:opacity-80 transition-opacity flex items-center gap-1 group/tag`}
                              >
                                {task.tag}
                                <Edit2 size={6} className="opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                              </button>
                            )}
                            {editingPriorityId === task.id ? (
                              <div className="flex items-center gap-1">
                                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => {
                                      onUpdateTask(task.id, { priority: p });
                                      setEditingPriorityId(null);
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider transition-all ${
                                      p === 'high'
                                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                        : p === 'medium'
                                        ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                                        : 'bg-zinc-500/20 text-zinc-500 hover:bg-zinc-500/30'
                                    }`}
                                  >
                                    {t.priority[p]}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setEditingPriorityId(null)}
                                  className="p-0.5 hover:bg-red-500/20 rounded text-red-500"
                                >
                                  <X size={8} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingPriorityId(task.id)}
                                className={`flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-widest ${getPriorityColor(task.priority)} hover:opacity-70 transition-opacity group/priority`}
                              >
                                <AlertCircle size={8} /> {t.priority[task.priority]}
                                <Edit2 size={6} className="opacity-0 group-hover/priority:opacity-100 transition-opacity" />
                              </button>
                            )}
                          </div>

                          {/* Time and Delete */}
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                              <span className="text-[9px] font-mono">{formatTime(task.duration)}</span>
                              <Clock size={9} />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete "${task.name}"?`)) {
                                  onDeleteTask(task.id);
                                }
                              }}
                              className="p-0.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete task"
                            >
                              <Trash2 size={8} />
                            </button>
                          </div>
                        </div>

                        {/* Task name */}
                        <button
                          onClick={() => !task.completed && onStart(task.name)}
                          className={`text-xs font-semibold truncate text-left transition-colors ${task.completed ? 'line-through text-zinc-500 cursor-default' : 'group-hover:text-terminal-green'}`}
                        >
                          {task.name}
                        </button>

                        {/* Complete button */}
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className={`absolute bottom-2 right-2 p-1 rounded-md transition-all ${task.completed ? 'bg-green-500/20 text-green-500' : 'bg-black/5 dark:bg-white/5 text-zinc-500 hover:text-terminal-green'}`}
                        >
                          <CheckCircle size={11} fill={task.completed ? 'currentColor' : 'none'} className={task.completed ? 'text-green-500' : ''} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <motion.h2 className="text-2xl font-bold mb-3 tracking-tight">
                  {currentTask?.name}
                </motion.h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <Tag size={10} className="text-zinc-500" />
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${currentTask?.tagColor || 'bg-blue-500'}`}>
                            {currentTask?.tag}
                        </span>
                    </div>
                    {currentTask?.priority && (
                        <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${getPriorityColor(currentTask.priority)}`}>
                            <AlertCircle size={10} /> {t.priority[currentTask.priority]}
                        </div>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onToggle}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all group"
                >
                  {status === TaskStatus.FOCUSING ? <Pause size={18} className="text-zinc-900 dark:text-white group-hover:scale-110" /> : <Play size={18} className="text-zinc-900 dark:text-white group-hover:scale-110" />}
                </button>
                <button
                  onClick={() => currentTask && onToggleComplete(currentTask.id)}
                  className="w-12 h-12 rounded-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 flex items-center justify-center transition-all group"
                  title={t.dashboard.complete}
                >
                  <CheckCircle size={18} className="text-green-500 group-hover:scale-110" />
                </button>
                <button
                  onClick={onStop}
                  className="w-12 h-12 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all group"
                >
                  <Square size={16} className="text-red-500 fill-red-500 group-hover:scale-110" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskDialogSubmit}
        initialData={
          editingTask
            ? {
                name: editingTask.name,
                tag: editingTask.tag,
                tagColor: editingTask.tagColor,
                priority: editingTask.priority,
              }
            : undefined
        }
        mode={editingTask ? 'edit' : 'create'}
        t={t}
      />
    </motion.div>
  );
};

export default Dashboard;
