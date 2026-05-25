import { groqLLM } from '../api/groqClient';
import { extractJSON } from '../utils/jsonHelper';
import { analyzeFillers } from '../utils/analyzeFillers';
import { measurePace as getPace } from '../utils/measurePace';

export class CoachAgent {
  async analyzeSpeech(text, words, durationSeconds) {
    const fillers = analyzeFillers(words, text);
    const paceData = getPace(words, durationSeconds, text);
    
    const systemPrompt = `You are VoiceUp Coach Agent — an elite communication expert.
Analyze the user speech and return ONLY this exact JSON:
{
  "fillerWords": ${JSON.stringify(fillers.fillersFound)},
  "fillerCount": ${fillers.fillerCount},
  "pace": "${paceData.pace}",
  "wpm": ${paceData.wpm},
  "clarity": number between 1 and 10,
  "tone": "confident" | "nervous" | "monotone" | "engaging",
  "mistakes_identified": ["Grammar/pronunciation/phrasing mistake 1", "Mistake 2"],
  "corrected_version": "Provide the exact same thought but spoken in a perfectly clear, professional, and grammatically correct way.",
  "feedback": ["point 1", "point 2", "point 3"],
  "encouragement": "one short motivating sentence",
  "emotion": "Happy" | "Calm" | "Neutral" | "Sad",
  "nextTopic": "suggest next practice topic"
}
Return ONLY valid JSON. No explanation.`;

    try {
      const result = await groqLLM(systemPrompt, `User speech: "${text}"`, "llama-3.3-70b-versatile", true);
      return extractJSON(result);
    } catch (error) {
      console.error("CoachAgent Error:", error);
      return {
        fillerWords: fillers.fillersFound,
        fillerCount: fillers.fillerCount,
        pace: paceData.pace,
        wpm: paceData.wpm,
        clarity: 5,
        tone: "neutral",
        feedback: ["Keep practicing!", "Speak clearly."],
        encouragement: "Good try, let's do it again.",
        emotion: "Neutral",
        nextTopic: "Self Introduction"
      };
    }
  }
}
