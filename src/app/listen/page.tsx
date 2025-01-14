'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Pause, Volume2, Clock, BookOpen } from 'lucide-react'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { audiobookService, type Audiobook } from '@/lib/services'
import { Button } from '@/components/ui/ios-button'

interface ListeningProgress {
  bookId: string;
  userId: string;
  progress: number;
  timestamp: string;
  speed: number;
  completed: boolean;
  notes?: string[];
  bookmarks?: number[];
}

interface ListeningStats {
  totalTime: number;
  booksCompleted: number;
  averageSpeed: number;
  favoriteGenres: string[];
}

export default function Listen() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([])
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState<ListeningProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ListeningStats>({
    totalTime: 0,
    booksCompleted: 0,
    averageSpeed: 1,
    favoriteGenres: []
  })

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const books = await audiobookService.getAudiobooks();
        setAudiobooks(books);
      } catch (e) {
        console.error('Erreur lors du chargement des livres audio:', e);
        setError('Impossible de charger les livres audio');
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, []);

  const handleProgress = async (currentProgress: number) => {
    if (selectedBook && progress) {
      try {
        const updatedProgress: ListeningProgress = {
          ...progress,
          progress: currentProgress,
          timestamp: new Date().toISOString(),
          completed: currentProgress >= 0.99
        };

        setProgress(updatedProgress);

        // Sauvegarder la progression
        await audiobookService.saveProgress(
          progress.userId,
          selectedBook.id,
          currentProgress,
          0 // lastPosition, à implémenter si nécessaire
        );
      } catch (e) {
        console.error('Erreur lors de la sauvegarde de la progression:', e);
        setError('Impossible de sauvegarder votre progression');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Erreur</h3>
          <p className="text-white/70">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

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
            <h1 className="text-xl font-bold">Écoute</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Audiolivres</h2>
          <p className="text-white/70">Écoute des histoires passionnantes</p>
        </div>

        {selectedBook ? (
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">{selectedBook.title}</h3>
                <p className="text-white/70 mb-4">{selectedBook.description}</p>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedBook.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedBook.chapters} chapitres</span>
                  </div>
                </div>
              </div>
            </div>

            <AudioPlayer
              src={selectedBook.audio_url}
              onProgress={handleProgress}
              onPlayPause={togglePlayPause}
            />

            <Button
              onClick={() => setSelectedBook(null)}
              className="w-full min-h-[44px]"
            >
              Retour à la liste
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiobooks.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="glass-card p-6 text-left hover:bg-white/5 transition tap-target touch-manipulation"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {book.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-medium mb-1">{book.title}</h3>
                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {book.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>{book.duration}</span>
                  </div>
                  {book.progress > 0 && (
                    <span className="text-primary">
                      {Math.round(book.progress)}% terminé
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
