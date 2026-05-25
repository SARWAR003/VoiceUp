import { openrouterLLM } from '../api/openrouterClient';
import { getLastNSessions } from '../utils/sessionStorage';
import { extractJSON } from '../utils/jsonHelper';

export class AnalyticsAgent {
  async generateWeeklyInsights() {
    const sessions = getLastNSessions(5);
    if (sessions.length === 0) return null;

    const systemPrompt = `Analyze these coaching/interview sessions and return ONLY JSON:
{
  "trend": "improving" | "plateauing" | "declining",
  "topStrength": "one sentence",
  "topWeakness": "one sentence",
  "weeklyTip": "one actionable tip",
  "predictedNextScore": number,
  "streakMessage": "motivating message about their streak"
}
Return ONLY valid JSON. No explanations.`;

    try {
      const response = await openrouterLLM(systemPrompt, JSON.stringify(sessions));
      return extractJSON(response);
    } catch (e) {
      console.error("AnalyticsAgent Error:", e);
      return {
        trend: "improving",
        topStrength: "You are speaking clearly.",
        topWeakness: "Try to reduce filler words.",
        weeklyTip: "Pause before answering complex questions.",
        predictedNextScore: 8,
        streakMessage: "Keep up the great work!"
      };
    }
  }
}
