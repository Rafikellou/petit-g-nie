import { FC } from 'react';
import { QuizOption } from './QuizOption';
import type { QuizQuestion as QuizQuestionType } from '@/data/quizzes';
import { CheckCircle, XCircle } from 'lucide-react';

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium leading-snug">{question.question}</h3>
      
      <div className="space-y-3">
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
        <div className={`p-4 rounded-lg ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-500/20 border border-green-500/50'
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          <div className="flex items-start space-x-3">
            {selectedAnswer === question.correctAnswer ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium mb-1">
                {selectedAnswer === question.correctAnswer
                  ? 'Bravo ! C\'est la bonne réponse !'
                  : 'Pas tout à fait...'}
              </p>
              <p className="text-white/70 text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
