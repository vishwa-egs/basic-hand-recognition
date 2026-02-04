let synthesis: SpeechSynthesis | null = null;
let voices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined') {
  synthesis = window.speechSynthesis;

  const populateVoices = () => {
    if (!synthesis) return;
    voices = synthesis.getVoices();
  };

  populateVoices();

  // Browsers like Chrome load voices asynchronously. 
  // We need to listen for this event to ensure voices are available.
  if (synthesis && synthesis.onvoiceschanged !== undefined) {
    synthesis.onvoiceschanged = populateVoices;
  }
}

export const speak = (text: string) => {
  if (!synthesis) return;

  // Cancel any ongoing speech to prevent queue buildup
  synthesis.cancel();

  // Retry fetching voices if empty (safeguard for some browsers)
  if (voices.length === 0) {
    voices = synthesis.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Settings for natural sounding speech
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';

  // Prefer standard US English or first available English voice
  const englishVoice = voices.find(v => v.lang === 'en-US');
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  synthesis.speak(utterance);
};