import React from 'react';

export default function WaveformVisualizer({ audioData, isListening }) {
  const bars = 5;
  const data = audioData || new Uint8Array(bars).fill(10); // default low value

  // Only take a few samples for the UI representation
  const sample = Array.from({ length: bars }).map((_, i) => {
    if (!isListening) return 10;
    const value = data[Math.floor(i * (data.length / bars))] || 10;
    return Math.max(10, value);
  });

  return (
    <div className="flex items-end justify-center gap-2 h-16 w-full">
      {sample.map((val, idx) => {
        const height = (val / 255) * 100; // Percentage
        return (
          <div
            key={idx}
            className={`w-4 rounded-full transition-all duration-75 ${isListening ? 'bg-red-500' : 'bg-gray-700'}`}
            style={{ height: `${height}%`, minHeight: '10%' }}
          ></div>
        );
      })}
    </div>
  );
}
