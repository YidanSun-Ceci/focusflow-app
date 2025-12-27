
export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'FOCUSING': return 'text-blue-400 shadow-blue-500/20';
    case 'PAUSED': return 'text-amber-400 shadow-amber-500/20';
    default: return 'text-zinc-500';
  }
};
