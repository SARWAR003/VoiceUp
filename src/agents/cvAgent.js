import { groqLLM, groqVision } from '../api/groqClient';
import { extractJSON } from '../utils/jsonHelper';

async function analyzeCV(cvText) {
  const systemPrompt = `You are a CV analysis expert. 
  Analyze the CV and return ONLY this JSON, no extra text:
  {
    "name": "",
    "currentRole": "",
    "totalExperience": "",
    "topSkills": [],
    "education": "",
    "lastCompany": "",
    "keyProjects": [],
    "suggestedRole": "",
    "interviewFocus": []
  }`;

  const result = await groqLLM(systemPrompt, cvText, "llama-3.3-70b-versatile", true);
  return extractJSON(result);
}

export class CVAgent {
  async processCVText(text) {
    try {
      const summary = await analyzeCV(text);
      return summary;
    } catch (e) {
      console.error("CVAgent Text Parse Error:", e);
      throw e;
    }
  }

  async processCVImage(base64, mimeType) {
    try {
      const textFromImage = await groqVision(base64, mimeType, "Extract all the text from this CV. Return only the raw text, no formatting.");
      const summary = await analyzeCV(textFromImage);
      return summary;
    } catch (e) {
      console.error("CVAgent Image Parse Error:", e);
      throw e;
    }
  }
}
