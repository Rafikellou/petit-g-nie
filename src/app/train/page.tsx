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
}

const trainingSessions: TrainingSession[] = [
  {
    id: '1',
    title: 'Les sons de base',
    description: 'Apprenez à reconnaître et à prononcer les sons de base du français.',
    audioUrl: '/audio/sons-base.mp3',
    duration: '5 min',
    level: 'débutant',
    transcription: 'A comme dans "papa", E comme dans "bébé"...'
  },
  {
    id: '2',
    title: 'Les liaisons',
    description: 'Découvrez comment lier les mots en français pour une prononciation plus naturelle.',
    audioUrl: '/audio/liaisons.mp3',
    duration: '8 min',
    level: 'intermédiaire',
    transcription: 'Les liaisons sont importantes en français...'
  },
  {
    id: '3',
    title: 'Les expressions courantes',
    description: 'Pratiquez les expressions les plus utilisées en français.',
    audioUrl: '/audio/expressions.mp3',
    duration: '10 min',
    level: 'avancé',
    transcription: 'Bonjour ! Comment allez-vous ?...'
  }
];

export default function TrainPage() {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { progress, updateProgress } = useProgress();
  const { showBadgeUnlock } = useAchievements();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleSessionComplete = () => {
    if (selectedSession) {
      updateProgress({
        trainingSessions: [
          ...progress.trainingSessions,
          {
            sessionId: selectedSession.id,
            completedAt: new Date().toISOString()
          }
        ]
      });

      const completedSessions = progress.trainingSessions.length + 1;
      if (completedSessions >= 5) {
        showBadgeUnlock('training_master');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Entraînement</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {selectedSession ? (
          <div className="space-y-6">
            {/* Session en cours */}
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedSession.title}</h2>
                <p className="text-white/70">{selectedSession.description}</p>
              </div>

              {/* Contrôles audio */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                    className="p-2 hover:bg-white/5 rounded-full transition tap-target touch-manipulation"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition tap-target touch-manipulation"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                    className="p-2 hover:bg-white/5 rounded-full transition tap-target touch-manipulation"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Volume et enregistrement */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleMute}
                    className="p-2 hover:bg-white/5 rounded-full transition tap-target touch-manipulation"
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={handleRecord}
                    className={`p-3 rounded-full transition tap-target touch-manipulation ${
                      isRecording ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Transcription */}
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="text-sm font-medium text-white/60 mb-2">Transcription</h3>
                <p className="text-white/90">{selectedSession.transcription}</p>
              </div>

              <Button
                onClick={() => setSelectedSession(null)}
                className="w-full"
              >
                Terminer la session
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Liste des sessions */}
            {trainingSessions.map((session) => (
              <div
                key={session.id}
                className="glass-card p-4 hover:bg-white/5 transition tap-target touch-manipulation"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium mb-1">{session.title}</h2>
                    <p className="text-white/70 text-sm mb-2">{session.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>{session.duration}</span>
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${session.level === 'débutant' ? 'bg-green-500/20 text-green-400' : ''}
                        ${session.level === 'intermédiaire' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                        ${session.level === 'avancé' ? 'bg-red-500/20 text-red-400' : ''}
                      `}>
                        {session.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
