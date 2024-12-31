export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: 'math' | 'french';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'french' | 'mixed';
  level: string;
  questions: QuizQuestion[];
}

// Quiz de mathématiques CE1
export const mathQuizCE1: Quiz = {
  id: 'math-ce1-1',
  title: 'Les nombres jusqu\'à 100',
  description: 'Révise les nombres, les additions et les soustractions',
  subject: 'math',
  level: 'CE1',
  questions: [
    {
      id: 'math-1',
      question: 'Combien font 25 + 18 ?',
      options: ['42', '43', '44', '45'],
      correctAnswer: 1,
      subject: 'math'
    },
    {
      id: 'math-2',
      question: 'Quel nombre vient juste après 59 ?',
      options: ['58', '59', '60', '61'],
      correctAnswer: 2,
      subject: 'math'
    },
    {
      id: 'math-3',
      question: 'Combien font 30 - 12 ?',
      options: ['18', '17', '19', '16'],
      correctAnswer: 0,
      subject: 'math'
    },
    {
      id: 'math-4',
      question: 'Range ces nombres du plus petit au plus grand : 45, 54, 35, 53. Quel est le premier ?',
      options: ['45', '35', '54', '53'],
      correctAnswer: 1,
      subject: 'math'
    },
    {
      id: 'math-5',
      question: 'Dans 42, combien y a-t-il de dizaines ?',
      options: ['2', '4', '42', '24'],
      correctAnswer: 1,
      subject: 'math'
    },
    {
      id: 'math-6',
      question: 'Combien font 15 + 7 ?',
      options: ['21', '22', '23', '24'],
      correctAnswer: 1,
      subject: 'math'
    },
    {
      id: 'math-7',
      question: 'Range ces nombres du plus grand au plus petit : 28, 82, 28, 22',
      options: ['82, 28, 28, 22', '28, 82, 22, 28', '82, 22, 28, 28', '22, 28, 28, 82'],
      correctAnswer: 0,
      subject: 'math'
    },
    {
      id: 'math-8',
      question: 'Combien font 40 - 15 ?',
      options: ['25', '24', '26', '23'],
      correctAnswer: 0,
      subject: 'math'
    },
    {
      id: 'math-9',
      question: 'Quel est le double de 8 ?',
      options: ['14', '15', '16', '17'],
      correctAnswer: 2,
      subject: 'math'
    },
    {
      id: 'math-10',
      question: 'Dans le nombre 75, quel est le chiffre des unités ?',
      options: ['7', '5', '75', '15'],
      correctAnswer: 1,
      subject: 'math'
    }
  ]
};

// Quiz de français CE1
export const frenchQuizCE1: Quiz = {
  id: 'french-ce1-1',
  title: 'Lecture et grammaire',
  description: 'Révise la lecture et la grammaire',
  subject: 'french',
  level: 'CE1',
  questions: [
    {
      id: 'french-1',
      question: 'Trouve le verbe dans la phrase : "Le chat mange sa pâtée."',
      options: ['chat', 'mange', 'pâtée', 'le'],
      correctAnswer: 1,
      subject: 'french'
    },
    {
      id: 'french-2',
      question: 'Quel est le féminin du mot "lion" ?',
      options: ['lione', 'lionne', 'lionne', 'lionnesse'],
      correctAnswer: 1,
      subject: 'french'
    },
    {
      id: 'french-3',
      question: 'Complète la phrase : "Les oiseaux ... dans le ciel."',
      options: ['vole', 'voles', 'volent', 'voler'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'french-4',
      question: 'Trouve le nom commun : "Marie joue dans le jardin."',
      options: ['Marie', 'joue', 'jardin', 'dans'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'french-5',
      question: 'Quel est le contraire du mot "grand" ?',
      options: ['gros', 'petit', 'large', 'court'],
      correctAnswer: 1,
      subject: 'french'
    },
    {
      id: 'french-6',
      question: 'Quel est le pluriel de "cheval" ?',
      options: ['chevals', 'chevaus', 'chevaux', 'chevales'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'french-7',
      question: 'Dans la phrase "Le petit chat dort.", quel est l\'adjectif ?',
      options: ['le', 'petit', 'chat', 'dort'],
      correctAnswer: 1,
      subject: 'french'
    },
    {
      id: 'french-8',
      question: 'Trouve le synonyme de "content" :',
      options: ['triste', 'fâché', 'heureux', 'fatigué'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'french-9',
      question: 'Complète avec le bon article : "... soleil brille."',
      options: ['le', 'la', 'les', 'un'],
      correctAnswer: 0,
      subject: 'french'
    },
    {
      id: 'french-10',
      question: 'Quel mot est mal orthographié ?',
      options: ['maison', 'chat', 'éléphant', 'élèphant'],
      correctAnswer: 3,
      subject: 'french'
    }
  ]
};

// Quiz recommandé par l'enseignant
export const teacherRecommendedQuiz: Quiz = {
  id: 'teacher-rec-1',
  title: 'Quiz recommandé du jour',
  description: 'Un mélange de questions de maths et de français',
  subject: 'mixed',
  level: 'CE1',
  questions: [
    {
      id: 'rec-1',
      question: 'Combien font 15 + 7 ?',
      options: ['21', '22', '23', '24'],
      correctAnswer: 1,
      subject: 'math'
    },
    {
      id: 'rec-2',
      question: 'Quel est le contraire de "grand" ?',
      options: ['gros', 'large', 'petit', 'court'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'rec-3',
      question: 'Range ces nombres du plus grand au plus petit : 12, 21, 15, 51. Quel est le premier ?',
      options: ['12', '21', '15', '51'],
      correctAnswer: 3,
      subject: 'math'
    },
    {
      id: 'rec-4',
      question: 'Quel mot est au singulier ?',
      options: ['chats', 'maisons', 'arbre', 'chiens'],
      correctAnswer: 2,
      subject: 'french'
    },
    {
      id: 'rec-5',
      question: 'Combien font 20 - 8 ?',
      options: ['12', '11', '13', '10'],
      correctAnswer: 0,
      subject: 'math'
    },
    {
      id: 'rec-6',
      question: 'Trouve le verbe dans la phrase : "Paul lit un livre."',
      options: ['Paul', 'lit', 'un', 'livre'],
      correctAnswer: 1,
      subject: 'french'
    },
    {
      id: 'rec-7',
      question: 'Quel nombre est plus grand que 45 ?',
      options: ['40', '44', '46', '43'],
      correctAnswer: 2,
      subject: 'math'
    },
    {
      id: 'rec-8',
      question: 'Quelle est la première lettre de l\'alphabet ?',
      options: ['b', 'z', 'c', 'a'],
      correctAnswer: 3,
      subject: 'french'
    },
    {
      id: 'rec-9',
      question: 'Combien font 100 - 50 ?',
      options: ['50', '40', '60', '45'],
      correctAnswer: 0,
      subject: 'math'
    },
    {
      id: 'rec-10',
      question: 'Quel est le féminin de "directeur" ?',
      options: ['directrice', 'directeuse', 'directeure', 'directrisse'],
      correctAnswer: 0,
      subject: 'french'
    }
  ]
};
