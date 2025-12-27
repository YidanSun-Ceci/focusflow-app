import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Clock, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { Locales } from '../locales';

interface WelcomeScreenProps {
  t: Locales;
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ t, onComplete }) => {
  const [step, setStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Clock,
      title: t.welcome?.feature1Title || 'Deep Focus Timer',
      desc: t.welcome?.feature1Desc || 'Track your focus sessions with precision',
      color: 'text-emerald-500 dark:text-terminal-green'
    },
    {
      icon: BarChart3,
      title: t.welcome?.feature2Title || 'Analytics & Insights',
      desc: t.welcome?.feature2Desc || 'Visualize your productivity patterns',
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      icon: Sparkles,
      title: t.welcome?.feature3Title || 'AI Assistant',
      desc: t.welcome?.feature3Desc || 'Get smart suggestions for better focus',
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      icon: Zap,
      title: t.welcome?.feature4Title || 'Task Management',
      desc: t.welcome?.feature4Desc || 'Organize and track all your tasks',
      color: 'text-amber-500 dark:text-amber-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-zinc-50 dark:bg-background-dark flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(16,185,129,0.1)_1px,_transparent_1px)] dark:bg-[linear-gradient(rgba(0,255,0,0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,0,0.1)_1px,_transparent_1px)]" style={{
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-2xl w-full px-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Terminal Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-50 dark:bg-terminal-green/10 border-2 border-emerald-200 dark:border-terminal-green/30 flex items-center justify-center"
              >
                <Terminal size={40} className="text-emerald-600 dark:text-terminal-green" />
              </motion.div>

              {/* App Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <h1 className="text-5xl font-bold font-mono tracking-tight mb-2 text-zinc-900 dark:text-white dark:retro-glow">
                  FocusFlow
                  <span className={`inline-block w-1 h-12 ml-2 bg-emerald-600 dark:bg-terminal-green ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.3em] font-bold">
                  {t.welcome?.tagline || 'Deep Work. Simplified.'}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed"
              >
                {t.welcome?.description || 'A minimalist productivity tool designed for developers and deep thinkers. Track your focus, analyze your patterns, and optimize your workflow.'}
              </motion.p>

              {/* Start Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={() => setStep(1)}
                className="group px-8 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-terminal-green dark:hover:bg-terminal-green-dim text-white dark:text-black rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30 dark:shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-emerald-500/50 dark:hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] flex items-center gap-2 mx-auto"
              >
                {t.welcome?.getStarted || 'Get Started'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Skip Link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={onComplete}
                className="mt-4 text-xs text-zinc-500 hover:text-emerald-600 dark:text-zinc-600 dark:hover:text-terminal-green transition-colors uppercase tracking-widest font-bold"
              >
                {t.welcome?.skip || 'Skip Intro →'}
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold font-mono mb-2 text-zinc-900 dark:text-white dark:retro-glow">
                {t.welcome?.featuresTitle || 'Key Features'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.3em] font-bold mb-8">
                {t.welcome?.featuresSubtitle || 'Everything you need to stay focused'}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-xl hover:border-emerald-300 dark:hover:border-terminal-green/30 transition-all group shadow-sm dark:shadow-none"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/[0.05] flex items-center justify-center mb-3 mx-auto ${feature.color}`}>
                      <feature.icon size={20} />
                    </div>
                    <h3 className="text-sm font-bold mb-1 text-zinc-900 dark:text-white">{feature.title}</h3>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onComplete}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-terminal-green dark:hover:bg-terminal-green-dim text-white dark:text-black rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30 dark:shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-emerald-500/50 dark:hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] flex items-center gap-2 mx-auto"
              >
                {t.welcome?.continue || 'Start FocusFlow'}
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-0 right-0 text-center text-[9px] text-zinc-400 dark:text-zinc-700 uppercase tracking-widest font-bold"
      >
        Version 1.1.0 · Made with <span className="text-emerald-600 dark:text-terminal-green">█</span> by Ceci
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
