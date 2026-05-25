import React, { useState, useEffect, useRef } from 'react';
import TopicPills from '../components/TopicPills';
import MicButton from '../components/MicButton';
import WaveformVisualizer from '../components/WaveformVisualizer';
import LiveTranscript from '../components/LiveTranscript';
import FeedbackCard from '../components/FeedbackCard';
import { Orchestrator } from '../agents/orchestrator';
import { saveSession } from '../utils/sessionStorage';

export default function CoachMode() {
  const [topic, setTopic] = useState("Self Introduction");
  const [state, setState] = useState('idle'); // idle, listening, processing, speaking
  const [audioData, setAudioData] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [words, setWords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  
  const orchestrator = useRef(null);

  useEffect(() => {
    orchestrator.current = new Orchestrator({
      onVolumeChange: setAudioData,
      onStateChange: setState,
      onTranscript: (res) => {
        setTranscript(res.text);
        setWords(res.words || []);
      },
      onCoachFeedback: setFeedback
    });
    orchestrator.current.setMode('coach');

    return () => {
      if (orchestrator.current) {
        orchestrator.current.stopListening();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (state === 'idle') {
      setTranscript("");
      setWords([]);
      setFeedback(null);
      orchestrator.current.startListening();
    } else if (state === 'listening') {
      orchestrator.current.stopListening();
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 w-full animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">AI Communication Coach</h1>
        <p className="text-gray-400 text-lg">Master your speaking skills with real-time feedback</p>
      </div>

      <TopicPills selectedTopic={topic} onSelect={setTopic} />

      <div className="mt-16 mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {state === 'listening' && (
            <div className="w-64 h-64 rounded-full border border-red-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          )}
        </div>
        <MicButton state={state} onClick={handleMicClick} />
      </div>

      <div className="w-full max-w-sm mb-8">
        <WaveformVisualizer audioData={audioData} isListening={state === 'listening'} />
      </div>

      <LiveTranscript transcript={transcript} words={words} />

      {feedback && <FeedbackCard feedback={feedback} />}

      {feedback && (
        <button 
          onClick={async () => {
            const finalReport = await orchestrator.current.generateFinalReport();
            saveSession({
              type: 'coach',
              score: finalReport.overall_score || 7,
              fillerCount: feedback.fillerCount || 0,
              date: new Date().toISOString()
            });
            alert("Session Ended! Report saved to Dashboard.");
          }}
          className="mt-8 px-6 py-3 bg-red-900/50 hover:bg-red-800 text-red-200 rounded-xl border border-red-700 font-bold transition-colors"
        >
          End Session & Save Report
        </button>
      )}
    </div>
  );
}
