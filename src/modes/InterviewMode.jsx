import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Code, Users, Presentation, Target, BrainCircuit, LineChart } from 'lucide-react';
import CVUploader from '../cv/CVUploader';
import CVSummaryCard from '../cv/CVSummaryCard';
import VoiceSelector from '../components/VoiceSelector';
import MicButton from '../components/MicButton';
import LiveTranscript from '../components/LiveTranscript';
import ScoreCard from '../components/ScoreCard';
import SessionReport from '../components/SessionReport';
import { Orchestrator } from '../agents/orchestrator';
import { saveSession } from '../utils/sessionStorage';

const dsCurriculum = {
  "DA Phase (Data Analyst)": {
    "Basic Maths": ["Percentage, Ratio & Proportion", "Profit & Loss", "Linear Equations(LA)", "Quadratic Equations", "Set, Relations & Functions", "Basics of Probability", "Permutations and Combinations", "Conditional Probability", "Bayes Theorem", "Statistics", "Descriptive Statistics", "Measures of central tendency", "Measures of Variability"],
    "Spreadsheet": ["Basic of Data", "Introduction to Excel and Google Sheets", "Charts and Visualization", "Data Aggregation", "Pivot Charts", "Dashboarding", "Filters and Slicers", "Data Formatting", "Lookup functions", "What if Analysis"],
    "SQL": ["Introduction to Data & Databases", "Entities & Relations", "Types of Commands", "Filtering", "Wildcard operators", "Joins", "Subqueries", "Views", "Functions", "Windows Functions in SQL", "Window Frames", "Stored Procedures"],
    "Power BI": ["Introduction to PowerBI", "Power Query Editor", "MQuery", "Data Modeling", "Filter context", "Data Transformation", "Calculations and measures", "Different Charts", "AI-based Visualization", "Dashboarding", "Group BY Aggregation", "DAX", "RLS"]
  },
  "BA Phase (Business Analyst)": {
    "Python": ["Introduction to Programming", "Strings", "Control statements", "Lists and Tuples", "List comprehension", "Sets and Dictionaries", "Python Functions", "Recursion", "Searching and Sorting", "Lambda Function", "File handling", "Exception handling", "Oops"],
    "Python EDA 1": ["Python EDA (Exploratory Data Analysis)", "Basics of Probability", "Discrete and Continuous Probability distributions", "Probability Distribution Functions", "Expected Value", "Sampling methodologies", "Central Limit Theorem", "Hypothesis Testing", "Z-test and t-test", "AB Testing", "Power Analysis"],
    "Python EDA 2": ["Numpy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Regex (Regular Expressions)", "Web Scraping using Selenium", "API"]
  },
  "DS Phase (Data Scientist)": {
    "Supervised ML": ["Machine learning basics", "Simple Linear Regression", "Multi Linear Regression", "Logistic Regression", "KNN (k Nearest Neighbors)", "Naive Bayes", "SVM and its Kernels", "Decision Trees", "Ensemble Methods"],
    "Unsupervised ML": ["K-means", "Hierarchical clustering", "GMM", "DBSCAN", "Anomaly and Outlier Detection", "Dimensionality Reduction", "Recommendation System", "Time Series Forecasting (ARIMA models)"],
    "ML Ops": ["Github", "Self-serving apps using Streamlit", "Flask and FastAPI", "Docker and containerization", "Deployment of containers on the cloud"]
  }
};

