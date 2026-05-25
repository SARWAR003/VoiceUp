import React, { useEffect, useRef } from 'react';

export default function LiveTranscript({ transcript, words }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const renderWords = () => {
    if (!words || words.length === 0) return <span>{transcript}</span>;
    const fillerList = ['um', 'uh', 'like', 'basically', 'actually', 'literally', 'so', 'right', 'okay', 'well', 'just', 'you know'];

    return words.map((w, i) => {
      const cleanWord = w.word.toLowerCase().replace(/[^a-z]/g, '');
      const isFiller = fillerList.includes(cleanWord);
      
      return (
        <span 
          key={i} 
          className={`mr-1 ${isFiller ? 'text-red-400 font-bold bg-red-900/30 px-1 rounded' : 'text-gray-200'} border-b border-gray-800/50 hover:border-gray-500 transition-colors cursor-default`}
          title={`Start: ${w.start}s, End: ${w.end}s`}
        >
          {w.word}
        </span>
      );
    });
  };

  return (
    <div 
      ref={scrollRef}
      className="w-full max-w-2xl h-32 glass-card p-4 overflow-y-auto text-lg leading-relaxed shadow-inner"
    >
      {!transcript ? (
        <p className="text-gray-500 italic text-center mt-6">Start speaking to see transcript...</p>
      ) : (
        renderWords()
      )}
    </div>
  );
}
