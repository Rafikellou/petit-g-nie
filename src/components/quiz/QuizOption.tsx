import { FC } from 'react';
import { cn } from '@/lib/utils';

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
        'w-full p-3 sm:p-4 rounded-lg text-left transition-all duration-200',
        'border hover:border-white/30 text-sm sm:text-base',
        isSelected && !isRevealed && 'border-white/50 bg-white/5',
        isRevealed && isSelected && isCorrect && 'border-green-500 bg-green-500/20',
        isRevealed && isSelected && !isCorrect && 'border-red-500 bg-red-500/20',
        isRevealed && !isSelected && isCorrect && 'border-green-500/50 bg-green-500/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-base sm:text-lg break-words">{label}</span>
    </button>
  );
};
