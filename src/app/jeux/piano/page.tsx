'use client';

import { useState, useEffect, useCallback } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Music, Play, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

const notes = [
  { key: 'C', note: 'Do', frequency: 261.63, color: 'bg-red-400' },
  { key: 'D', note: 'Ré', frequency: 293.66, color: 'bg-orange-400' },
  { key: 'E', note: 'Mi', frequency: 329.63, color: 'bg-yellow-400' },
  { key: 'F', note: 'Fa', frequency: 349.23, color: 'bg-green-400' },
  { key: 'G', note: 'Sol', frequency: 392.00, color: 'bg-blue-400' },
  { key: 'A', note: 'La', frequency: 440.00, color: 'bg-indigo-400' },
  { key: 'B', note: 'Si', frequency: 493.88, color: 'bg-purple-400' },
  { key: 'C2', note: 'Do²', frequency: 523.25, color: 'bg-red-400' },
];

const simpleSongs = [
  {
    name: 'Au Clair de la Lune',
    notes: ['Do', 'Do', 'Do', 'Ré', 'Mi', 'Ré', 'Do', 'Mi', 'Ré', 'Ré', 'Do'],
    timing: [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  },
  {
    name: 'Frère Jacques',
    notes: ['Do', 'Ré', 'Mi', 'Do', 'Do', 'Ré', 'Mi', 'Do'],
    timing: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: 'Fais Dodo',
    notes: ['Sol', 'Mi', 'Sol', 'Mi', 'Ré', 'Do', 'Ré', 'Mi', 'Do'],
    timing: [1, 1, 1, 1, 1, 1, 1, 1, 2],
  },
  {
    name: 'Une Souris Verte',
    notes: ['Do', 'Ré', 'Mi', 'Fa', 'Mi', 'Ré', 'Do', 'Mi', 'Sol'],
    timing: [1, 1, 1, 1, 1, 1, 1, 1, 2],
  },
  {
    name: 'À la Claire Fontaine',
    notes: ['Do', 'Mi', 'Ré', 'Fa', 'Mi', 'Sol', 'Do', 'Sol', 'Mi'],
    timing: [1, 1, 1, 1, 1, 1, 1, 1, 2],
  },
  {
    name: 'Petit Escargot',
    notes: ['Do', 'Ré', 'Mi', 'Do', 'Mi', 'Fa', 'Sol', 'Mi', 'Do'],
    timing: [1, 1, 1, 1, 1, 1, 1, 1, 2],
  },
];

export default function PianoGame() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentSong, setCurrentSong] = useState<typeof simpleSongs[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [isCorrectNote, setIsCorrectNote] = useState<boolean | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (currentSong && isPlaying) {
      setHighlightedNote(currentSong.notes[currentNoteIndex]);
    } else {
      setHighlightedNote(null);
    }
  }, [currentSong, currentNoteIndex, isPlaying]);

  const playNote = useCallback((frequency: number, duration = 0.5) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  const handleNoteClick = (note: typeof notes[0]) => {
    playNote(note.frequency);
    setLastPlayedNote(note.note);

    if (currentSong && currentNoteIndex < currentSong.notes.length) {
      const isCorrect = note.note === currentSong.notes[currentNoteIndex];
      setIsCorrectNote(isCorrect);

      if (isCorrect) {
        setMessage('Bravo ! Continue comme ça !');
        setCurrentNoteIndex(prev => prev + 1);
        
        if (currentNoteIndex === currentSong.notes.length - 1) {
          setMessage('Félicitations ! Tu as réussi la chanson ! 🎉');
          setIsPlaying(false);
          setCurrentNoteIndex(0);
          setHighlightedNote(null);
        }

        // Reset le statut après un délai
        setTimeout(() => {
          setIsCorrectNote(null);
          setLastPlayedNote(null);
        }, 500);
      } else {
        setMessage('Essaie encore ! Tu peux y arriver !');
        // Reset le statut après un délai
        setTimeout(() => {
          setIsCorrectNote(null);
          setLastPlayedNote(null);
        }, 500);
      }
    }
  };

  const startSong = (song: typeof simpleSongs[0]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentNoteIndex(0);
    setMessage(`C'est parti ! Joue : ${song.notes[0]}`);
    setHighlightedNote(song.notes[0]);
  };

  const resetSong = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
    setCurrentSong(null);
    setMessage('');
    setHighlightedNote(null);
    setLastPlayedNote(null);
    setIsCorrectNote(null);
  };

  return (
    <BaseLayout>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Piano Magique</h1>
            <p className="text-gray-400 mb-8">
              Apprends à jouer du piano en t&apos;amusant ! Choisis une chanson et suis les touches illuminées.
            </p>
          </div>

          {/* Piano Keys */}
          <div className="grid grid-cols-8 gap-2 mb-8">
            {notes.map((note) => (
              <button
                key={note.key}
                onClick={() => handleNoteClick(note)}
                className={cn(
                  note.color,
                  'h-40 rounded-lg shadow-lg transition-all duration-200',
                  'flex flex-col items-center justify-end p-4 text-white font-bold',
                  'hover:opacity-90 hover:transform hover:scale-105',
                  highlightedNote === note.note && 'ring-4 ring-white ring-opacity-50 animate-pulse',
                  lastPlayedNote === note.note && isCorrectNote && 'ring-4 ring-green-400 transform scale-105',
                  lastPlayedNote === note.note && isCorrectNote === false && 'ring-4 ring-red-400'
                )}
              >
                <span className="text-2xl mb-2">{note.note}</span>
                <span className="text-sm opacity-80">{note.key}</span>
              </button>
            ))}
          </div>

          {/* Songs Section */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Music className="mr-2" />
              Chansons à apprendre
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simpleSongs.map((song) => (
                <div 
                  key={song.name} 
                  className={cn(
                    "bg-gray-700/50 rounded-lg p-4",
                    currentSong?.name === song.name && "ring-2 ring-violet-400"
                  )}
                >
                  <h3 className="font-bold mb-2">{song.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => startSong(song)}
                      disabled={isPlaying && currentSong?.name !== song.name}
                      className="flex items-center"
                      variant={currentSong?.name === song.name ? "secondary" : "default"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {currentSong?.name === song.name ? "En cours" : "Jouer"}
                    </Button>
                    {currentSong?.name === song.name && (
                      <Button
                        onClick={resetSong}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Repeat className="w-4 h-4 mr-2" />
                        Recommencer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={cn(
              "text-center p-4 rounded-lg transition-colors duration-300",
              isCorrectNote ? "bg-green-800/50" : 
              isCorrectNote === false ? "bg-red-800/50" : 
              "bg-gray-800/50"
            )}>
              <p className="text-xl font-bold">{message}</p>
              {currentSong && isPlaying && (
                <p className="text-gray-400 mt-2">
                  Note suivante : {currentSong.notes[currentNoteIndex]}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
