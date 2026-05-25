import React from 'react';
import { Award, CheckCircle2, AlertTriangle, RefreshCcw, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SessionReport({ report, onRetry }) {
  if (!report) return null;

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-nvidia bg-nvidia/10 border-nvidia';
      case 'B': return 'text-green-500 bg-green-500/10 border-green-500';
      case 'C': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      default: return 'text-red-500 bg-red-500/10 border-red-500';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-card p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Interview Complete</h2>
        <div className={`inline-block px-6 py-2 rounded-full border-2 text-2xl font-black ${getGradeColor(report.grade)}`}>
          Grade: {report.grade}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center bg-gray-800/30">
          <Award className="w-10 h-10 text-nvidia mb-2" />
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Score</div>
          <div className="text-4xl font-black text-white">{report.overallScore}<span className="text-lg text-gray-500">/10</span></div>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 bg-gray-800/30">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Decision</h3>
          <div className={`text-2xl font-bold mb-2 ${report.hiringDecision.includes('Yes') ? 'text-nvidia' : 'text-red-400'}`}>
            {report.hiringDecision}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{report.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-950/20 border border-green-900/50 p-6 rounded-2xl">
          <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 /> Key Strengths
          </h4>
          <ul className="space-y-3">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-2xl">
          <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
            <AlertTriangle /> Areas to Improve
          </h4>
          <ul className="space-y-3">
            {report.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(report.weakestArea || report.strongestArea || report.nextStudyTopics) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 border-t-2 border-t-nvidia">
            <h4 className="font-bold text-gray-300 mb-2">Technical Analysis</h4>
            {report.strongestArea && (
              <div className="mb-2 text-sm">
                <span className="text-gray-500 uppercase tracking-wider text-xs block mb-1">Strongest Area</span>
                <span className="text-green-400">{report.strongestArea}</span>
              </div>
            )}
            {report.weakestArea && (
              <div className="text-sm">
                <span className="text-gray-500 uppercase tracking-wider text-xs block mb-1">Weakest Area</span>
                <span className="text-red-400">{report.weakestArea}</span>
              </div>
            )}
          </div>
          
          {report.nextStudyTopics && (
            <div className="glass-card p-6 border-t-2 border-t-blue-500">
              <h4 className="font-bold text-gray-300 mb-2">Recommended Study Topics</h4>
              <ul className="space-y-2">
                {report.nextStudyTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-blue-300 text-sm">
                    <span className="text-blue-500 mt-0.5">→</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700"
        >
          <RefreshCcw size={18} /> Try Again
        </button>
        <Link 
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-nvidia hover:bg-green-600 text-gray-950 font-bold transition-colors shadow-lg shadow-nvidia/20"
        >
          <LayoutDashboard size={18} /> View Dashboard
        </Link>
      </div>
    </div>
  );
}
