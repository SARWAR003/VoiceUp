export function analyzeFillers(words, rawText = "") {
  const fillerList = ['um', 'uh', 'like', 'basically', 'actually', 'literally', 'so', 'right', 'okay', 'well', 'just', 'you know'];
  const fillersFound = [];
  let fillerCount = 0;
  
  if (words && Array.isArray(words) && words.length > 0) {
    words.forEach(w => {
      const wordClean = w.word.toLowerCase().replace(/[^a-z]/g, '');
      if (fillerList.includes(wordClean)) {
        fillersFound.push(wordClean);
        fillerCount++;
      }
    });
  } else if (rawText) {
    const tokens = rawText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    tokens.forEach(wordClean => {
      if (fillerList.includes(wordClean)) {
        fillersFound.push(wordClean);
        fillerCount++;
      }
    });
  }
  
  return { fillersFound: [...new Set(fillersFound)], fillerCount };
}
