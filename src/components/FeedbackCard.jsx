import React from 'react';
import { Gauge, Zap, TrendingUp, ThumbsUp } from 'lucide-react';

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="w-full max-w-2xl glass-card p-6 mt-6 animate-fade-in border-t-4 border-t-nvidia">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div className="flex gap-2">
          {feedback.fillerCount > 0 ? (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Zap size={14} /> {feedback.fillerCount} Fillers
            </div>
          ) : (
            <div className="bg-green-900/30 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <ThumbsUp size={14} /> Clean Speech
            </div>
          )}
          
          <div className="bg-blue-900/30 border border-blue-500/50 text-blue-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 capitalize">
            {feedback.tone} Tone
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Clarity</div>
            <div className="text-2xl font-black text-white">{feedback.clarity}<span className="text-sm text-gray-500">/10</span></div>
          </div>
          <Gauge className={`w-8 h-8 ${feedback.clarity > 7 ? 'text-nvidia' : feedback.clarity > 4 ? 'text-yellow-500' : 'text-red-500'}`} />
        </div>
      </div>

      <div className="space-y-4">
        {feedback.mistakes_identified && feedback.mistakes_identified.length > 0 && (
          <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              Mistakes Identified
            </h4>
            <ul className="space-y-2">
              {feedback.mistakes_identified.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-200/80 text-sm">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.corrected_version && (
          <div className="bg-green-950/20 border border-green-900/30 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              How to say it better (Corrected Version)
            </h4>
            <p className="text-green-100/90 italic text-lg leading-relaxed">
              "{feedback.corrected_version}"
            </p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <TrendingUp size={14} /> Actionable Feedback
          </h4>
          <ul className="space-y-2">
            {feedback.feedback.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-200">
                <span className="text-nvidia mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-nvidia/10 border border-nvidia/30 p-4 rounded-xl text-nvidia font-medium flex items-center gap-3">
          <ThumbsUp className="w-5 h-5 flex-shrink-0" />
          <p>{feedback.encouragement}</p>
        </div>
      </div>
    </div>
  );
}
