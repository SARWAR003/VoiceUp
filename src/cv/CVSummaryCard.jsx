import React from 'react';
import { Briefcase, GraduationCap, Building2, Target } from 'lucide-react';

export default function CVSummaryCard({ summary, onStart }) {
  if (!summary) return null;

  return (
    <div className="glass-card p-6 border-nvidia/30 shadow-nvidia/5 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{summary.name}</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Briefcase size={16} />
            <span>{summary.currentRole} • {summary.totalExperience}</span>
          </div>
        </div>
        {summary.education && (
          <div className="flex items-center gap-2 text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <GraduationCap size={14} className="text-groq" />
            <span className="text-gray-300">{summary.education}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {summary.topSkills.map((skill, idx) => (
              <span key={idx} className="bg-gray-800/80 text-gray-200 border border-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Projects</h3>
          <ul className="space-y-2">
            {summary.keyProjects.map((proj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-nvidia mt-1">•</span>
                <span>{proj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target size={14} /> Interview Focus Areas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {summary.interviewFocus.slice(0, 4).map((focus, idx) => (
              <div key={idx} className="bg-nvidia/10 border border-nvidia/20 text-nvidia px-3 py-2 rounded-lg text-sm text-center">
                {focus}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
