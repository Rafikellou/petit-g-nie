import { FC } from 'react';
import { QuizOption } from './QuizOption';
import type { QuizQuestion as QuizQuestionType } from '@/data/quizzes';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  isRevealed: boolean;
}

export const QuizQuestion: FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isRevealed
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{question.question}</h3>
      
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            label={option}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.correctAnswer}
            isRevealed={isRevealed}
            onClick={() => onSelectAnswer(index)}
            disabled={isRevealed}
          />
        ))}
      </div>

      {isRevealed && (
        <div className={`p-4 rounded-lg mt-4 ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-500/20 border border-green-500/50'
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          <p className="font-medium mb-2">
            {selectedAnswer === question.correctAnswer
              ? '🎉 Bravo ! C\'est la bonne réponse !'
              : '😮 Pas tout à fait...'}
          </p>
          <p className="text-white/70">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
