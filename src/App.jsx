import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Mic2, MessageSquare, BarChart3 } from 'lucide-react';
import CoachMode from './modes/CoachMode';
import InterviewMode from './modes/InterviewMode';
import Dashboard from './modes/Dashboard';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* App Header */}
        <header className="sticky top-0 z-50 glass-card mx-4 mt-4 mb-6 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-nvidia to-groq text-transparent bg-clip-text font-black text-2xl tracking-tighter">
              ⚡ VoiceUp
            </div>
            <div className="hidden sm:block text-xs font-medium text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700">
              Powered by NVIDIA + Groq AI
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-nvidia/50">
              <Mic2 className="w-4 h-4" />
              <span className="hidden sm:inline">Coach</span>
            </Link>
            <Link to="/interview" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-nvidia/50">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Interview</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-nvidia/50">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-12 flex flex-col">
          <Routes>
            <Route path="/" element={<CoachMode />} />
            <Route path="/interview" element={<InterviewMode />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
