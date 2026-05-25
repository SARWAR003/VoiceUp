import { groqSTT } from '../api/groqClient';
import { nvidiaRivaTTS } from '../api/nvidiaClient';

export class SpeechAgent {
  constructor(onVolumeChange = () => {}, onStateChange = () => {}, onTranscript = () => {}) {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.silenceTimer = null;
    this.stream = null;
    
    this.onVolumeChange = onVolumeChange;
    this.onStateChange = onStateChange;
    this.onTranscript = onTranscript;
  }

  async startListening() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.onStateChange('listening');
      this.audioChunks = [];
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);
      this.analyser.fftSize = 256;
      
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      
      this.mediaRecorder.onstop = async () => {
        this.onStateChange('processing');
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        try {
          const result = await groqSTT(audioBlob);
          this.onTranscript({ 
            text: result.text, 
            words: result.words || [],
            isInterim: false,
            duration: result.duration || 5 
          });
        } catch (error) {
          console.error("STT Error:", error);
          alert("Failed to transcribe audio. Please try again.");
          this.onStateChange('idle');
        }
      };
      
      this.mediaRecorder.start();
      this.monitorSilence();
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      this.onStateChange('idle');
      alert("Please allow microphone access in your browser.");
    }
  }

  stopListening() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  monitorSilence() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const checkVolume = () => {
      if (!this.analyser || !this.stream || this.mediaRecorder?.state === 'inactive') return;
      
      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      this.onVolumeChange(dataArray);

      if (average < 10) { // Silence threshold
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            this.stopListening();
          }, 1000); // 1 second of silence
        }
      } else {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }
      
      requestAnimationFrame(checkVolume);
    };
    
    checkVolume();
  }

  async speak(text, voice = "Mia", emotion = "Neutral") {
    this.onStateChange('speaking');
    try {
      const audio = await nvidiaRivaTTS(text, voice, emotion);
      if (audio) {
        audio.onended = () => this.onStateChange('idle');
      } else {
        this.onStateChange('idle');
      }
    } catch (error) {
      console.error("TTS Error:", error);
      this.onStateChange('idle');
    }
  }
}
