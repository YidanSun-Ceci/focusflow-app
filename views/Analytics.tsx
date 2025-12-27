
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, Clock, Zap, Activity } from 'lucide-react';
import { Task, AnalyticsData } from '../types';
import { getFocusInsights } from '../geminiService';
import { Locales } from '../locales';
import { formatTime } from '../utils';

const Analytics: React.FC<{ history: Task[], t: Locales }> = ({ history, t }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing your work patterns...');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchInsights = async () => {
      const insight = await getFocusInsights(history);
      setAiAdvice(insight);
    };
    fetchInsights();
  }, [history]);

  const totalSeconds = history.reduce((acc, task) => acc + task.duration, 0);

  // Convert Tailwind color class to hex color
  const getHexColor = (tailwindClass: string): string => {
    const colorMap: { [key: string]: string } = {
      'bg-pink-500': '#ec4899',
      'bg-blue-500': '#3b82f6',
      'bg-purple-500': '#a855f7',
      'bg-green-500': '#22c55e',
      'bg-orange-500': '#f97316',
      'bg-indigo-500': '#6366f1',
      'bg-cyan-500': '#06b6d4',
      'bg-gray-500': '#6b7280',
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-teal-500': '#14b8a6',
      'bg-violet-500': '#8b5cf6',
    };
    return colorMap[tailwindClass] || '#6b7280'; // Default to gray
  };

  // Calculate actual task distribution by tag
  const tagStats: { [key: string]: { duration: number; color: string } } = {};
  history.forEach(task => {
    if (!tagStats[task.tag]) {
      tagStats[task.tag] = { duration: 0, color: task.tagColor };
    }
    tagStats[task.tag].duration += task.duration;
  });

  const chartData: AnalyticsData[] = Object.entries(tagStats)
    .map(([tag, stats]) => ({
      category: tag,
      value: totalSeconds > 0 ? Math.round((stats.duration / totalSeconds) * 100) : 0,
      color: getHexColor(stats.color)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 categories

  // Calculate efficiency (tasks completed vs started)
  const completedTasks = history.filter(t => t.completed).length;
  const totalTasks = history.length;
  const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate average session time
  const activeTasks = history.filter(t => t.duration > 0);
  const avgSessionSeconds = activeTasks.length > 0
    ? Math.round(activeTasks.reduce((acc, t) => acc + t.duration, 0) / activeTasks.length)
    : 0;

  // Generate heatmap from actual task data (last 7 days)
  const heatmap = Array.from({ length: 24 }).map((_, hour) => {
    const tasksInHour = history.filter(task => {
      const taskHour = new Date(task.lastActive).getHours();
      return taskHour === hour && task.duration > 0;
    });
    const totalDuration = tasksInHour.reduce((sum, task) => sum + task.duration, 0);
    // Normalize to 0-4 scale
    const intensity = totalDuration > 0 ? Math.min(4, Math.ceil(totalDuration / 1800)) : 0;
    return { hour, intensity };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">{t.analytics.title}</h1>
        <p className="text-zinc-500 text-xs">{t.analytics.subtitle}</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Clock, label: t.analytics.summary.totalFocus, value: formatTime(totalSeconds), color: 'text-blue-400' },
          { icon: Zap, label: t.analytics.summary.efficiency, value: `${efficiency}%`, color: 'text-amber-400' },
          { icon: Activity, label: t.analytics.summary.avgSession, value: formatTime(avgSessionSeconds), color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl p-4">
            <stat.icon className={`${stat.color} mb-3`} size={16} />
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-mono mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Distribution Chart */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col min-w-0">
          <h3 className="text-base font-semibold mb-6">{t.analytics.timeDist}</h3>
          <div className="h-56 w-full relative min-h-[14rem]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-around mt-3">
            {chartData.map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-[8px] uppercase font-bold text-zinc-500 mb-1">{d.category}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-semibold">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl p-6 flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Sparkles size={18} />
          </div>
          <h3 className="text-base font-semibold mb-3">{t.analytics.aiTitle}</h3>
          <p className="text-zinc-400 leading-relaxed text-xs italic font-medium">
            "{aiAdvice}"
          </p>
          <div className="mt-auto pt-6">
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-blue-500" />
             </div>
             <p className="text-[8px] mt-2 text-zinc-500 uppercase font-bold tracking-widest text-right">Progressive Growth</p>
          </div>
        </div>
      </div>

      {/* Focus Map */}
      <div className="bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-semibold mb-6">{t.analytics.intensity}</h3>
        <div className="flex gap-1 h-10 items-end">
          {heatmap.map((item, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t-sm transition-all duration-700 ${
                item.intensity === 0 ? 'bg-zinc-200 dark:bg-zinc-900 h-1' :
                item.intensity === 1 ? 'bg-blue-900/40 h-1/4' :
                item.intensity === 2 ? 'bg-blue-700/60 h-2/4' :
                item.intensity === 3 ? 'bg-blue-500/80 h-3/4' : 'bg-blue-400 h-full'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
