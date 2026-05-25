import { SpeechAgent } from './speechAgent';
import { CoachAgent } from './coachAgent';
import { InterviewAgent } from './interviewAgent';
import { ReportAgent } from './ReportAgent';

export class Orchestrator {
  constructor(callbacks) {
    this.callbacks = callbacks;
    // callbacks: onStateChange, onTranscript, onCoachFeedback, onInterviewFeedback
    this.speechAgent = new SpeechAgent(callbacks.onVolumeChange, callbacks.onStateChange, this.handleTranscript.bind(this));
    this.coachAgent = new CoachAgent();
    this.reportAgent = new ReportAgent();
    this.interviewAgent = null;
    this.mode = 'coach'; // 'coach' or 'interview'
    this.currentVoice = "Mia";
    this.sessionHistory = [];
    this.startTime = Date.now();
  }

  setMode(mode, options = {}) {
    this.mode = mode;
    if (mode === 'interview') {
      this.interviewAgent = new InterviewAgent(options.type, options.company, options.role, options.cvSummary, options.dsLevel);
      this.currentVoice = options.voice || "Diego";
    } else {
      this.currentVoice = "Mia";
    }
  }

  async startInterview() {
    if (this.mode === 'interview' && this.interviewAgent) {
      this.callbacks.onStateChange('processing');
      const response = await this.interviewAgent.getNextResponse(null);
      this.callbacks.onInterviewFeedback(response);
      await this.speechAgent.speak(response.text, this.currentVoice, response.emotion);
    }
  }

  startListening() {
    this.speechAgent.startListening();
  }

  stopListening() {
    this.speechAgent.stopListening();
  }

  stopSpeaking() {
    this.speechAgent.stopSpeaking();
  }

  async handleTranscript(result) {
    this.callbacks.onTranscript(result);
    
    // Only process final transcripts through AI agents
    if (result.isInterim) {
      return;
    }
    
    if (!result.text || result.text.trim() === '') {
      this.callbacks.onStateChange('idle');
      return;
    }

    const cleanText = result.text.trim().toLowerCase().replace(/[^a-z\s]/g, '');
    const hallucinations = ['thank you', 'thanks for watching', 'thank you for watching', 'subscribe', 'bye'];
    if (hallucinations.includes(cleanText)) {
      console.log("Ignored Whisper hallucination:", result.text);
      this.callbacks.onStateChange('idle');
      return;
    }

    const durationSeconds = result.duration || 5; // Fallback to 5 if undefined
    
    if (this.mode === 'coach') {
      const feedback = await this.coachAgent.analyzeSpeech(result.text, result.words || [], durationSeconds);
      this.sessionHistory.push({ role: 'user', content: result.text });
      this.sessionHistory.push({ role: 'assistant', content: JSON.stringify(feedback) });
      
      this.callbacks.onCoachFeedback(feedback);
      await this.speechAgent.speak(feedback.feedback[0] + " " + feedback.encouragement, this.currentVoice, feedback.emotion);
    } else if (this.mode === 'interview') {
      const response = await this.interviewAgent.getNextResponse(result.text);
      this.sessionHistory.push({ role: 'user', content: result.text });
      this.sessionHistory.push({ role: 'assistant', content: JSON.stringify(response) });
      
      this.callbacks.onInterviewFeedback(response);
      
      let textToSpeak = response.feedback + " ";
      if (response.followUp) textToSpeak += response.followUp;
      else if (response.nextQuestion) textToSpeak += response.nextQuestion;
      
      if (response.sessionComplete) {
        textToSpeak = response.report.summary;
      }
      
      await this.speechAgent.speak(textToSpeak, this.currentVoice, response.emotion);
    }
  }

  async generateFinalReport() {
    this.callbacks.onStateChange('processing');
    const durationMinutes = Math.round((Date.now() - this.startTime) / 60000);
    const reportData = await this.reportAgent.generateSessionReport({
      mode: this.mode,
      duration: durationMinutes,
      history: this.sessionHistory
    });
    this.callbacks.onStateChange('idle');
    return reportData;
  }
}
