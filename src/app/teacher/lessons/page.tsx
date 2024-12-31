import { Book, Image, FileText } from 'lucide-react';

const mockLessons = [
  {
    id: '1',
    title: 'Les verbes du premier groupe',
    subject: 'Français',
    type: 'text',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Les additions à deux chiffres',
    subject: 'Mathématiques',
    type: 'image',
    date: '2024-01-14',
  },
];

export default function LessonsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Leçons</h1>
          <p className="text-gray-400">
            Ajoutez et gérez les leçons pour vos élèves
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FileText className="w-4 h-4" />
            Ajouter du texte
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            <Image className="w-4 h-4" />
            Uploader une image
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-400">{lesson.subject}</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                    {lesson.type === 'text' ? 'Texte' : 'Image'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-400">
                  Ajoutée le {new Date(lesson.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  Modifier
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
