import { BarChart, Share2 } from 'lucide-react';

const mockStudents = [
  {
    id: '1',
    name: 'Lucas Martin',
    grade: 'CE2',
    quizAverage: 85,
    storiesCompleted: 3,
    lastActivity: '2024-01-15',
  },
  {
    id: '2',
    name: 'Emma Bernard',
    grade: 'CM1',
    quizAverage: 92,
    storiesCompleted: 5,
    lastActivity: '2024-01-14',
  },
];

export default function PerformancePage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Performances des élèves</h1>
          <p className="text-gray-400">
            Suivez les progrès de vos élèves et partagez les résultats
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
          <Share2 className="w-4 h-4" />
          Partager avec les parents
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Vue d'ensemble</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Moyenne de la classe</div>
              <div className="text-2xl font-bold">88%</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Histoires terminées</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Quiz complétés</div>
              <div className="text-2xl font-bold">156</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Performances individuelles</h2>
          <div className="space-y-4">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium mb-1">{student.name}</div>
                  <div className="text-sm text-gray-400">{student.grade}</div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Moyenne des quiz
                    </div>
                    <div className="font-semibold">{student.quizAverage}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Histoires terminées
                    </div>
                    <div className="font-semibold">{student.storiesCompleted}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Dernière activité
                    </div>
                    <div className="font-semibold">
                      {new Date(student.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
