'use client';

import React, { useState } from 'react';

interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface QuestionData {
  question: string;
  options: QuestionOptions;
  correctAnswer: string;
  explanation: string;
}

interface QuestionDisplayProps {
  content: string;
  showRawContent?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ content, showRawContent = true }) => {
  const [showFormatted, setShowFormatted] = useState(false);
  
  // Tente de parser le contenu JSON
  const tryParseQuestion = (): QuestionData | null => {
    try {
      // Essayer de trouver un objet JSON dans le contenu
      const jsonRegex = /\{[\s\S]*\}|\[[\s\S]*\]/;
      const match = content.match(jsonRegex);
      
      if (match) {
        const jsonContent = match[0];
        const parsed = JSON.parse(jsonContent);
        
        // Vérifier si c'est une question valide
        if (parsed.question && parsed.options && parsed.correctAnswer) {
          return parsed as QuestionData;
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du parsing de la question:", error);
      return null;
    }
  };

  const questionData = tryParseQuestion();
  
  // Afficher le contenu brut si demandé et que le mode formaté n'est pas activé
  if (showRawContent && !showFormatted) {
    return (
      <div className="space-y-4">
        <div className="whitespace-pre-wrap">{content}</div>
        
        {questionData && (
          <button 
            onClick={() => setShowFormatted(true)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Afficher en format quiz
          </button>
        )}
      </div>
    );
  }

  // Si le contenu n'est pas une question valide, l'afficher tel quel
  if (!questionData) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Afficher la question dans un format plus lisible
  return (
    <div className="space-y-4">
      {showRawContent && (
        <button 
          onClick={() => setShowFormatted(false)}
          className="mb-2 text-sm text-indigo-400 hover:text-indigo-300"
        >
          Afficher le texte brut
        </button>
      )}
      
      <div className="font-medium">{questionData.question}</div>
      
      <div className="space-y-2">
        {Object.entries(questionData.options).map(([key, value]) => (
          <div 
            key={key} 
            className={`p-2 rounded-md ${
              key === questionData.correctAnswer 
                ? 'bg-green-900/30 border border-green-500/50' 
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            <span className="font-medium mr-2">{key}:</span> {value}
          </div>
        ))}
      </div>
      
      {questionData.explanation && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-md">
          <div className="font-medium mb-1">Explication:</div>
          <div>{questionData.explanation}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
