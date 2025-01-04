import { FC } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizOptionProps {
  label: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const QuizOption: FC<QuizOptionProps> = ({
  label,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled
}) => {
  return (
    <button
      className={cn(
        'w-full p-4 rounded-lg text-left transition-all duration-200 tap-target touch-manipulation',
        'flex items-center justify-between gap-3',
        'border hover:border-white/30',
        isSelected && !isRevealed && 'border-primary bg-primary/10',
        isRevealed && isSelected && isCorrect && 'border-green-500 bg-green-500/20',
        isRevealed && isSelected && !isCorrect && 'border-red-500 bg-red-500/20',
        isRevealed && !isSelected && isCorrect && 'border-green-500/50 bg-green-500/10',
        disabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex-grow text-base break-words">{label}</span>
      {isRevealed && (
        isSelected ? (
          isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )
        ) : isCorrect ? (
          <CheckCircle className="w-5 h-5 text-green-500/50 flex-shrink-0" />
        ) : null
      )}
    </button>
  );
};
