import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
}

interface MenuBarPopupProps {
  currentTask: Task | null;
  recentTasks: Task[];
  timer: number;
  isActive: boolean;
  onStartTask: (taskName: string) => void;
  onStopTask: () => void;
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const MenuBarPopup: React.FC<MenuBarPopupProps> = ({
  currentTask,
  recentTasks,
  timer,
  isActive,
  onStartTask,
  onStopTask,
}) => {
  return (
    <div className="w-full h-full bg-zinc-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
      {/* Active Task Section */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Now Active
          </span>
          {isActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        {currentTask ? (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{currentTask.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${currentTask.tagColor} bg-opacity-20 text-white`}>
                  {currentTask.tag}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock size={14} />
                <span className="font-mono text-sm">{formatTime(timer)}</span>
              </div>

              <button
                onClick={onStopTask}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
              >
                <Square size={14} className="text-red-400" fill="currentColor" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <p className="text-zinc-500 text-sm italic">No active task</p>
          </div>
        )}
      </div>

      {/* Recent Tasks Section */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-zinc-500" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Recents
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentTasks.slice(0, 5).map((task) => (
            <button
              key={task.id}
              onClick={() => onStartTask(task.name)}
              className="w-full bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/5 hover:border-white/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">{task.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${task.tagColor} bg-opacity-20 text-white`}>
                      {task.tag}
                    </span>
                    {task.duration > 0 && (
                      <span className="text-xs text-zinc-500 font-mono">
                        {formatTime(task.duration)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {recentTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-600 text-sm">No recent tasks</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-white/[0.02]">
        <button
          onClick={() => {
            // Open main window
            if (window.__TAURI__) {
              window.__TAURI__.window.appWindow.hide();
              const mainWindow = window.__TAURI__.window.WebviewWindow.getByLabel('main');
              mainWindow?.show();
              mainWindow?.setFocus();
            }
          }}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-semibold transition-all"
        >
          Open Full App
        </button>
      </div>
    </div>
  );
};

export default MenuBarPopup;
