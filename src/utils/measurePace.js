export function measurePace(words, durationSeconds, rawText = "") {
  let wordCount = 0;
  
  if (words && words.length > 0) {
    wordCount = words.length;
  } else if (rawText) {
    wordCount = rawText.trim().split(/\s+/).length;
  }
  
  if (wordCount === 0 || !durationSeconds || durationSeconds <= 0) {
    return { wpm: 0, pace: 'good' };
  }
  
  const wpm = Math.round((wordCount / durationSeconds) * 60);
  
  let pace = 'good';
  if (wpm > 160) pace = 'too fast';
  else if (wpm < 110) pace = 'too slow';
  
  return { wpm, pace };
}
