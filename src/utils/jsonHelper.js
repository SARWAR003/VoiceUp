export function extractJSON(text) {
  if (!text) throw new Error("Empty text provided to extractJSON");
  
  // Try finding a JSON object block
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      console.error("Failed to parse extracted JSON block:", e);
    }
  }
  
  // Fallback to cleaning markdown ticks and parsing the whole string
  const cleanStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanStr);
}
