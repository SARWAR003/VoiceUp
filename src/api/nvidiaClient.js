import { groqTTS } from './groqClient';

export async function nvidiaRivaTTS(text, voice = "Mia", emotion = "Neutral") {
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "magpie-tts-multilingual",
        input: text,
        voice: voice,
        language_code: "en-US",
        emotion: emotion
      })
    });
    
    if (!res.ok) {
      throw new Error(`NVIDIA TTS failed with status ${res.status}`);
    }
    
    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    await audio.play();
    return audio;
  } catch (error) {
    console.warn("NVIDIA TTS failed, falling back to Groq TTS:", error);
    // Fallback to Groq TTS silently
    const groqVoice = voice === "Mia" ? "Arista-PlayAI" : "Atlas-PlayAI";
    try {
      return await groqTTS(text, groqVoice);
    } catch (groqErr) {
      console.warn("Groq TTS failed, falling back to Web Speech API:", groqErr);
      return new Promise((resolve) => {
        const speakText = () => {
          window.speechSynthesis.onvoiceschanged = null;
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          let selectedVoice = null;
          
          const isFemale = voice === "Mia" || voice === "Arista";
          
          if (isFemale) {
            selectedVoice = voices.find(v => v.name.includes("Natural") && v.name.includes("Female") && v.lang.includes("en"))
                         || voices.find(v => v.name.includes("Google UK English Female"))
                         || voices.find(v => v.name.includes("Google US English"))
                         || voices.find(v => v.name.includes("Zira"));
          } else {
            selectedVoice = voices.find(v => v.name.includes("Natural") && v.name.includes("Male") && v.lang.includes("en"))
                         || voices.find(v => v.name.includes("Google UK English Male"))
                         || voices.find(v => v.name.includes("Mark") || v.name.includes("David"));
          }
          
          if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes("en"));
          if (selectedVoice) utterance.voice = selectedVoice;
          
          utterance.rate = 1.05;
          utterance.pitch = isFemale ? 1.1 : 1.0;
          utterance.onend = () => resolve(null);
          utterance.onerror = () => resolve(null);
          window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          speakText();
        } else {
          window.speechSynthesis.onvoiceschanged = speakText;
          // Failsafe timeout in case the event never fires
          setTimeout(() => {
            if (window.speechSynthesis.onvoiceschanged === speakText) {
              window.speechSynthesis.onvoiceschanged = null;
              speakText();
            }
          }, 500);
        }
      });
    }
  }
}
