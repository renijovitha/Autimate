import React, { useState, useEffect } from 'react';
import SpeechRecognitionWrapper from './components/SpeechRecognitionWrappe';
import stringSimilarity from 'string-similarity'; // Add this
import './styles.css';

const wordsList = ['cat', 'dog', 'sun', 'tree', 'car'];

const App = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [userSpeech, setUserSpeech] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const similarityThreshold = 0.8; // Threshold for string similarity

  useEffect(() => {
    pickRandomWord();
  }, []);

  const pickRandomWord = () => {
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    setCurrentWord(randomWord);
    setFeedback('');
    setUserSpeech('');
  };

  const pronounceWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    try {
      const recognizer = new SpeechRecognitionWrapper();
      recognizer.startRecognition(
        (transcript) => {
          const trimmedTranscript = transcript.trim().toLowerCase();
          setUserSpeech(trimmedTranscript);

          // String similarity check
          const similarity = stringSimilarity.compareTwoStrings(trimmedTranscript, currentWord.toLowerCase());
          console.log(`Transcript: "${trimmedTranscript}", Similarity: ${similarity}`);

          if (similarity >= similarityThreshold) {
            setFeedback('Correct! 🎉');
            setScore(score + 1);
          } else if (similarity >= 0.5) {
            setFeedback('Almost there! Try again.');
          } else {
            setFeedback('Try again!');
          }
        },
        (error) => {
          setFeedback(`Error: ${error}`);
        }
      );
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="app">
      <h1>Speech Trainer</h1>
      <p>Listen to the word and pronounce it!</p>
      <h2>Word: {currentWord}</h2>
      <button onClick={pronounceWord}>Hear Word</button>
      <button onClick={startRecognition}>Start Pronouncing</button>
      <h3>{feedback}</h3>
      <p>Your Pronunciation: {userSpeech}</p>
      <p>Score: {score}</p>
      <button onClick={pickRandomWord}>Next Word</button>
    </div>
  );
};

export default App;
