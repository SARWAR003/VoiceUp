
import dotenv from 'dotenv';
dotenv.config();

async function testNvidia() {
  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VITE_NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "nvidia/parakeet-tts", // Wait, nvidia TTS might be called something else?
        input: "Hello there.",
        voice: "Mia"
      })
    });
    console.log("NVIDIA status:", res.status, await res.text());
  } catch (e) {
    console.log("NVIDIA error:", e);
  }
}

async function testGroq() {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "playai-tts",
        input: "Hello there.",
        voice: "Arista-PlayAI"
      })
    });
    console.log("Groq status:", res.status, await res.text());
  } catch (e) {
    console.log("Groq error:", e);
  }
}

testNvidia();
testGroq();
