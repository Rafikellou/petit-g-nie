export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  characterId: string;
  storyId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const quizzes: Record<string, Quiz> = {
  'anna-tresor-foret': {
    id: 'anna-tresor-foret',
    characterId: 'anna',
    storyId: 'tresor-foret',
    title: 'Le Trésor de la Forêt Mystérieuse',
    description: 'Vérifie ta compréhension de l\'histoire d\'Anna',
    questions: [
      {
        id: 'q1',
        question: 'Qu\'est-ce qu\'Anna trouve au début de l\'histoire ?',
        options: [
          'Une vieille chaussure',
          'Une carte au trésor',
          'Un téléphone portable',
          'Une clé magique'
        ],
        correctAnswer: 1,
        explanation: 'Anna trouve une carte au trésor mystérieuse qui la mène dans la forêt enchantée.'
      },
      {
        id: 'q2',
        question: 'Quel animal aide Anna dans sa quête ?',
        options: [
          'Un écureuil sage',
          'Un ours grognon',
          'Un lapin pressé',
          'Un hibou mystérieux'
        ],
        correctAnswer: 3,
        explanation: 'Le hibou mystérieux guide Anna à travers la forêt avec sa sagesse ancestrale.'
      },
      {
        id: 'q3',
        question: 'Quelle est la première épreuve qu\'Anna doit surmonter ?',
        options: [
          'Traverser un pont fragile',
          'Résoudre une énigme',
          'Grimper un grand arbre',
          'Nager dans une rivière'
        ],
        correctAnswer: 1,
        explanation: 'Anna doit d\'abord traverser un pont fragile qui teste son courage.'
      }
    ]
  },
  'max-formule-secrete': {
    id: 'max-formule-secrete',
    characterId: 'max',
    storyId: 'formule-secrete',
    title: 'La Formule Secrète',
    description: 'Teste tes connaissances sur l\'aventure de Max',
    questions: [
      {
        id: 'q1',
        question: 'Quel ingrédient manque à la potion de Max ?',
        options: [
          'Une plume de phénix',
          'Une larme de dragon',
          'Une feuille d\'or',
          'Une goutte de pluie d\'arc-en-ciel'
        ],
        correctAnswer: 3,
        explanation: 'Max a besoin d\'une goutte de pluie d\'arc-en-ciel pour compléter sa potion magique.'
      },
      {
        id: 'q2',
        question: 'Comment Max déchiffre-t-il le code de la recette ?',
        options: [
          'Avec une loupe magique',
          'En le lisant à l\'envers',
          'En le chauffant près du feu',
          'En utilisant un miroir enchanté'
        ],
        correctAnswer: 2,
        explanation: 'Max découvre que le code se révèle quand on le chauffe près du feu.'
      }
    ]
  },
  'sophie-labo-fou': {
    id: 'sophie-labo-fou',
    characterId: 'sophie',
    storyId: 'labo-fou',
    title: 'Le Laboratoire Fou',
    description: 'Vérifie ce que tu as appris dans le laboratoire de Sophie',
    questions: [
      {
        id: 'q1',
        question: 'Quelle expérience Sophie réalise-t-elle en premier ?',
        options: [
          'Un volcan en éruption',
          'Une lampe à lave',
          'Des cristaux qui poussent',
          'Une réaction colorée'
        ],
        correctAnswer: 1,
        explanation: 'Sophie commence par créer une lampe à lave avec de l\'huile et de l\'eau colorée.'
      },
      {
        id: 'q2',
        question: 'Que se passe-t-il quand Sophie mélange les mauvais produits ?',
        options: [
          'Une explosion de mousse',
          'De la fumée violette',
          'Des bulles géantes',
          'Un arc-en-ciel liquide'
        ],
        correctAnswer: 0,
        explanation: 'Le mélange crée une explosion de mousse qui recouvre tout le laboratoire !'
      }
    ]
  }
  // Autres quiz à ajouter...
};
