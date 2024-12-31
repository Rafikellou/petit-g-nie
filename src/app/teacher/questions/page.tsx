'use client';

import { mathQuizCE1, frenchQuizCE1, teacherRecommendedQuiz } from '@/data/quizData';

export default function QuestionsPage() {
  // Combine all questions from different quizzes
  const allQuestions = [
    ...mathQuizCE1.questions,
    ...frenchQuizCE1.questions,
    ...teacherRecommendedQuiz.questions,
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Questions</h1>
          <p className="text-gray-400">
            Gérez les questions proposées à vos élèves
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
          Créer une question
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="space-y-4">
          {allQuestions.map((question) => (
            <div
              key={question.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400">
                    {question.subject === 'math' ? 'Mathématiques' : 'Français'}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                    QCM
                  </span>
                </div>
                <p className="font-medium">{question.question}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        index === question.correctAnswer
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
