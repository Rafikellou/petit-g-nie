'use client';

import * as React from 'react';
import { Backspace } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KeyboardButton } from './KeyboardButton';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

export default function VirtualKeyboard({ onKeyPress, onBackspace }: VirtualKeyboardProps) {
  const rows = [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['w', 'x', 'c', 'v', 'b', 'n', 'é', 'è', 'à', 'ç'],
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-dark rounded-lg p-2 space-y-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-1">
          {row.map((key) => (
            <KeyboardButton
              key={key}
              onClick={() => onKeyPress(key)}
              className={cn(
                "w-8 h-10 sm:w-10 sm:h-12 flex items-center justify-center text-lg font-medium p-0"
              )}
            >
              {key}
            </KeyboardButton>
          ))}
        </div>
      ))}
      <div className="flex justify-center space-x-1">
        <KeyboardButton
          onClick={() => onKeyPress(' ')}
          className={cn(
            "w-48 h-10 sm:h-12 flex items-center justify-center text-lg font-medium"
          )}
        >
          espace
        </KeyboardButton>
        <KeyboardButton
          onClick={onBackspace}
          className={cn(
            "w-12 h-10 sm:h-12 flex items-center justify-center"
          )}
        >
          <Backspace className="w-6 h-6" />
        </KeyboardButton>
      </div>
    </div>
  );
}
