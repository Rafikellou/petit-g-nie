import { Story } from '@/types/story';
import { Character } from '@/types/character';

// Base de données des personnages et leurs histoires
export const characters: Record<string, Character> = {
  'anna': {
    id: 'anna',
    name: 'Anna l\'Aventurière',
    description: 'Explore des mondes mystérieux et vis des aventures palpitantes',
    image: '/characters/anna.png',
    gradient: 'from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-400',
    stories: [
      {
        id: 'tresor-foret',
        title: 'Le Trésor de la Foret Mysterieuse',
        description: 'Anna découvre une carte au trésor qui la mène dans une forêt enchantée pleine de surprises.',
        duration: '15 min',
        image: '/images/tresor-foret.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'anna',
          name: 'Anna l\'Aventurière',
          image: '/characters/anna.png',
          gradient: 'from-purple-500/20 to-pink-500/20',
          textColor: 'text-purple-400'
        }
      },
      {
        id: 'volcan-enchante',
        title: 'Aventures au Volcan Enchante',
        description: 'Une quête périlleuse au sommet d\'un volcan magique où vivent d\'étranges créatures.',
        duration: '20 min',
        image: '/images/volcan-enchante.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'anna',
          name: 'Anna l\'Aventurière',
          image: '/characters/anna.png',
          gradient: 'from-purple-500/20 to-pink-500/20',
          textColor: 'text-purple-400'
        }
      },
      {
        id: 'vallee-perdue',
        title: 'La Mission dans la Vallee Perdue',
        description: 'Anna doit retrouver une fleur rare dans une vallée oubliée pour sauver son village.',
        duration: '25 min',
        image: '/images/vallee-perdue.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'anna',
          name: 'Anna l\'Aventurière',
          image: '/characters/anna.png',
          gradient: 'from-purple-500/20 to-pink-500/20',
          textColor: 'text-purple-400'
        }
      }
    ]
  },
  'max': {
    id: 'max',
    name: 'Max le Magicien',
    description: 'Découvre les secrets de la magie et de la science',
    image: '/characters/max.png',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-400',
    stories: [
      {
        id: 'formule-secrete',
        title: 'La Formule Secrete',
        description: 'Max doit créer une potion magique pour aider ses amis, mais la recette est mystérieusement codée.',
        duration: '15 min',
        image: '/images/formule-secrete.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'max',
          name: 'Max le Magicien',
          image: '/characters/max.png',
          gradient: 'from-blue-500/20 to-cyan-500/20',
          textColor: 'text-blue-400'
        }
      },
      {
        id: 'ecole-magie',
        title: 'Premier Jour a l\'Ecole de Magie',
        description: 'Max découvre son nouveau monde à l\'académie de magie et fait des rencontres surprenantes.',
        duration: '20 min',
        image: '/images/ecole-magie.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'max',
          name: 'Max le Magicien',
          image: '/characters/max.png',
          gradient: 'from-blue-500/20 to-cyan-500/20',
          textColor: 'text-blue-400'
        }
      },
      {
        id: 'competition-sorts',
        title: 'La Grande Competition de Sorts',
        description: 'Max participe à un tournoi de magie où il devra faire preuve de créativité et d\'ingéniosité.',
        duration: '25 min',
        image: '/images/competition-sorts.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'max',
          name: 'Max le Magicien',
          image: '/characters/max.png',
          gradient: 'from-blue-500/20 to-cyan-500/20',
          textColor: 'text-blue-400'
        }
      }
    ]
  },
  'sophie': {
    id: 'sophie',
    name: 'Sophie la Scientifique',
    description: 'Apprends les mystères de la science de façon amusante',
    image: '/characters/sophie.png',
    gradient: 'from-green-500/20 to-teal-500/20',
    textColor: 'text-green-400',
    stories: [
      {
        id: 'labo-fou',
        title: 'Le Laboratoire Fou',
        description: 'Sophie fait des expériences amusantes dans son laboratoire et découvre des réactions surprenantes.',
        duration: '15 min',
        image: '/images/labo-fou.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'sophie',
          name: 'Sophie la Scientifique',
          image: '/characters/sophie.png',
          gradient: 'from-green-500/20 to-teal-500/20',
          textColor: 'text-green-400'
        }
      },
      {
        id: 'robot-ami',
        title: 'Mon Ami le Robot',
        description: 'Sophie construit un robot qui devient son meilleur ami et l\'aide dans ses aventures scientifiques.',
        duration: '20 min',
        image: '/images/robot-ami.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'sophie',
          name: 'Sophie la Scientifique',
          image: '/characters/sophie.png',
          gradient: 'from-green-500/20 to-teal-500/20',
          textColor: 'text-green-400'
        }
      },
      {
        id: 'voyage-microscopique',
        title: 'Le Voyage Microscopique',
        description: 'Sophie rétrécit pour explorer le monde des atomes et des molécules.',
        duration: '25 min',
        image: '/images/voyage-microscopique.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'sophie',
          name: 'Sophie la Scientifique',
          image: '/characters/sophie.png',
          gradient: 'from-green-500/20 to-teal-500/20',
          textColor: 'text-green-400'
        }
      }
    ]
  },
  'tom': {
    id: 'tom',
    name: 'Tom le Voyageur',
    description: 'Voyage à travers le temps et l\'espace',
    image: '/characters/tom.png',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    textColor: 'text-yellow-400',
    stories: [
      {
        id: 'dinosaures',
        title: 'A l\'Epoque des Dinosaures',
        description: 'Tom remonte le temps jusqu\'à l\'ère des dinosaures et fait des découvertes fascinantes.',
        duration: '15 min',
        image: '/images/dinosaures.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'tom',
          name: 'Tom le Voyageur',
          image: '/characters/tom.png',
          gradient: 'from-yellow-500/20 to-orange-500/20',
          textColor: 'text-yellow-400'
        }
      },
      {
        id: 'pyramides',
        title: 'Le Secret des Pyramides',
        description: 'Tom explore l\'Égypte antique et aide à résoudre le mystère de la construction des pyramides.',
        duration: '20 min',
        image: '/images/pyramides.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'tom',
          name: 'Tom le Voyageur',
          image: '/characters/tom.png',
          gradient: 'from-yellow-500/20 to-orange-500/20',
          textColor: 'text-yellow-400'
        }
      },
      {
        id: 'futur',
        title: 'Voyage dans le Futur',
        description: 'Tom découvre un monde futuriste rempli de technologies étonnantes et de défis à relever.',
        duration: '25 min',
        image: '/images/futur.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'tom',
          name: 'Tom le Voyageur',
          image: '/characters/tom.png',
          gradient: 'from-yellow-500/20 to-orange-500/20',
          textColor: 'text-yellow-400'
        }
      }
    ]
  },
  'leo': {
    id: 'leo',
    name: 'Léo l\'Astronaute',
    description: 'Explore l\'espace et ses mystères infinis',
    image: '/characters/leo.png',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    textColor: 'text-indigo-400',
    stories: [
      {
        id: 'premiere-mission',
        title: 'Ma Premiere Mission Spatiale',
        description: 'Léo part pour sa première mission dans l\'espace et découvre la vie en apesanteur.',
        duration: '15 min',
        image: '/images/premiere-mission.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'leo',
          name: 'Léo l\'Astronaute',
          image: '/characters/leo.png',
          gradient: 'from-indigo-500/20 to-purple-500/20',
          textColor: 'text-indigo-400'
        }
      },
      {
        id: 'station-spatiale',
        title: 'Aventures sur la Station Spatiale',
        description: 'Léo vit des moments excitants sur la station spatiale internationale.',
        duration: '20 min',
        image: '/images/station-spatiale.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'leo',
          name: 'Léo l\'Astronaute',
          image: '/characters/leo.png',
          gradient: 'from-indigo-500/20 to-purple-500/20',
          textColor: 'text-indigo-400'
        }
      },
      {
        id: 'mars',
        title: 'Mission vers Mars',
        description: 'Léo participe à la première mission habitée vers la planète rouge.',
        duration: '25 min',
        image: '/images/mars.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'leo',
          name: 'Léo l\'Astronaute',
          image: '/characters/leo.png',
          gradient: 'from-indigo-500/20 to-purple-500/20',
          textColor: 'text-indigo-400'
        }
      }
    ]
  },
  'emma': {
    id: 'emma',
    name: 'Emma l\'Exploratrice des Océans',
    description: 'Plonge dans les profondeurs des océans',
    image: '/characters/emma.png',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    textColor: 'text-cyan-400',
    stories: [
      {
        id: 'recif-corail',
        title: 'Le Recif de Corail',
        description: 'Emma découvre la vie colorée d\'un récif de corail et ses habitants extraordinaires.',
        duration: '15 min',
        image: '/images/recif-corail.jpg',
        difficulty: 'facile',
        audioUrl: '',
        character: {
          id: 'emma',
          name: 'Emma l\'Exploratrice des Océans',
          image: '/characters/emma.png',
          gradient: 'from-cyan-500/20 to-blue-500/20',
          textColor: 'text-cyan-400'
        }
      },
      {
        id: 'cite-perdue',
        title: 'La Cite Perdue de l\'Atlantide',
        description: 'Emma explore les ruines d\'une ancienne cité sous-marine mystérieuse.',
        duration: '20 min',
        image: '/images/cite-perdue.jpg',
        difficulty: 'moyen',
        audioUrl: '',
        character: {
          id: 'emma',
          name: 'Emma l\'Exploratrice des Océans',
          image: '/characters/emma.png',
          gradient: 'from-cyan-500/20 to-blue-500/20',
          textColor: 'text-cyan-400'
        }
      },
      {
        id: 'abysses',
        title: 'Les Mysteres des Abysses',
        description: 'Emma plonge dans les profondeurs océaniques et rencontre des créatures bioluminescentes.',
        duration: '25 min',
        image: '/images/abysses.jpg',
        difficulty: 'avancé',
        audioUrl: '',
        character: {
          id: 'emma',
          name: 'Emma l\'Exploratrice des Océans',
          image: '/characters/emma.png',
          gradient: 'from-cyan-500/20 to-blue-500/20',
          textColor: 'text-cyan-400'
        }
      }
    ]
  }
};
