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
    
    if (score >= 5) {
      // L'enfant peut continuer l'histoire
      alert('Bravo ! Tu peux continuer l\'histoire !')
    } else {
      // L'enfant doit refaire un quiz
      alert('Continue à t\'entraîner ! Essaie un nouveau quiz.')
      quizService.getQuizQuestions('CP').then(setQuestions)
      setShowQuiz(true)
      setQuizCompleted(false)
    }
  }

  if (!audiobook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">S'entraîner et Écouter</h1>

      {showQuiz ? (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            C'est l'heure du quiz ! Montre-nous ce que tu as appris.
          </h2>
          <Quiz questions={questions} onComplete={handleQuizComplete} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <AudioPlayer
            src={audiobook.audio_url}
            gradient="from-purple-500 to-blue-500"
            onTimeUpdate={handleProgress}
            onComplete={() => {}}
          />
          <p className="mt-4 text-gray-600">{audiobook.description}</p>
        </div>
      )}
    </div>
  )
}
