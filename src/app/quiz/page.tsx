'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Quiz, QuizQuestion, mathQuizCE1, frenchQuizCE1, teacherRecommendedQuiz } from '@/data/quizData';
import { ArrowLeft, GraduationCap, Book, CheckCircle, XCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stats?: {
    completed: number;
    total: number;
    avgScore: number;
  };
  onClick: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ title, description, icon: Icon, stats, onClick }) => (
  <button
    onClick={onClick}
    className="glass-card p-6 hover:bg-white/5 transition tap-target touch-manipulation text-left w-full"
  >
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-white/70 mb-4">{description}</p>
        {stats && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-white/60">
              <CheckCircle className="w-4 h-4" />
              <span>{stats.completed}/{stats.total}</span>
            </div>
            <div className="flex items-center space-x-1 text-white/60">
              <Award className="w-4 h-4" />
              <span>{stats.avgScore}%</span>
            </div>
          </div>
        )}
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = parseInt(selectedAnswer, 10) === currentQuestion.correctAnswer;
    setIsAnswerChecked(true);
    setAnswers([...answers, isCorrect]);

    if (isCorrect) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      const finalScore = Math.round((score / quiz.questions.length) * 100);
      onComplete(finalScore);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progression */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white flex items-center space-x-2 transition tap-target touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quitter</span>
        </button>
        <div className="text-sm text-white/60">
          Question {currentQuestionIndex + 1}/{quiz.questions.length}
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h2 className="text-xl font-medium">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isAnswerChecked && setSelectedAnswer(index.toString())}
              disabled={isAnswerChecked}
              className={`w-full p-4 rounded-lg text-left transition tap-target touch-manipulation ${
                isAnswerChecked
                  ? index === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border border-green-500/40'
                    : parseInt(selectedAnswer!, 10) === index
                    ? 'bg-red-500/20 border border-red-500/40'
                    : 'bg-white/5 border border-white/10'
                  : parseInt(selectedAnswer!, 10) === index
                  ? 'bg-primary/20 border border-primary'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {!isAnswerChecked ? (
          <Button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            className="w-full min-h-[44px]"
          >
            Vérifier
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            className="w-full min-h-[44px]"
          >
            {isLastQuestion ? 'Terminer' : 'Question suivante'}
          </Button>
        )}
      </div>

      {/* Indicateurs de réponses */}
      <div className="flex justify-center space-x-2">
        {answers.map((isCorrect, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        ))}
        {Array(quiz.questions.length - answers.length)
          .fill(null)
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-2 h-2 rounded-full bg-white/20"
            />
          ))}
      </div>
    </div>
  );
};

const QuizPage: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  const quizzes = [
    {
      quiz: mathQuizCE1,
      title: 'Quiz de Mathématiques',
      description: 'Teste tes connaissances en mathématiques',
      icon: GraduationCap,
      stats: {
        completed: 3,
        total: 5,
        avgScore: 85
      }
    },
    {
      quiz: frenchQuizCE1,
      title: 'Quiz de Français',
      description: 'Révise ton français de manière ludique',
      icon: Book,
      stats: {
        completed: 4,
        total: 5,
        avgScore: 90
      }
    }
  ];

  const handleQuizComplete = (score: number) => {
    setLastScore(score);
    setShowResults(true);
    if (score > 80) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
      });
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
            <h1 className="text-xl font-bold">Quiz</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {selectedQuiz ? (
          showResults ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Quiz terminé !</h2>
                <p className="text-white/70">Ton score : {lastScore}%</p>
              </div>
              <Button
                onClick={() => {
                  setSelectedQuiz(null);
                  setShowResults(false);
                }}
                className="min-h-[44px]"
              >
                Retour aux quiz
              </Button>
            </div>
          ) : (
            <QuizSession
              quiz={selectedQuiz}
              onComplete={handleQuizComplete}
              onClose={() => setSelectedQuiz(null)}
            />
          )
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Quiz disponibles</h2>
              <p className="text-white/70">Choisis un quiz pour tester tes connaissances</p>
            </div>

            <div className="space-y-4">
              {quizzes.map((item, index) => (
                <QuizCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  stats={item.stats}
                  onClick={() => setSelectedQuiz(item.quiz)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
