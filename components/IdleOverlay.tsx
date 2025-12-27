
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Briefcase, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import { Locales } from '../locales';

interface IdleOverlayProps {
  onResolve: (action: 'keep' | 'meeting' | 'rest' | 'discard') => void;
  t: Locales;
  idleTime: number; // in seconds
}

const IdleOverlay: React.FC<IdleOverlayProps> = ({ onResolve, t, idleTime }) => {
  const [selectedAction, setSelectedAction] = useState<'keep' | 'meeting' | 'rest' | 'discard' | null>(null);

  const formatIdleTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAction = (action: 'keep' | 'meeting' | 'rest' | 'discard') => {
    setSelectedAction(action);
    // Small delay for visual feedback
    setTimeout(() => {
      onResolve(action);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-retro-bg border border-terminal-green/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.15)] text-center"
      >
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-lg bg-terminal-amber/10 border border-terminal-amber/30 flex items-center justify-center mx-auto mb-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <AlertTriangle size={24} className="text-terminal-amber" />
          </motion.div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold font-mono mb-1.5 tracking-tight retro-glow">{t.idle.welcome}</h2>

        {/* Idle Time Display */}
        <div className="mb-6">
          <p className="text-xs text-zinc-400 mb-2">{t.idle.away}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-terminal-amber/10 border border-terminal-amber/30">
            <span className="text-2xl font-mono text-terminal-amber retro-glow">{formatIdleTime(idleTime)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAction('keep')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              selectedAction === 'keep'
                ? 'bg-terminal-green/20 border-terminal-green shadow-[0_0_15px_rgba(0,255,0,0.3)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-terminal-green/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              selectedAction === 'keep' ? 'bg-terminal-green text-black' : 'bg-terminal-green/10 text-terminal-green'
            }`}>
              <Briefcase size={16} />
            </div>
            <p className="text-xs font-bold font-mono uppercase tracking-wider">{t.idle.keep}</p>
          </button>

          <button
            onClick={() => handleAction('meeting')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              selectedAction === 'meeting'
                ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-purple-500/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              selectedAction === 'meeting' ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-500'
            }`}>
              <Sparkles size={16} />
            </div>
            <p className="text-xs font-bold font-mono uppercase tracking-wider">{t.idle.meeting}</p>
          </button>

          <button
            onClick={() => handleAction('rest')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              selectedAction === 'rest'
                ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-blue-500/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              selectedAction === 'rest' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'
            }`}>
              <Coffee size={16} />
            </div>
            <p className="text-xs font-bold font-mono uppercase tracking-wider">{t.idle.rest}</p>
          </button>

          <button
            onClick={() => handleAction('discard')}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              selectedAction === 'discard'
                ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-red-500/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              selectedAction === 'discard' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'
            }`}>
              <Trash2 size={16} />
            </div>
            <p className="text-xs font-bold font-mono uppercase tracking-wider">{t.idle.discard}</p>
          </button>
        </div>

        {/* Helper Text */}
        <p className="mt-4 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
          {t.idle.selectAction || 'Select an action to continue'}
        </p>
      </motion.div>
    </div>
  );
};

export default IdleOverlay;
