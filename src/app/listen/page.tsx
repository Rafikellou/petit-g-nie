'use client'

import { useState, useEffect } from 'react'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { audiobookService, type Audiobook } from '@/lib/services'

export default function Listen() {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([])
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null)

  useEffect(() => {
    audiobookService.getAudiobooks().then(setAudiobooks)
  }, [])

  const handleProgress = (progress: number) => {
    if (selectedBook) {
      // Sauvegarder la progression (à implémenter avec l'authentification)
      // audiobookService.saveProgress(userId, selectedBook.id, progress, 0)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Bibliothèque d'Histoires</h1>

      {selectedBook ? (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedBook(null)}
            className="mb-4 text-purple-600 hover:text-purple-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la bibliothèque
          </button>

          <AudioPlayer
            audioUrl={selectedBook.audio_url}
            gradient="from-purple-600 to-blue-600"
            onTimeUpdate={handleProgress}
            onComplete={() => {}}
          />
          <p className="mt-4 text-gray-600">{selectedBook.description}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiobooks.map((book) => (
            <div
              key={book.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {Math.floor(book.duration / 60)} minutes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
