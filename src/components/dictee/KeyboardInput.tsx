'use client';

import { FC, useState, useEffect } from 'react';

export const KeyboardInput: FC = () => {
  const [text, setText] = useState('');
  const [isVirtualKeyboard, setIsVirtualKeyboard] = useState(false);

  useEffect(() => {
    // Détecte si l'utilisateur est sur mobile/tablette
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsVirtualKeyboard(isTouchDevice);
  }, []);

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
      
      {isVirtualKeyboard && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl p-4">
          {/* Ici, on pourrait ajouter un clavier virtuel personnalisé si nécessaire */}
        </div>
      )}
      
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
