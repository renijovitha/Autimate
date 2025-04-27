export default class SpeechRecognitionWrapper {
    constructor() {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
  
      if (!SpeechRecognition) {
        throw new Error('Speech Recognition API is not supported in this browser.');
      }
  
      this.recognizer = new SpeechRecognition();
      this.recognizer.lang = 'en-US'; // Language: English
      this.recognizer.continuous = false; // Single recognition
      this.recognizer.interimResults = false; // Final result only
    }
  
    startRecognition(onResult, onError) {
      this.recognizer.start();
  
      this.recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
  
      this.recognizer.onerror = (event) => {
        onError(event.error);
      };
  
      this.recognizer.onend = () => {
        console.log('Recognition ended.');
      };
    }
  
    stopRecognition() {
      this.recognizer.stop();
    }
  }
  