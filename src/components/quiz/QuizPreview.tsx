'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, ArrowLeft, Edit } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface QuizPreviewProps {
  questions: QuizQuestion[];
  onFinish: () => void;
  onEdit: () => void;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ questions, onFinish, onEdit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Réinitialiser l'état lorsque les questions changent
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsQuizCompleted(false);
  }, [questions]);

  const handleOptionSelect = (option: string) => {
    if (isAnswerRevealed) return;
    setSelectedOption(option);
  };

  const handleRevealAnswer = () => {
    if (!selectedOption) return;
    
    setIsAnswerRevealed(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      
      // Lancer des confettis pour une bonne réponse
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsQuizCompleted(true);
      
      // Lancer des confettis pour la fin du quiz
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  // Afficher l'écran de résultat final
  if (isQuizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz terminé !</h2>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
          <p className="text-lg">
            Vous avez obtenu <span className="font-bold text-indigo-400">{score}</span> sur <span className="font-bold">{questions.length}</span> questions
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onEdit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700"
          >
            <Edit size={18} className="mr-2" />
            Modifier le quiz
          </Button>
          
          <Button 
            onClick={onFinish}
            className="w-full py-3 bg-green-600 hover:bg-green-700"
          >
            <Check size={18} className="mr-2" />
            Publier le quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
      {/* Progression */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </div>
        <div className="w-1/2 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>
          
          {/* Options */}
          <div className="space-y-3 mb-6">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                disabled={isAnswerRevealed}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedOption === key
                    ? 'bg-indigo-600 border-indigo-400'
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                } ${
                  isAnswerRevealed && key === currentQuestion.correctAnswer
                    ? 'bg-green-600 border-green-400'
                    : isAnswerRevealed && selectedOption === key && selectedOption !== currentQuestion.correctAnswer
                      ? 'bg-red-600 border-red-400'
                      : ''
                } border`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedOption === key
                      ? 'bg-indigo-700'
                      : 'bg-gray-700'
                  }`}>
                    {key}
                  </div>
                  <span>{value}</span>
                  
                  {isAnswerRevealed && key === currentQuestion.correctAnswer && (
                    <Check size={20} className="ml-auto text-green-300" />
                  )}
                  {isAnswerRevealed && selectedOption === key && selectedOption !== currentQuestion.correctAnswer && (
                    <X size={20} className="ml-auto text-red-300" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Explication (visible après avoir répondu) */}
          {isAnswerRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg"
            >
              <h4 className="font-medium mb-1">Explication:</h4>
              <p>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Boutons de navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="px-4 py-2"
        >
          <ArrowLeft size={16} className="mr-2" />
          Précédent
        </Button>
        
        {!isAnswerRevealed ? (
          <Button
            onClick={handleRevealAnswer}
            disabled={!selectedOption}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700"
          >
            Vérifier
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="px-4 py-2 bg-green-600 hover:bg-green-700"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Suivant
                <ArrowRight size={16} className="ml-2" />
              </>
            ) : (
              <>
                Terminer
                <Check size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPreview;
