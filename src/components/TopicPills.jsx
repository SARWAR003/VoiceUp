import React from 'react';

export default function TopicPills({ selectedTopic, onSelect }) {
  const topics = [
    "Self Introduction",
    "Storytelling",
    "Persuasion & Negotiation",
    "Explaining a Concept",
    "Small Talk",
    "Public Speaking",
    "Debate & Arguments",
    "Job Pitch"
  ];

  return (
    <div className="w-full max-w-4xl overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex gap-2 w-max mx-auto px-4">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedTopic === t 
                ? 'bg-nvidia text-gray-950 shadow-[0_0_15px_rgba(118,185,0,0.4)]' 
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500 hover:bg-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
