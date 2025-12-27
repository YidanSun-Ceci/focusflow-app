
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Command, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onSelect: (name: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center p-5 border-b border-white/5">
          <Search size={22} className="text-zinc-500 mr-4" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search tasks or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && onSelect(query)}
            className="w-full bg-transparent text-xl focus:outline-none placeholder:text-zinc-600"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/10 text-zinc-500 text-[10px] font-bold">
            <Command size={10} />
            K
          </div>
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto">
          {query ? (
             <button 
              onClick={() => onSelect(query)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <ArrowRight size={18} />
                </div>
                <div>
                  <p className="font-medium">Start task: <span className="text-blue-400">"{query}"</span></p>
                  <p className="text-xs text-zinc-500">Press Enter to begin focus session</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="p-8 text-center text-zinc-500">
              <p className="text-sm">Type to start a new task session...</p>
            </div>
          )}
        </div>
        
        <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">FocusFlow Command Center</span>
          <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-bold">
            <span className="flex items-center gap-1 uppercase tracking-tighter"><span className="px-1 py-0.5 rounded bg-white/5">ESC</span> Close</span>
            <span className="flex items-center gap-1 uppercase tracking-tighter"><span className="px-1 py-0.5 rounded bg-white/5">RET</span> Select</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;
