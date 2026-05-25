export async function groqLLM(systemPrompt, userMessage, model = "llama-3.3-70b-versatile", jsonMode = false) {
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 1024
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Groq LLM error");
  return data.choices[0].message.content;
}

export async function groqSTT(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-large-v3");
  formData.append("language", "en");
  formData.append("response_format", "verbose_json");
  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Groq STT error");
  }
  return await res.json();
}

export async function groqTTS(text, voice = "Arista-PlayAI") {
  const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "playai-tts",
      input: text,
      voice: voice,
      response_format: "wav"
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Groq TTS error");
  }
  const blob = await res.blob();
  const audio = new Audio(URL.createObjectURL(blob));
  await audio.play();
  return audio;
}

export async function groqVision(imageBase64, mimeType, prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.2-90b-vision-preview", // Updated to a working vision model
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` }}
        ]
      }],
      max_tokens: 1024
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Groq Vision error");
  return data.choices[0].message.content;
}
