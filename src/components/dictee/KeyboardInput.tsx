'use client';

import { FC, useState } from 'react';

export const KeyboardInput: FC = () => {
  const [text, setText] = useState('');

  return (
    <div className="space-y-4">
      <div className="relative bg-white/5 rounded-lg p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[400px] bg-transparent border-2 border-white/10 rounded-lg p-4 focus:outline-none focus:border-white/30 resize-none"
          placeholder="Écris ta dictée ici..."
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setText('')}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          Effacer
        </button>
      </div>
    </div>
  );
};
