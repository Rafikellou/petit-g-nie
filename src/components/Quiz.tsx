'use client'

import { useState } from 'react'
import type { Question } from '@/lib/services'

interface QuizProps {
  questions: Question[]
  onComplete: (score: number) => void
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === parseInt(questions[currentQuestion].correct_answer, 10)
    if (correct) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion === questions.length - 1) {
      setShowResult(true)
      onComplete(score)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  if (showResult) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz terminé !</h2>
        <p className="text-lg mb-4">
          Ton score : {score} sur {questions.length}
        </p>
        <button
          onClick={() => {
            setCurrentQuestion(0)
            setScore(0)
            setShowResult(false)
          }}
          className="btn-primary"
        >
          Recommencer
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} sur {questions.length}
        </span>
        <h3 className="text-xl font-bold mt-2">{question.question_text}</h3>
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => !showExplanation && handleAnswer(index)}
            className={`w-full p-4 text-left rounded-xl transition-colors ${
              showExplanation
                ? index === parseInt(question.correct_answer, 10)
                  ? 'bg-green-100 border-green-500'
                  : 'bg-gray-100'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            disabled={showExplanation}
          >
            {answer}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-6">
          <button onClick={nextQuestion} className="btn-primary">
            {currentQuestion === questions.length - 1 ? 'Terminer' : 'Question suivante'}
          </button>
        </div>
      )}
    </div>
  )
}
