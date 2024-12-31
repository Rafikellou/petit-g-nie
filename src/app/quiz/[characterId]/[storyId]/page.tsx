'use client';

import { FC, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { characters } from '@/data/characters';
import { quizzes } from '@/data/quizzes';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/contexts/AchievementsContext';
import { CharacterStory } from '@/types/story-types';

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
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative">
        <Link
          href={`/stories/${params.characterId}/${params.storyId}`}
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'histoire
        </Link>

        <div className="glass-card p-8">
          {score === null ? (
            <>
              {/* En-tête du quiz */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gradient mb-4">
                  Quiz : {quiz.title}
                </h1>
                <p className="text-white/70">
                  {quiz.description}
                </p>
              </div>

              {/* Progression */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-white/50 mb-2">
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
              <div className="mt-8 flex justify-end gap-4">
                {!isQuestionRevealed ? (
                  <button
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r ${character.gradient} text-white hover:scale-105 transition-transform`}
                    onClick={handleRevealAnswer}
                    disabled={selectedAnswers[currentQuestionIndex] === null}
                  >
                    Vérifier la réponse
                  </button>
                ) : (
                  <button
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r ${character.gradient} text-white hover:scale-105 transition-transform`}
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex < quiz.questions.length - 1
                      ? 'Question suivante'
                      : 'Terminer le quiz'}
                  </button>
                )}
              </div>
            </>
          ) : (
            // Écran de résultat
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                {score >= 80 ? '🎉 Félicitations !' : score >= 50 ? '👍 Bien joué !' : '😊 Continue tes efforts !'}
              </h2>
              <p className="text-2xl mb-8">
                Tu as obtenu un score de {Math.round(score)}%
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  onClick={handleRetry}
                >
                  Recommencer le quiz
                </button>
                <Link
                  href={`/characters/${params.characterId}`}
                  className={`px-6 py-3 rounded-lg bg-gradient-to-r ${character.gradient} text-white hover:scale-105 transition-transform`}
                >
                  Retour aux histoires
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default QuizPage;
