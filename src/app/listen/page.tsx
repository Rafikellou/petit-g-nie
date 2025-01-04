'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Pause, Volume2, Clock, BookOpen } from 'lucide-react'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { audiobookService, type Audiobook } from '@/lib/services'
import { Button } from '@/components/ui/ios-button'

export default function Listen() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([])
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audiobookService.getAudiobooks().then(setAudiobooks)
  }, [])

  const handleProgress = (progress: number) => {
    if (selectedBook) {
      // Sauvegarder la progression (à implémenter avec l'authentification)
      // audiobookService.saveProgress(userId, selectedBook.id, progress, 0)
    }
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
              src={selectedBook.audioUrl}
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
