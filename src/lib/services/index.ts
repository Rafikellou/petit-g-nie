export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Audiobook {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  coverUrl?: string;
}

// Service pour les quiz
export const quizService = {
  async getQuizQuestions(level: string): Promise<Question[]> {
    // Pour la démo, on retourne des questions statiques
    return [
      {
        id: '1',
        text: 'Quelle est la couleur du ciel ?',
        options: ['Bleu', 'Rouge', 'Vert', 'Jaune'],
        correctAnswer: 0,
        explanation: 'Le ciel apparaît bleu à cause de la diffusion de la lumière dans l\'atmosphère.'
      },
      {
        id: '2',
        text: 'Combien font 2 + 2 ?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: '2 + 2 = 4'
      }
    ];
  }
};

// Service pour les livres audio
export const audiobookService = {
  async getAudiobooks(): Promise<Audiobook[]> {
    // Pour la démo, on retourne des livres audio statiques
    return [
      {
        id: '1',
        title: 'Les Trois Petits Cochons',
        description: 'L\'histoire classique des trois petits cochons et du grand méchant loup.',
        audioUrl: '/audio/trois-petits-cochons.mp3',
        duration: 300,
        coverUrl: '/images/trois-petits-cochons.jpg'
      },
      {
        id: '2',
        title: 'Le Petit Chaperon Rouge',
        description: 'L\'aventure du Petit Chaperon Rouge dans la forêt.',
        audioUrl: '/audio/chaperon-rouge.mp3',
        duration: 240,
        coverUrl: '/images/chaperon-rouge.jpg'
      }
    ];
  },

  async saveProgress(userId: string, bookId: string, progress: number, timestamp: number): Promise<void> {
    // À implémenter avec une vraie base de données
    console.log('Saving progress:', { userId, bookId, progress, timestamp });
  }
};
