import React from 'react';

export default function ScoreCard({ scores, feedback, followUp }) {
  if (!scores) return null;

  const renderBar = (label, score) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${score > 7 ? 'bg-nvidia' : score > 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="glass-card p-6 animate-fade-in border-l-4 border-l-groq">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        Evaluation
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          {Object.entries(scores).map(([key, score]) => {
            // Convert camelCase to Title Case (e.g., technicalAccuracy -> Technical Accuracy)
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return <React.Fragment key={key}>{renderBar(label, score)}</React.Fragment>;
          })}
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-sm text-gray-300">
            {feedback}
          </div>
          {followUp && (
            <div className="bg-groq/10 border border-groq/30 p-4 rounded-xl text-groq text-sm font-medium">
              <strong className="block text-xs uppercase tracking-wider mb-1">Follow up:</strong>
              {followUp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
