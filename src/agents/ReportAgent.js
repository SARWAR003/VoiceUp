import { groqLLM } from '../api/groqClient';
import { extractJSON } from '../utils/jsonHelper';

export class ReportAgent {
  async generateSessionReport(sessionData) {
    const systemPrompt = `You are ReportAgent. Generate a full session report as JSON based on the transcript and feedback history.
{
  "session_type": "coach | interview",
  "date": "YYYY-MM-DD",
  "duration_minutes": 0,
  "overall_score": number 0-10,
  "highlights": ["highlight 1", "highlight 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "recommended_exercises": ["exercise 1", "exercise 2"],
  "next_session_focus": "string"
}
Return ONLY valid JSON. No explanations.`;

    try {
      const response = await groqLLM(systemPrompt, JSON.stringify(sessionData), "llama-3.3-70b-versatile", true);
      return extractJSON(response);
    } catch (e) {
      console.error("ReportAgent Error:", e);
      return {
        session_type: sessionData.mode || "coach",
        date: new Date().toISOString().split('T')[0],
        duration_minutes: 5,
        overall_score: 7,
        highlights: ["Good effort completed"],
        improvements: ["Keep practicing"],
        recommended_exercises: ["Review transcript"],
        next_session_focus: "Clarity and confidence"
      };
    }
  }
}
