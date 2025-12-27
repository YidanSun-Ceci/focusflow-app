
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, History, X } from 'lucide-react';
import { TaskStatus, Task } from '../types';
import { formatTime } from '../utils';

interface MenuBarPopoverProps {
  status: TaskStatus;
  timer: number;
  currentTask: Task | null;
  recentTasks: Task[];
  onClose: () => void;
  onStartTask: (name: string) => void;
  onToggle: () => void;
  onStop: () => void;
}

const MenuBarPopover: React.FC<MenuBarPopoverProps> = ({
  status, timer, currentTask, recentTasks, onClose, onStartTask, onToggle, onStop
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="fixed top-14 right-4 w-72 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Now Active</span>
        <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400">
          <X size={14} />
        </button>
      </div>

      <div className="p-6 text-center">
        {status === TaskStatus.IDLE ? (
          <p className="text-sm text-zinc-500 py-4 italic">No active task</p>
        ) : (
          <>
            <h2 className="text-4xl font-mono mb-2">{formatTime(timer)}</h2>
            <p className="text-sm text-zinc-300 mb-6 truncate">{currentTask?.name}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onToggle}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                {status === TaskStatus.FOCUSING ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={onStop}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-500 transition-colors"
              >
                <Square size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-black/20 p-4">
        <div className="flex items-center gap-2 mb-3 text-zinc-500">
          <History size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Recents</span>
        </div>
        <div className="space-y-1">
          {recentTasks.slice(0, 3).map(task => (
            <button
              key={task.id}
              onClick={() => onStartTask(task.name)}
              className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors group flex items-center justify-between"
            >
              <span className="text-xs text-zinc-400 group-hover:text-zinc-200 truncate pr-2">{task.name}</span>
              <div className={`w-2 h-2 rounded-full ${task.tagColor}`} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuBarPopover;
