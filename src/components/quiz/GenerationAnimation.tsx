'use client';

import React from 'react';

const GenerationAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-indigo-500/20 shadow-lg">
      <div className="relative w-24 h-24 mb-6">
        {/* Cercles animés */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full border-4 border-t-indigo-500 border-r-indigo-400 border-b-indigo-300 border-l-indigo-200 animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border-4 border-t-indigo-300 border-r-indigo-200 border-b-indigo-100 border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full border-4 border-t-indigo-200 border-r-indigo-100 border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Icône au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Génération en cours</h3>
      <p className="text-indigo-300 text-center">Futur Génie crée 10 questions similaires à votre question modèle...</p>
      
      {/* Indicateur de progression */}
      <div className="w-full max-w-xs mt-6 bg-gray-700 rounded-full h-2.5">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default GenerationAnimation;
