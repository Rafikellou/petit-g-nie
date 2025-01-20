export interface EnglishWord {
  word: string;
  translation: string;
  category: string;
  image: string;
  example: string;
  exampleTranslation: string;
}

export const commonEnglishWords: EnglishWord[] = [
  // Animaux (Animals)
  {
    word: 'a dog',
    translation: 'un chien',
    category: 'animals',
    image: '/images/english/dog.jpg',
    example: 'I have a dog at home.',
    exampleTranslation: 'J\'ai un chien à la maison.'
  },
  {
    word: 'a cat',
    translation: 'un chat',
    category: 'animals',
    image: '/images/english/cat.jpg',
    example: 'The cat is sleeping.',
    exampleTranslation: 'Le chat dort.'
  },
  {
    word: 'a bird',
    translation: 'un oiseau',
    category: 'animals',
    image: '/images/english/bird.jpg',
    example: 'I can see a bird in the sky.',
    exampleTranslation: 'Je vois un oiseau dans le ciel.'
  },
  {
    word: 'a fish',
    translation: 'un poisson',
    category: 'animals',
    image: '/images/english/fish.jpg',
    example: 'The fish swims in the water.',
    exampleTranslation: 'Le poisson nage dans l\'eau.'
  },

  // Famille (Family)
  {
    word: 'mother',
    translation: 'maman',
    category: 'family',
    image: '/images/english/mother.jpg',
    example: 'My mother makes delicious cakes.',
    exampleTranslation: 'Ma mère fait des gâteaux délicieux.'
  },
  {
    word: 'father',
    translation: 'papa',
    category: 'family',
    image: '/images/english/father.jpg',
    example: 'My father reads me stories.',
    exampleTranslation: 'Mon père me lit des histoires.'
  },
  {
    word: 'sister',
    translation: 'sœur',
    category: 'family',
    image: '/images/english/sister.jpg',
    example: 'I play with my sister.',
    exampleTranslation: 'Je joue avec ma sœur.'
  },
  {
    word: 'brother',
    translation: 'frère',
    category: 'family',
    image: '/images/english/brother.jpg',
    example: 'My brother is older than me.',
    exampleTranslation: 'Mon frère est plus âgé que moi.'
  },

  // Objets quotidiens (Daily objects)
  {
    word: 'a book',
    translation: 'un livre',
    category: 'objects',
    image: '/images/english/book.jpg',
    example: 'I read a book every night.',
    exampleTranslation: 'Je lis un livre chaque soir.'
  },
  {
    word: 'a pen',
    translation: 'un stylo',
    category: 'objects',
    image: '/images/english/pen.jpg',
    example: 'I write with a pen.',
    exampleTranslation: 'J\'écris avec un stylo.'
  },
  {
    word: 'a chair',
    translation: 'une chaise',
    category: 'objects',
    image: '/images/english/chair.jpg',
    example: 'Please sit on the chair.',
    exampleTranslation: 'Asseyez-vous sur la chaise.'
  },
  {
    word: 'a table',
    translation: 'une table',
    category: 'objects',
    image: '/images/english/table.jpg',
    example: 'The food is on the table.',
    exampleTranslation: 'La nourriture est sur la table.'
  },

  // Nourriture (Food)
  {
    word: 'milk',
    translation: 'du lait',
    category: 'food',
    image: '/images/english/milk.jpg',
    example: 'I drink milk for breakfast.',
    exampleTranslation: 'Je bois du lait pour le petit déjeuner.'
  },
  {
    word: 'bread',
    translation: 'du pain',
    category: 'food',
    image: '/images/english/bread.jpg',
    example: 'I eat bread with butter.',
    exampleTranslation: 'Je mange du pain avec du beurre.'
  },
  {
    word: 'an apple',
    translation: 'une pomme',
    category: 'food',
    image: '/images/english/apple.jpg',
    example: 'I eat an apple every day.',
    exampleTranslation: 'Je mange une pomme chaque jour.'
  },
  {
    word: 'a banana',
    translation: 'une banane',
    category: 'food',
    image: '/images/english/banana.jpg',
    example: 'The monkey likes to eat a banana.',
    exampleTranslation: 'Le singe aime manger une banane.'
  },

  // Transport
  {
    word: 'a car',
    translation: 'une voiture',
    category: 'transport',
    image: '/images/english/car.jpg',
    example: 'We go to school by car.',
    exampleTranslation: 'Nous allons à l\'école en voiture.'
  },
  {
    word: 'a bus',
    translation: 'un bus',
    category: 'transport',
    image: '/images/english/bus.jpg',
    example: 'I take the bus to school.',
    exampleTranslation: 'Je prends le bus pour aller à l\'école.'
  },
  {
    word: 'a bike',
    translation: 'un vélo',
    category: 'transport',
    image: '/images/english/bike.jpg',
    example: 'I ride my bike in the park.',
    exampleTranslation: 'Je fais du vélo dans le parc.'
  },
  {
    word: 'a boat',
    translation: 'un bateau',
    category: 'transport',
    image: '/images/english/boat.jpg',
    example: 'The boat sails on the sea.',
    exampleTranslation: 'Le bateau navigue sur la mer.'
  },

  // Maison (House)
  {
    word: 'a house',
    translation: 'une maison',
    category: 'house',
    image: '/images/english/house.jpg',
    example: 'I live in a big house.',
    exampleTranslation: 'J\'habite dans une grande maison.'
  },
  {
    word: 'a door',
    translation: 'une porte',
    category: 'house',
    image: '/images/english/door.jpg',
    example: 'Please close the door.',
    exampleTranslation: 'Fermez la porte, s\'il vous plaît.'
  },
  {
    word: 'a window',
    translation: 'une fenêtre',
    category: 'house',
    image: '/images/english/window.jpg',
    example: 'Open the window, please.',
    exampleTranslation: 'Ouvrez la fenêtre, s\'il vous plaît.'
  },
  {
    word: 'a bed',
    translation: 'un lit',
    category: 'house',
    image: '/images/english/bed.jpg',
    example: 'I sleep in my bed.',
    exampleTranslation: 'Je dors dans mon lit.'
  }
];