export default function InterviewMode() {
  const [step, setStep] = useState(1); // 1: Setup, 2: Interview, 3: Report
  const [type, setType] = useState('HR Interview');
  const [company, setCompany] = useState('Acme Corp');
  const [role, setRole] = useState('Senior Engineer');
  const [voice, setVoice] = useState('Diego');
  const [dsLevel, setDsLevel] = useState('Fresher / DA Level');
  const [topicFocus, setTopicFocus] = useState(null);

  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  
  const [cvSummary, setCvSummary] = useState(null);
  
  const [state, setState] = useState('idle');
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [report, setReport] = useState(null);
  
  const orchestrator = useRef(null);
  const autoListen = useRef(true);

  const types = [
    { id: 'HR Interview', icon: <Users />, label: 'HR & Culture' },
    { id: 'Behavioural Interview', icon: <BrainCircuit />, label: 'Behavioural' },
    { id: 'Technical Interview', icon: <Code />, label: 'Technical' },
    { id: 'Sales Interview', icon: <Target />, label: 'Sales' },
    { id: 'Leadership Interview', icon: <Presentation />, label: 'Leadership' },
    { id: 'CV-Based Interview', icon: <Briefcase />, label: 'CV-Based' },
    { id: 'Data Science & Analytics', icon: <LineChart />, label: 'Data Science' },
  ];

  const topicMap = {
    'Technical Interview': ['React / Frontend', 'Node.js / Backend', 'System Design', 'DevOps / Cloud', 'Data Structures & Algorithms'],
    'Data Science & Analytics': ['SQL & Databases', 'Machine Learning', 'Python & Pandas', 'Statistics & Probability', 'Data Visualization'],
    'HR Interview': ['Cultural Fit', 'Conflict Resolution', 'Career Goals', 'Strengths & Weaknesses'],
    'Behavioural Interview': ['STAR Method Scenarios', 'Leadership Experience', 'Handling Failure', 'Time Management'],
    'Sales Interview': ['B2B Tech Sales', 'Objection Handling', 'Cold Calling', 'Account Executive Mock'],
    'Leadership Interview': ['Team Management', 'Strategic Vision', 'Cross-functional Collaboration', 'Performance Reviews']
  };

  const handleStart = async () => {
    setStep(2);
    setTranscript("");
    setFeedback(null);
    setReport(null);
    autoListen.current = true;
    
    orchestrator.current = new Orchestrator({
      onVolumeChange: () => {}, // simplified
      onStateChange: (newState) => {
        setState(newState);
        if (newState === 'idle' && autoListen.current) {
          setTimeout(() => {
            if (autoListen.current && orchestrator.current) {
              orchestrator.current.startListening();
            }
          }, 500);
        }
      },
      onTranscript: (res) => setTranscript(res.text),
      onInterviewFeedback: (res) => {
        setFeedback(res);
        if (res.sessionComplete && res.report) {
          autoListen.current = false;
          setReport(res.report);
          saveSession({
            type: 'interview',
            interviewType: type,
            score: res.report.overallScore,
            date: new Date().toISOString()
          });
          setTimeout(() => setStep(3), 3000); // Wait for TTS to finish before showing report
        }
      }
    });

    let finalTopicFocus = topicFocus;
    if (type === 'Data Science & Analytics') {
      if (selectedTopic) finalTopicFocus = `${selectedPhase} -> ${selectedModule} -> ${selectedTopic}`;
      else if (selectedModule) finalTopicFocus = `${selectedPhase} -> ${selectedModule}`;
      else if (selectedPhase) finalTopicFocus = `${selectedPhase}`;
    }

    orchestrator.current.setMode('interview', {
      type, company, role, voice, cvSummary, dsLevel, topicFocus: finalTopicFocus
    });
    
    await orchestrator.current.startInterview();
  };

  const handleMicClick = () => {
    if (state === 'idle') {
      autoListen.current = true;
      orchestrator.current.startListening();
    } else if (state === 'listening') {
      autoListen.current = false;
      orchestrator.current.stopListening();
    } else if (state === 'speaking') {
      autoListen.current = false;
      orchestrator.current.stopSpeaking();
    }
  };

  const handleFileExtracted = async (data, format, mimeType) => {
    try {
      const { CVAgent } = await import('../agents/cvAgent');
      const agent = new CVAgent();
      let summary;
      if (format === 'text') {
        summary = await agent.processCVText(data);
      } else {
        summary = await agent.processCVImage(data, mimeType);
      }
      setCvSummary(summary);
      if (summary.lastCompany) setCompany(summary.lastCompany);
      if (summary.suggestedRole) setRole(summary.suggestedRole);
    } catch (e) {
      console.error(e);
      alert("Failed to parse CV: " + e.message);
    }
  };

  if (step === 3) {
    return (
      <div className="pt-8">
        <SessionReport report={report} onRetry={() => setStep(1)} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center pt-8 w-full animate-fade-in">
        <div className="flex items-center gap-4 w-full max-w-2xl mb-8">
          {[1, 2, 3, 4, 5].map((q) => (
            <div key={q} className={`flex-1 h-2 rounded-full ${feedback?.questionNumber >= q ? 'bg-nvidia' : 'bg-gray-800'}`}></div>
          ))}
        </div>

        <div className="text-center mb-8 h-12 flex items-center justify-center">
          {state === 'processing' && <span className="text-nvidia animate-pulse">Interviewer is thinking...</span>}
          {state === 'speaking' && <span className="text-blue-400 animate-pulse">Interviewer is speaking...</span>}
          {state === 'listening' && <span className="text-red-400 animate-pulse">Listening...</span>}
        </div>

        <div className="mb-12">
          <MicButton state={state} onClick={handleMicClick} />
        </div>

        <LiveTranscript transcript={transcript} words={[]} />
        
        {feedback && !feedback.isOpening && (
          <div className="w-full max-w-2xl mt-6">
            <ScoreCard 
              scores={feedback.scores} 
              feedback={feedback.feedback} 
              followUp={feedback.followUp} 
            />
          </div>
        )}
      </div>
    );
  }

  // Setup Step
  return (
    <div className="w-full max-w-4xl mx-auto pt-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Setup Interview</h1>
        <p className="text-gray-400">Configure your mock interview parameters.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setType(t.id);
              setTopicFocus(null);
            }}
            className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${type === t.id ? 'bg-nvidia/10 border-nvidia text-nvidia shadow-sm shadow-nvidia/20' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}
          >
            <div className="mb-2">{t.icon}</div>
            <div className="text-sm font-bold">{t.label}</div>
          </button>
        ))}
      </div>

      {(type === 'CV-Based Interview' || type === 'Data Science & Analytics') && !cvSummary && (
        <div className="mb-8 animate-fade-in">
          <CVUploader onFileExtracted={handleFileExtracted} />
        </div>
      )}

      {(type === 'CV-Based Interview' || type === 'Data Science & Analytics') && cvSummary && (
        <div className="mb-8 animate-fade-in">
          <CVSummaryCard summary={cvSummary} onStart={() => {}} />
        </div>
      )}

      {type === 'Data Science & Analytics' && (
        <div className="mb-8 animate-fade-in bg-gray-800/30 p-6 rounded-xl border border-gray-700">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Curriculum Topic Selection</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Phase Dropdown */}
             <select 
               className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-nvidia"
               value={selectedPhase} 
               onChange={(e) => { setSelectedPhase(e.target.value); setSelectedModule(""); setSelectedTopic(""); }}
             >
               <option value="">Select Phase (Optional)</option>
               {Object.keys(dsCurriculum).map(phase => <option key={phase} value={phase}>{phase}</option>)}
             </select>

             {/* Module Dropdown */}
             <select 
               className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-nvidia"
               value={selectedModule} 
               onChange={(e) => { setSelectedModule(e.target.value); setSelectedTopic(""); }}
               disabled={!selectedPhase}
             >
               <option value="">Select Module (Optional)</option>
               {selectedPhase && Object.keys(dsCurriculum[selectedPhase]).map(mod => <option key={mod} value={mod}>{mod}</option>)}
             </select>

             {/* Topic Dropdown */}
             <select 
               className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-nvidia"
               value={selectedTopic} 
               onChange={(e) => setSelectedTopic(e.target.value)}
               disabled={!selectedModule}
             >
               <option value="">Select Specific Topic (Optional)</option>
               {selectedModule && dsCurriculum[selectedPhase][selectedModule].map(top => <option key={top} value={top}>{top}</option>)}
             </select>
          </div>
        </div>
      )}

      {type !== 'Data Science & Analytics' && topicMap[type] && (
        <div className="mb-8 animate-fade-in">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Interview Topic Focus (Optional)</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTopicFocus(null)}
              className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                !topicFocus
                  ? 'bg-nvidia/20 border-nvidia text-nvidia'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              All Topics (Mixed)
            </button>
            {topicMap[type].map(topic => (
              <button
                key={topic}
                onClick={() => setTopicFocus(topic)}
                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                  topicFocus === topic
                    ? 'bg-nvidia/20 border-nvidia text-nvidia' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Target Company</label>
          <input 
            type="text" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google, Acme Corp"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-nvidia focus:ring-1 focus:ring-nvidia transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Target Role</label>
          <input 
            type="text" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-nvidia focus:ring-1 focus:ring-nvidia transition-all"
          />
        </div>
      </div>

      <VoiceSelector selected={voice} onSelect={setVoice} />

      <button
        disabled={!company || !role || (type === 'CV-Based Interview' && !cvSummary)}
        onClick={handleStart}
        className="w-full bg-nvidia hover:bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-950 font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-nvidia/20"
      >
        Start Interview
      </button>
    </div>
  );
}
