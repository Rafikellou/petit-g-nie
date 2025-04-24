'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuestionEditor from './QuestionEditor';
import { Check, AlertTriangle } from 'lucide-react';

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

interface QuestionReviewProps {
  questions: QuizQuestion[];
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
  onGenerateActivity: () => void;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({ 
  questions, 
  onUpdateQuestions,
  onGenerateActivity
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionUpdate = (index: number, updatedQuestion: QuizQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    onUpdateQuestions(newQuestions);
  };

  const handleGenerateActivity = async () => {
    setIsSubmitting(true);
    try {
      await onGenerateActivity();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Révision des questions ({questions.length})</h2>
        <Button
          onClick={handleGenerateActivity}
          disabled={isSubmitting || questions.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
        >
          <Check size={18} className="mr-2" />
          {isSubmitting ? 'Création en cours...' : 'Créer le quiz'}
        </Button>
      </div>
      
      <div className="text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <AlertTriangle size={16} className="text-amber-500 mr-2" />
          <span>Vous pouvez modifier chaque question individuellement avant de créer le quiz final.</span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {questions.map((question, index) => (
          <QuestionEditor
            key={index}
            question={question}
            index={index}
            onUpdate={handleQuestionUpdate}
          />
        ))}
      </div>
      
      {questions.length > 0 && (
        <div className="pt-4 border-t border-gray-700 mt-6">
          <Button
            onClick={handleGenerateActivity}
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 flex items-center justify-center"
          >
            <Check size={18} className="mr-2" />
            {isSubmitting ? 'Création en cours...' : 'Créer et publier le quiz'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionReview;
