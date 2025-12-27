
import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { Locales } from '../locales';
import { formatTime } from '../utils';
import { Clock, Calendar, CheckCircle2, Circle, Download } from 'lucide-react';

const HistoryView: React.FC<{ history: Task[], t: Locales, totalTime: number }> = ({ history, t, totalTime }) => {
  const sortedHistory = [...history].sort((a, b) => b.lastActive - a.lastActive);

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalTime: totalTime,
      totalTasks: history.length,
      completedTasks: history.filter(t => t.completed).length,
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto py-8"
    >
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">{t.history.title}</h1>
          <p className="text-zinc-500 text-xs">{t.history.subtitle}</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-right backdrop-blur-md">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500/60 mb-0.5">{t.history.globalTotal}</p>
          <p className="text-2xl font-mono text-blue-500 leading-none">{formatTime(totalTime)}</p>
        </div>
      </header>

      {sortedHistory.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
          <p className="text-zinc-600 italic text-xs">{t.history.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedHistory.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] transition-colors group ${task.completed ? 'border-green-500/10' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${task.tagColor} flex items-center justify-center text-white relative`}>
                    <Clock size={14} />
                    {task.completed && (
                      <div className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full border-2 border-zinc-900">
                        <CheckCircle2 size={10} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm ${task.completed ? 'text-zinc-400 line-through' : ''}`}>{task.name}</h3>
                      {task.completed && (
                        <span className="text-[7px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                          {t.history.completed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(task.lastActive).toLocaleDateString()}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5">{task.tag}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-0.5">{t.history.totalTime}</p>
                  <p className={`text-lg font-mono ${task.completed ? 'text-zinc-500' : 'text-blue-400'}`}>{formatTime(task.duration)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryView;
