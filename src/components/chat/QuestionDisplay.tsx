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

// Fonction pour nettoyer le Markdown (astérisques, etc.) des réponses de Deepseek
const cleanMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Supprimer les astérisques utilisés pour le gras et l'italique
  let cleaned = text.replace(/\*\*(.+?)\*\*/g, '$1'); // Supprimer les ** pour le gras
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');       // Supprimer les * pour l'italique
  
  // Supprimer les délimiteurs de titres
  cleaned = cleaned.replace(/^#+\s+(.+)$/gm, '$1');
  
  // Supprimer les délimiteurs de code inline
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Supprimer les liens Markdown mais garder le texte
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  return cleaned;
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ content, showRawContent = true }) => {
  const [showFormatted, setShowFormatted] = useState(false);
  
  // Vérifie si le contenu est un JSON formaté (provenant de formattedContent)
  const isJsonContent = typeof content === 'string' && (
    (content.startsWith('{') && content.endsWith('}')) ||
    (content.startsWith('[') && content.endsWith(']'))
  );
  
  // Tente de parser le contenu JSON seulement s'il a l'air d'être déjà au format JSON
  const tryParseQuestion = (): QuestionData | null => {
    if (!isJsonContent) return null;
    
    try {
      const parsed = JSON.parse(content);
      
      // Vérifier si c'est une question valide
      if (parsed.question && parsed.options && parsed.correctAnswer) {
        return parsed as QuestionData;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du parsing de la question:", error);
      return null;
    }
  };

  const questionData = tryParseQuestion();
  
  // Nettoyer le contenu Markdown pour l'affichage
  const cleanedContent = cleanMarkdown(content);
  
  // Par défaut, afficher toujours le contenu brut pour les réponses non formatées
  // ou si showRawContent est true et que le mode formaté n'est pas activé
  if (!isJsonContent || (showRawContent && !showFormatted)) {
    return (
      <div className="space-y-4">
        <div className="whitespace-pre-wrap">{cleanedContent}</div>
        
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
    return <div className="whitespace-pre-wrap">{cleanedContent}</div>;
  }

  // Nettoyer les champs de la question pour l'affichage
  const cleanedQuestion = {
    ...questionData,
    question: cleanMarkdown(questionData.question),
    options: {
      A: cleanMarkdown(questionData.options.A),
      B: cleanMarkdown(questionData.options.B),
      C: cleanMarkdown(questionData.options.C),
      D: cleanMarkdown(questionData.options.D)
    },
    explanation: cleanMarkdown(questionData.explanation)
  };

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
      
      <div className="font-medium">{cleanedQuestion.question}</div>
      
      <div className="space-y-2">
        {Object.entries(cleanedQuestion.options).map(([key, value]) => (
          <div 
            key={key} 
            className={`p-2 rounded-md ${
              key === cleanedQuestion.correctAnswer 
                ? 'bg-green-900/30 border border-green-500/50' 
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            <span className="font-medium mr-2">{key}:</span> {value}
          </div>
        ))}
      </div>
      
      {cleanedQuestion.explanation && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-md">
          <div className="font-medium mb-1">Explication:</div>
          <div>{cleanedQuestion.explanation}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
