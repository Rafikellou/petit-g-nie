'use client'

import { useState, useEffect } from 'react'
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Quiz from '@/components/Quiz'
import { audiobookService, quizService, type Question, type Audiobook } from '@/lib/services'

export default function TrainAndListen() {
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    // Pour la démo, on charge le premier audiobook disponible
    audiobookService.getAudiobooks().then(books => {
      if (books.length > 0) {
        setAudiobook(books[0])
      }
    })
  }, [])

  const handleProgress = (progress: number) => {
    if (progress >= 50 && !showQuiz && !quizCompleted) {
      setShowQuiz(true)
      // Charger les questions pour le quiz
      quizService.getQuizQuestions('CP').then(setQuestions)
    }
  }

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true)
    setShowQuiz(false)
    // Ici, on pourrait sauvegarder le score
    console.log('Quiz completed with score:', score)
  }

  if (!audiobook) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{audiobook.title}</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">{audiobook.description}</p>
        
        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AudioPlayer
            src={audiobook.audio_url}
            onProgress={handleProgress}
            onPlayPause={() => {}}
          />
        </div>
      </div>

      {/* Quiz Section */}
      {showQuiz && !quizCompleted && (
        <div className="mt-8">
          <Quiz
            questions={questions}
            onComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  )
}
