'use client';

import { useState } from 'react';
import { Quiz, QuizQuestion, mathQuizCE1, frenchQuizCE1, teacherRecommendedQuiz } from '@/data/quizData';
import { AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-6 text-left w-full"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-white/5">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  </button>
);

interface QuizSessionProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ quiz, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (isAnswerChecked) return; // Empêche de cliquer pendant l'animation
    
    setSelectedAnswer(answerIndex);
    setIsAnswerChecked(true);
    
    const isCorrect = answerIndex === quiz.questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      // Lancer les confettis pour une bonne réponse
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Attendre 2 secondes avant de passer à la question suivante
    setTimeout(() => {
      setIsAnswerChecked(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 2000);
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Quiz terminé !</h2>
          <p className="text-xl mb-6">
            Ton score : {score}/10
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Retour aux quiz
            </button>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowResults(false);
                setSelectedAnswer(null);
                setIsAnswerChecked(false);
              }}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors"
            >
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const correctAnswer = currentQuestionData.correctAnswer;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-8">
          <div className="text-sm text-white/50 mb-2">
            Question {currentQuestion + 1} sur {quiz.questions.length}
          </div>
          <h3 className="text-xl mb-6">{currentQuestionData.question}</h3>
          <div className="grid gap-4">
            {currentQuestionData.options.map((option, index) => {
              let buttonClass = "p-4 rounded-lg transition-all duration-300 text-left ";
              
              if (isAnswerChecked) {
                if (index === correctAnswer) {
                  // Bonne réponse
                  buttonClass += "bg-green-500/20 border-2 border-green-500";
                } else if (index === selectedAnswer) {
                  // Mauvaise réponse sélectionnée
                  buttonClass += "bg-red-500/20 border-2 border-red-500";
                } else {
                  // Autres options
                  buttonClass += "bg-white/5 opacity-50";
                }
              } else {
                // État normal
                buttonClass += "bg-white/5 hover:bg-white/10";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswerChecked}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswerChecked && index === correctAnswer && (
                      <span className="text-green-500">✓</span>
                    )}
                    {isAnswerChecked && index === selectedAnswer && index !== correctAnswer && (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {isAnswerChecked && (
            <div className={`mt-4 p-4 rounded-lg ${selectedAnswer === correctAnswer ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {selectedAnswer === correctAnswer ? (
                <p>Bravo ! C'est la bonne réponse !</p>
              ) : (
                <p>Ce n'est pas la bonne réponse. La bonne réponse était : {currentQuestionData.options[correctAnswer]}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleQuizComplete = (score: number) => {
    setLastScore(score);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Quiz Éducatifs</h1>
      <p className="text-xl text-white/70 mb-12">
        Teste tes connaissances et apprends en t'amusant
      </p>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Quiz recommandés par ton enseignant</h2>
          <div className="grid gap-4">
            <QuizCard
              title={teacherRecommendedQuiz.title}
              description={teacherRecommendedQuiz.description}
              icon={<AcademicCapIcon className="w-6 h-6" />}
              onClick={() => setSelectedQuiz(teacherRecommendedQuiz)}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Quiz par matière</h2>
          <div className="grid gap-4">
            <QuizCard
              title={mathQuizCE1.title}
              description={mathQuizCE1.description}
              icon={<AcademicCapIcon className="w-6 h-6" />}
              onClick={() => setSelectedQuiz(mathQuizCE1)}
            />
            <QuizCard
              title={frenchQuizCE1.title}
              description={frenchQuizCE1.description}
              icon={<BookOpenIcon className="w-6 h-6" />}
              onClick={() => setSelectedQuiz(frenchQuizCE1)}
            />
          </div>
        </section>
      </div>

      {selectedQuiz && (
        <QuizSession
          quiz={selectedQuiz}
          onComplete={handleQuizComplete}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
}
