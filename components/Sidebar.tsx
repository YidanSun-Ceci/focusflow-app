
import React from 'react';
import { Timer, BarChart2, History, Sparkles, Settings, Terminal } from 'lucide-react';
import { ViewType } from '../types';
import { Locales } from '../locales';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onShowWelcome?: () => void;
  t: Locales;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onShowWelcome, t }) => {
  const navItems = [
    { id: 'dashboard', icon: Timer, label: t.nav.dashboard },
    { id: 'analytics', icon: BarChart2, label: t.nav.analytics },
    { id: 'history', icon: History, label: t.nav.history },
    { id: 'assistant', icon: Sparkles, label: t.nav.assistant },
    { id: 'settings', icon: Settings, label: t.nav.settings },
  ];

  return (
    <nav className="w-20 bg-white/80 dark:bg-white/[0.01] backdrop-blur-3xl border-r border-zinc-200 dark:border-white/5 flex flex-col items-center py-8 gap-8">
      {/* Welcome Screen Button at the top */}
      <button
        onClick={onShowWelcome}
        className="group relative p-3 rounded-xl transition-all duration-300 text-emerald-600 dark:text-terminal-green hover:bg-emerald-50 dark:hover:bg-terminal-green/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_20px_rgba(0,255,0,0.2)] border border-emerald-200 dark:border-terminal-green/20 hover:border-emerald-300 dark:hover:border-terminal-green/40"
        title="Show Welcome Screen"
      >
        <Terminal size={22} strokeWidth={2.5} />

        {/* Tooltip */}
        <span className="absolute left-16 px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5">
          {t.nav.welcome || 'Welcome'}
        </span>
      </button>

      {/* Divider */}
      <div className="w-10 h-px bg-zinc-200 dark:bg-white/5"></div>

      {/* Navigation Items */}
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id as ViewType)}
          className={`group relative p-3 rounded-xl transition-all duration-300 ${
            activeView === item.id
              ? 'bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-white shadow-sm dark:shadow-none'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'
          }`}
        >
          <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />

          {/* Tooltip */}
          <span className="absolute left-16 px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
