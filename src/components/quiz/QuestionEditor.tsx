'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit, ChevronDown, ChevronUp } from 'lucide-react';

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

interface QuestionEditorProps {
  question: QuizQuestion;
  index: number;
  onUpdate: (index: number, updatedQuestion: QuizQuestion) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, index, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion>({ ...question });

  const handleSave = () => {
    onUpdate(index, editedQuestion);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion({ ...question });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (option: string, value: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };

  // Affichage en mode prévisualisation (comme l'enfant le verra)
  if (!isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-4 transition-all duration-300">
        <div 
          className="p-4 cursor-pointer flex justify-between items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
              {index + 1}
            </span>
            <h3 className="font-medium text-white">{question.question}</h3>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setIsExpanded(true);
              }}
              className="mr-2 text-gray-400 hover:text-white"
            >
              <Edit size={16} />
            </Button>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gray-700">
            <div className="grid grid-cols-1 gap-2 mb-4">
              {Object.entries(question.options).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`p-3 rounded-md flex items-center ${
                    key === question.correctAnswer 
                      ? 'bg-green-900/30 border border-green-500/50' 
                      : 'bg-gray-700 border border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    key === question.correctAnswer ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {key}
                  </div>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            
            {question.explanation && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-md">
                <div className="font-medium mb-1">Explication:</div>
                <div>{question.explanation}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Affichage en mode édition
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-indigo-500/50 mb-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-white flex items-center">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
            {index + 1}
          </span>
          Modifier la question
        </h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} className="mr-1" /> Annuler
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Check size={16} className="mr-1" /> Enregistrer
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Question</label>
          <Textarea 
            value={editedQuestion.question} 
            onChange={(e) => handleInputChange('question', e.target.value)}
            className="w-full bg-gray-700 border-gray-600"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(editedQuestion.options).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Option {key} {key === editedQuestion.correctAnswer && <span className="text-green-500">(Réponse correcte)</span>}
              </label>
              <Input 
                value={value} 
                onChange={(e) => handleOptionChange(key, e.target.value)}
                className="w-full bg-gray-700 border-gray-600"
              />
            </div>
          ))}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Réponse correcte</label>
          <div className="flex space-x-2">
            {Object.keys(editedQuestion.options).map((key) => (
              <Button 
                key={key}
                variant={editedQuestion.correctAnswer === key ? "default" : "outline"}
                className={editedQuestion.correctAnswer === key ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => handleInputChange('correctAnswer', key)}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Explication</label>
          <Textarea 
            value={editedQuestion.explanation} 
            onChange={(e) => handleInputChange('explanation', e.target.value)}
            className="w-full bg-gray-700 border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
