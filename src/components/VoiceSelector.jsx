import React from 'react';

export default function VoiceSelector({ selected, onSelect }) {
  const voices = [
    { id: 'Mia', name: 'Mia', desc: 'Friendly & Supportive', api: 'NVIDIA' },
    { id: 'Diego', name: 'Diego', desc: 'Professional & Direct', api: 'NVIDIA' },
    { id: 'Arista-PlayAI', name: 'Arista', desc: 'Warm & Natural', api: 'Groq' },
    { id: 'Atlas-PlayAI', name: 'Atlas', desc: 'Deep & Authoritative', api: 'Groq' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        Select Interviewer Voice
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {voices.map(v => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`p-3 rounded-xl border text-left transition-all ${selected === v.id ? 'border-nvidia bg-nvidia/10 shadow-sm shadow-nvidia/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}
          >
            <div className="font-bold text-white text-sm">{v.name}</div>
            <div className="text-xs text-gray-400 mt-1 truncate">{v.desc}</div>
            <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider inline-block px-2 py-0.5 rounded border ${v.api === 'NVIDIA' ? 'text-nvidia border-nvidia/30 bg-nvidia/10' : 'text-groq border-groq/30 bg-groq/10'}`}>
              {v.api}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
