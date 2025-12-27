
export enum TaskStatus {
  IDLE = 'IDLE',
  FOCUSING = 'FOCUSING',
  PAUSED = 'PAUSED',
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  duration: number; // in seconds
  lastActive: number;
  priority: TaskPriority;
  completed?: boolean;
}

export interface AnalyticsData {
  category: string;
  value: number;
  color: string;
}

export type ViewType = 'dashboard' | 'analytics' | 'history' | 'assistant' | 'settings';
