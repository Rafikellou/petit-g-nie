'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/contexts/AchievementsContext';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  transcription: string;
  category: 'prononciation' | 'vocabulaire' | 'grammaire' | 'conversation';
  prerequisites?: string[];
  objectives: string[];
  nextSessions?: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

interface TrainingResult {
  sessionId: string;
  userId: string;
  timestamp: string;
  accuracy: number;
  duration: number;
  mistakes: {
    word: string;
    expected: string;
    actual: string;
    timestamp: number;
  }[];
}

const trainingSessions: TrainingSession[] = [
  {
    id: '1',
    title: 'Les sons de base',
    description: 'Apprenez les sons fondamentaux du français',
    audioUrl: '/audio/training/basic-sounds.mp3',
    duration: '5:00',
    level: 'débutant',
    transcription: 'Bonjour, aujourd\'hui nous allons apprendre...',
    category: 'prononciation',
    objectives: [
      'Maîtriser les voyelles de base',
      'Pratiquer les consonnes simples',
    ],
    difficulty: 1,
  },
  // ... autres sessions
];

export default function TrainPage() {
  const { progress, updateProgress } = useProgress();
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    if (currentSession) {
      const audio = new Audio(currentSession.audioUrl);
      setAudioElement(audio);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        handleSessionComplete();
      });
      
      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [currentSession]);

  const handleSessionComplete = () => {
    if (currentSession) {
      const sessionResult = {
        completed: true,
        score: 85, // À remplacer par le vrai score
        date: new Date().toISOString(),
        duration: Math.floor(duration),
      };

      updateProgress({
        trainingSessions: {
          ...progress.trainingSessions,
          [currentSession.id]: sessionResult,
        },
      });

      // Débloquer des succès si nécessaire
      if (Object.keys(progress.trainingSessions).length === 1) {
        unlockAchievement('first_training');
      }
    }
  };

  const togglePlay = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioElement) return;
    audioElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement) return;
    const time = parseFloat(e.target.value);
    audioElement.currentTime = time;
    setCurrentTime(time);
  };

  const skipBackward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.min(duration, currentTime + 10);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implémenter la logique d'enregistrement
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-dark border-b border-white/10 p-4">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <ArrowLeft className="w-6 h-6" />
          <span>Retour</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Entraînement à la prononciation</h1>

        {/* Liste des sessions */}
        <div className="grid gap-6">
          {trainingSessions.map((session) => {
            const isCompleted = progress.trainingSessions[session.id]?.completed;
            
            return (
              <div
                key={session.id}
                className={`p-6 rounded-lg ${
                  currentSession?.id === session.id
                    ? 'bg-primary/20 border-primary'
                    : 'bg-surface-dark'
                } border border-white/10 cursor-pointer transition hover:bg-white/5`}
                onClick={() => setCurrentSession(session)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    <p className="text-sm text-white/70">{session.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-white/50">{session.duration}</span>
                      <span className={`text-sm ${
                        session.level === 'débutant' ? 'text-green-400' :
                        session.level === 'intermédiaire' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {session.level}
                      </span>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-400">
                      ✓ Complété
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lecteur audio */}
        {currentSession && (
          <div className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-white/10 p-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">{currentSession.title}</h3>
                  <p className="text-sm text-white/70">{formatTime(currentTime)} / {formatTime(duration)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={skipBackward}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-primary rounded-full hover:bg-primary/80 transition"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={skipForward}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-full transition ${
                      isRecording ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-white/10'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
