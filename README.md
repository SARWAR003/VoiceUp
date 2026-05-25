# ⚡ VoiceUp: AI Communication Coach

VoiceUp is a cutting-edge, fully in-browser AI Communication Coach and Mock Interview application. Powered by Groq's blazing fast inference and NVIDIA's realistic text-to-speech models, VoiceUp acts as your personal speaking mentor to help you ace interviews, improve your fluency, and communicate with absolute confidence.

## 🚀 Live Demo
**[Play with VoiceUp here!](https://SARWAR003.github.io/VoiceUp/)**

## ✨ Features
- **🎙️ Real-time Speech Analysis:** Detects filler words (um, uh, like), analyzes your speaking pace (WPM), and rates your clarity.
- **🤖 Intelligent Feedback:** The Coach Agent identifies exact grammatical/phrasing mistakes you made and provides a "Corrected Version" showing you how a professional would say it.
- **👔 Mock Interview Mode:** Upload your CV (PDF/DOCX), select a role, and do a back-and-forth live voice interview with an AI recruiter.
- **📊 Analytics Dashboard:** Tracks your progress over time with beautiful interactive charts (Radar, Bar, Line) and exports a professional PDF report.
- **🔒 Privacy First:** 100% serverless frontend architecture.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts
- **AI Inference:** Groq (LLM & Whisper STT)
- **Voice Synthesis:** NVIDIA Riva TTS
- **Routing:** React Router (HashRouter)

## 💻 Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your API keys:
   ```env
   VITE_GROQ_API_KEY=your_key
   VITE_NVIDIA_API_KEY=your_key
   ```
4. Run the dev server: `npm run dev`

---
*Built with ❤️ and AI.*
