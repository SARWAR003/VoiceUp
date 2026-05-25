import React from 'react';
import { Mic, Loader2, Volume2 } from 'lucide-react';

export default function MicButton({ state, onClick }) {
  // state can be: 'idle', 'listening', 'processing', 'speaking'

  const getStyles = () => {
    switch (state) {
      case 'listening':
        return 'bg-red-500/20 text-red-500 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse-fast';
      case 'processing':
        return 'bg-nvidia/20 text-nvidia border-nvidia';
      case 'speaking':
        return 'bg-blue-500/20 text-blue-500 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse-fast';
      default:
        return 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'processing':
        return <Loader2 className="w-10 h-10 animate-spin-slow" />;
      case 'speaking':
        return <Volume2 className="w-10 h-10 animate-bounce" />;
      default:
        return <Mic className="w-10 h-10" />;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={state === 'processing'}
      className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${getStyles()}`}
    >
      {getIcon()}
    </button>
  );
}
