'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { commonEnglishWords } from '@/data/english-words';

export default function EnglishLearning() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const currentWord = commonEnglishWords[currentWordIndex];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const playPronunciation = (text: string) => {
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      const voices = synth.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && !voice.localService
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      synth.speak(utterance);
    }
  };

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % commonEnglishWords.length);
  };

  const previousWord = () => {
    setCurrentWordIndex((prev) => 
      prev === 0 ? commonEnglishWords.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gradient mb-12 text-center">
          Apprendre l&apos;anglais
        </h1>

        <div className="glass-card p-8">
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={currentWord.image}
                alt={currentWord.word}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-gradient">
              {currentWord.word}
            </h2>
            <p className="text-xl text-white/70 mb-4">
              {currentWord.translation}
            </p>
            <p className="text-lg text-white/90 mb-8 italic">
              {currentWord.example}
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => playPronunciation(currentWord.word)}
                className="btn-primary"
              >
                <Play className="w-5 h-5" />
                Écouter le mot
              </button>
              <button
                onClick={() => playPronunciation(currentWord.example)}
                className="btn-primary"
              >
                <Play className="w-5 h-5" />
                Écouter la phrase
              </button>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={previousWord}
                className="btn-secondary flex-1"
              >
                Précédent
              </button>
              <button
                onClick={nextWord}
                className="btn-secondary flex-1"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
