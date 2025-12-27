import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MenuBarPopup from './MenuBarPopup';
import { TaskStatus } from './types';

interface Task {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  duration: number;
  lastActive: number;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const MenuBarApp: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [savedTasks, setSavedTasks] = useState<Task[]>([]);
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.IDLE);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('focusflow_tasks');
    if (stored) {
      try {
        setSavedTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tasks');
      }
    }

    const storedCurrent = localStorage.getItem('focusflow_current_task');
    if (storedCurrent) {
      try {
        setCurrentTask(JSON.parse(storedCurrent));
      } catch (e) {
        console.error('Failed to load current task');
      }
    }

    const storedTimer = localStorage.getItem('focusflow_timer');
    if (storedTimer) {
      setTimer(parseInt(storedTimer, 10));
    }

    const storedStatus = localStorage.getItem('focusflow_status');
    if (storedStatus) {
      setStatus(storedStatus as TaskStatus);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (status === TaskStatus.FOCUSING) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev + 1;
          localStorage.setItem('focusflow_timer', String(newTimer));
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Listen for storage changes from main window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'focusflow_tasks' && e.newValue) {
        setSavedTasks(JSON.parse(e.newValue));
      }
      if (e.key === 'focusflow_current_task' && e.newValue) {
        setCurrentTask(JSON.parse(e.newValue));
      }
      if (e.key === 'focusflow_timer' && e.newValue) {
        setTimer(parseInt(e.newValue, 10));
      }
      if (e.key === 'focusflow_status' && e.newValue) {
        setStatus(e.newValue as TaskStatus);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStartTask = (taskName: string) => {
    const existing = savedTasks.find(t => t.name.toLowerCase() === taskName.toLowerCase());
    const newTask: Task = existing || {
      id: Math.random().toString(36).substring(7),
      name: taskName,
      tag: 'General',
      tagColor: 'bg-green-500',
      duration: 0,
      lastActive: Date.now(),
      priority: 'medium',
      completed: false
    };

    setCurrentTask(newTask);
    setTimer(newTask.duration);
    setStatus(TaskStatus.FOCUSING);

    // Save to localStorage
    localStorage.setItem('focusflow_current_task', JSON.stringify(newTask));
    localStorage.setItem('focusflow_timer', String(newTask.duration));
    localStorage.setItem('focusflow_status', TaskStatus.FOCUSING);

    // Hide popup
    if (window.__TAURI__) {
      window.__TAURI__.window.appWindow.hide();
    }
  };

  const handleStopTask = () => {
    if (currentTask) {
      // Update task duration
      const updatedTask = { ...currentTask, duration: timer, lastActive: Date.now() };
      const updatedTasks = savedTasks.map(t =>
        t.id === currentTask.id ? updatedTask : t
      );

      if (!savedTasks.find(t => t.id === currentTask.id)) {
        updatedTasks.unshift(updatedTask);
      }

      setSavedTasks(updatedTasks);
      localStorage.setItem('focusflow_tasks', JSON.stringify(updatedTasks));
    }

    setStatus(TaskStatus.IDLE);
    setTimer(0);
    setCurrentTask(null);

    localStorage.setItem('focusflow_status', TaskStatus.IDLE);
    localStorage.setItem('focusflow_timer', '0');
    localStorage.removeItem('focusflow_current_task');
  };

  const recentTasks = savedTasks
    .filter(t => !t.completed)
    .sort((a, b) => b.lastActive - a.lastActive);

  return (
    <div className="w-screen h-screen bg-transparent">
      <MenuBarPopup
        currentTask={currentTask}
        recentTasks={recentTasks}
        timer={timer}
        isActive={status === TaskStatus.FOCUSING}
        onStartTask={handleStartTask}
        onStopTask={handleStopTask}
      />
    </div>
  );
};

// Mount the app
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <MenuBarApp />
    </React.StrictMode>
  );
}
