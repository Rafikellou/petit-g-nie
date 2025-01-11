interface QuestionDisplayProps {
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

export function QuestionDisplay({ question, options, correctAnswer, explanation }: QuestionDisplayProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6 text-gray-100">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-300">Question</h3>
        <p className="text-lg">{question}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-300">Options</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(options).map(([key, value]) => (
            <div
              key={key}
              className={`p-4 rounded-lg ${
                key === correctAnswer
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-gray-800/50'
              }`}
            >
              <span className="font-semibold">{key}.</span> {value}
              {key === correctAnswer && (
                <span className="ml-2 text-green-400">(Bonne réponse)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-300">Explication</h3>
        <p className="text-gray-300 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
