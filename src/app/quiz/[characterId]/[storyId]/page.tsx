'use client';

import { FC, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import { characters } from '@/data/characters';
import { quizzes } from '@/data/quizzes';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/contexts/AchievementsContext';
import { CharacterStory } from '@/types/story-types';
import { Button } from '@/components/ui/ios-button';
import confetti from 'canvas-confetti';

interface Props {
  params: {
    characterId: string;
    storyId: string;
  };
}

const QuizPage: FC<Props> = ({ params }) => {
  const router = useRouter();
  const character = characters[params.characterId];
  const story = character?.stories.find((s: CharacterStory) => s.id === params.storyId);
  const quiz = quizzes[`${params.characterId}-${params.storyId}`];
  const { progress, updateProgress } = useProgress();
  const { showBadgeUnlock } = useAchievements();

  if (!character || !story || !quiz) {
    notFound();
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [isQuestionRevealed, setIsQuestionRevealed] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSelectAnswer = (answerIndex: number) => {
    if (isQuestionRevealed) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleRevealAnswer = () => {
    setIsQuestionRevealed(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsQuestionRevealed(false);
    } else {
      // Calculer le score final
      const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore((correctAnswers / quiz.questions.length) * 100);

      // Sauvegarder le score
      const scores = JSON.parse(localStorage.getItem('quiz-scores') || '{}');
      scores[`${params.characterId}-${params.storyId}`] = correctAnswers;
      localStorage.setItem('quiz-scores', JSON.stringify(scores));
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setIsQuestionRevealed(false);
    setScore(null);
  };

  useEffect(() => {
    if (score !== null) {
      updateProgress({
        quizResults: [
          ...progress.quizResults,
          {
            score,
            subject: 'lecture',
            date: new Date().toISOString()
          }
        ]
      });
      // Check for badges based on quiz results
      const perfectScores = progress.quizResults.filter(result => result.score === 100).length + (score === 100 ? 1 : 0);
      if (perfectScores >= 5) {
        showBadgeUnlock('quiz_master');
      }
    }
  }, [score, updateProgress, showBadgeUnlock, params.characterId, params.storyId]);

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/stories/${params.characterId}/${params.storyId}`}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'histoire"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Quiz</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="glass-card p-6 space-y-6">
          {score === null ? (
            <>
              {/* En-tête du quiz */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gradient">
                  {quiz.title}
                </h1>
                <p className="text-white/70 text-sm">
                  {quiz.description}
                </p>
              </div>

              {/* Progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Question {currentQuestionIndex + 1} sur {quiz.questions.length}</span>
                  <span>{Math.round((currentQuestionIndex / quiz.questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${character.gradient}`}
                    style={{ width: `${(currentQuestionIndex / quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question courante */}
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={selectedAnswers[currentQuestionIndex]}
                onSelectAnswer={handleSelectAnswer}
                isRevealed={isQuestionRevealed}
              />

              {/* Boutons d'action */}
              <div className="pt-4">
                {!isQuestionRevealed ? (
                  <Button
                    onClick={handleRevealAnswer}
                    disabled={selectedAnswers[currentQuestionIndex] === null}
                    className="w-full min-h-[44px]"
                  >
                    Vérifier la réponse
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full min-h-[44px]"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1
                      ? 'Question suivante'
                      : 'Terminer le quiz'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            // Écran de résultat
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {score >= 80 ? '🎉 Félicitations !' : score >= 50 ? '👍 Bien joué !' : '😊 Continue tes efforts !'}
                </h2>
                <p className="text-white/70">Tu as obtenu un score de {Math.round(score)}%</p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full min-h-[44px]"
                >
                  Recommencer le quiz
                </Button>
                <Link
                  href={`/characters/${params.characterId}`}
                  className="block"
                >
                  <Button
                    className="w-full min-h-[44px]"
                  >
                    Retour aux histoires
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Indicateurs de réponses */}
        {score === null && (
          <div className="flex justify-center space-x-2 mt-6">
            {selectedAnswers.map((answer, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestionIndex
                    ? 'bg-primary'
                    : answer !== null
                    ? 'bg-white/40'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
