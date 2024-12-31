'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Pause, Play } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceInput({ onResult, placeholder = "Parle-moi de ton histoire...", className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  // Son de début/fin d'enregistrement
  const playSound = (frequency: number, duration: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  };

  const initializeRecognition = () => {
    if (recognitionRef.current) return;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
      playSound(880, 200); // La4 (440Hz) une octave plus haut
    };

    recognition.onend = () => {
      if (isListening && !isPaused) {
        recognition.start(); // Redémarrer si on n'a pas explicitement arrêté
      } else {
        setIsListening(false);
        playSound(440, 200); // La4 (440Hz)
      }
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join(' ');
      
      transcriptRef.current = transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setErrorMessage(
        event.error === 'not-allowed' 
          ? "Veuillez autoriser l'accès au microphone"
          : "Une erreur s'est produite"
      );
      setIsListening(false);
      setIsPaused(false);
    };

    recognitionRef.current = recognition;
  };

  useEffect(() => {
    initializeRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsPaused(false);
    } else {
      try {
        transcriptRef.current = ""; // Réinitialiser la transcription
        recognitionRef.current.start();
      } catch (error) {
        console.error('Erreur au démarrage:', error);
      }
    }
  };

  const togglePause = () => {
    if (!recognitionRef.current || !isListening) return;

    if (isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
      playSound(660, 100); // Mi4 (330Hz) une octave plus haut
    } else {
      recognitionRef.current.stop();
      setIsPaused(true);
      playSound(330, 100); // Mi4 (330Hz)
    }
  };

  if (!isSupported) {
    return (
      <div className="text-red-400 text-sm">
        La reconnaissance vocale n'est pas supportée par votre navigateur
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-red-500/20 hover:bg-red-500/30' 
            : 'bg-white/10 hover:bg-white/20'
        } ${className}`}
        title={isListening ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
      >
        {isListening ? (
          <div className="relative">
            <MicOff className="w-5 h-5 text-red-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>

      {isListening && (
        <button
          onClick={togglePause}
          className={`p-3 rounded-full transition-all duration-200 
            ${isPaused ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-yellow-500/20 hover:bg-yellow-500/30'}`}
          title={isPaused ? "Reprendre l'enregistrement" : "Mettre en pause"}
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-green-400" />
          ) : (
            <Pause className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      )}

      {errorMessage && (
        <div className="text-red-400 text-sm animate-fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
