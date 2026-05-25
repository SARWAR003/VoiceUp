import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Flame, Target, Download, Clock } from 'lucide-react';
import { AnalyticsAgent } from '../agents/analyticsAgent';
import { getSessions, getStreak } from '../utils/sessionStorage';
import { exportDashboardToPDF } from '../utils/exportPDF';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const data = getSessions();
    setSessions(data);
    setStreak(getStreak());

    if (data.length > 0) {
      const agent = new AnalyticsAgent();
      agent.generateWeeklyInsights().then(res => {
        setInsights(res);
        setLoadingInsights(false);
      });
    } else {
      setLoadingInsights(false);
    }
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    await exportDashboardToPDF('dashboard-content');
    setIsExporting(false);
  };

  // Mock data if no sessions
  const interviewData = sessions.filter(s => s.type === 'interview' && s.score).map((s, i) => ({
    name: `Int ${i+1}`,
    score: s.score
  }));
  const mockInterviewData = [
    { name: 'Int 1', score: 6 },
    { name: 'Int 2', score: 7.5 },
    { name: 'Int 3', score: 8 },
  ];
  const barData = interviewData.length > 0 ? interviewData : mockInterviewData;

  const fillerData = sessions.filter(s => s.type === 'coach').map((s, i) => ({
    name: `C${i+1}`,
    fillers: s.fillerCount || Math.floor(Math.random() * 5)
  }));
  const mockFillerData = [
    { name: 'C1', fillers: 12 },
    { name: 'C2', fillers: 8 },
    { name: 'C3', fillers: 5 },
    { name: 'C4', fillers: 2 },
  ];
  const lineData = fillerData.length > 0 ? fillerData : mockFillerData;

  const radarData = [
    { subject: 'Structure', A: sessions.length > 0 ? 80 : 60, fullMark: 100 },
    { subject: 'Clarity', A: sessions.length > 0 ? 85 : 70, fullMark: 100 },
    { subject: 'Confidence', A: sessions.length > 0 ? 75 : 65, fullMark: 100 },
    { subject: 'Pacing', A: sessions.length > 0 ? 90 : 80, fullMark: 100 },
    { subject: 'Relevance', A: sessions.length > 0 ? 85 : 75, fullMark: 100 },
  ];

  return (
    <div className="w-full pt-8 animate-fade-in" id="dashboard-content">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Performance Dashboard</h1>
          <p className="text-gray-400">Track your communication progress</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold border border-gray-700 transition-colors"
        >
          <Download size={18} />
          {isExporting ? "Exporting..." : "Download Report"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Sessions</div>
          <div className="text-3xl font-black text-white">{sessions.length}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Avg Score</div>
          <div className="text-3xl font-black text-nvidia">
            {sessions.length > 0 ? (sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length).toFixed(1) : '-'}
          </div>
        </div>
        <div className="glass-card p-6 border-nvidia/30">
          <div className="text-nvidia text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Flame size={16} /> Current Streak
          </div>
          <div className="text-3xl font-black text-white">{streak} days</div>
        </div>
        <div className="glass-card p-6 border-groq/30">
          <div className="text-groq text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Target size={16} /> Best Score
          </div>
          <div className="text-3xl font-black text-white">
            {sessions.length > 0 ? Math.max(...sessions.filter(s=>s.score).map(s => s.score)) : '-'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Radar Chart */}
        <div className="glass-card p-6 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 w-full text-left">Skill Radar</h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#9ca3af', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#76b900" fill="#76b900" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-2 glass-card p-6 border-t-4 border-t-blue-500 bg-gradient-to-b from-blue-900/10 to-transparent">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Brain size={18} /> AI Weekly Insights
          </h3>
          
          {loadingInsights ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Brain className="w-8 h-8 animate-pulse mb-3" />
              <p>Analyzing your patterns...</p>
            </div>
          ) : !insights ? (
            <div className="text-center text-gray-500 mt-10">
              Complete more sessions to generate insights.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Top Strength</div>
                  <div className="text-green-400 font-medium text-sm bg-green-950/30 p-3 rounded-lg border border-green-900/50">
                    {insights.topStrength}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Area to Improve</div>
                  <div className="text-amber-400 font-medium text-sm bg-amber-950/30 p-3 rounded-lg border border-amber-900/50">
                    {insights.topWeakness}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Tip of the week</div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {insights.weeklyTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Filler Word Trend (Coach Mode)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} />
                <Line type="monotone" dataKey="fillers" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#111827', stroke: '#f87171', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Interview Scores (Mock Interviews)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} domain={[0, 10]} />
                <Tooltip cursor={{fill: '#1f2937'}} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-4">Session History</h3>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="glass-card p-6 text-center text-gray-500">No sessions recorded yet. Start practicing!</div>
          ) : (
            sessions.slice().reverse().map((session, index) => (
              <div key={index} className="glass-card p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${session.type === 'interview' ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white capitalize">{session.type} Session</h4>
                    <p className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  {session.score && <div className="text-xl font-black text-white">{session.score.toFixed(1)} <span className="text-gray-500 text-sm">/ 10</span></div>}
                  {session.fillerCount !== undefined && <div className="text-sm text-gray-400">{session.fillerCount} fillers</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
