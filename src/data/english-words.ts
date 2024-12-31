export interface EnglishWord {
  word: string;
  translation: string;
  category: string;
  image: string;
  example: string;
}

export const commonEnglishWords: EnglishWord[] = [
  // Animaux (Animals)
  {
    word: 'a dog',
    translation: 'un chien',
    category: 'animals',
    image: '/images/english/dog.jpg',
    example: 'I have a dog at home.'
  },
  {
    word: 'a cat',
    translation: 'un chat',
    category: 'animals',
    image: '/images/english/cat.jpg',
    example: 'The cat is sleeping.'
  },
  {
    word: 'a bird',
    translation: 'un oiseau',
    category: 'animals',
    image: '/images/english/bird.jpg',
    example: 'I can see a bird in the sky.'
  },
  {
    word: 'a fish',
    translation: 'un poisson',
    category: 'animals',
    image: '/images/english/fish.jpg',
    example: 'The fish swims in the water.'
  },

  // Famille (Family)
  {
    word: 'mother',
    translation: 'maman',
    category: 'family',
    image: '/images/english/mother.jpg',
    example: 'My mother makes delicious cakes.'
  },
  {
    word: 'father',
    translation: 'papa',
    category: 'family',
    image: '/images/english/father.jpg',
    example: 'My father reads me stories.'
  },
  {
    word: 'sister',
    translation: 'sœur',
    category: 'family',
    image: '/images/english/sister.jpg',
    example: 'I play with my sister.'
  },
  {
    word: 'brother',
    translation: 'frère',
    category: 'family',
    image: '/images/english/brother.jpg',
    example: 'My brother is older than me.'
  },

  // Objets quotidiens (Daily objects)
  {
    word: 'a book',
    translation: 'un livre',
    category: 'objects',
    image: '/images/english/book.jpg',
    example: 'I read a book every night.'
  },
  {
    word: 'a pen',
    translation: 'un stylo',
    category: 'objects',
    image: '/images/english/pen.jpg',
    example: 'I write with a pen.'
  },
  {
    word: 'a chair',
    translation: 'une chaise',
    category: 'objects',
    image: '/images/english/chair.jpg',
    example: 'Please sit on the chair.'
  },
  {
    word: 'a table',
    translation: 'une table',
    category: 'objects',
    image: '/images/english/table.jpg',
    example: 'The food is on the table.'
  },

  // Nourriture (Food)
  {
    word: 'milk',
    translation: 'du lait',
    category: 'food',
    image: '/images/english/milk.jpg',
    example: 'I drink milk for breakfast.'
  },
  {
    word: 'bread',
    translation: 'du pain',
    category: 'food',
    image: '/images/english/bread.jpg',
    example: 'I eat bread with butter.'
  },
  {
    word: 'an apple',
    translation: 'une pomme',
    category: 'food',
    image: '/images/english/apple.jpg',
    example: 'I eat an apple every day.'
  },
  {
    word: 'a banana',
    translation: 'une banane',
    category: 'food',
    image: '/images/english/banana.jpg',
    example: 'The monkey likes to eat a banana.'
  },

  // Transport
  {
    word: 'a car',
    translation: 'une voiture',
    category: 'transport',
    image: '/images/english/car.jpg',
    example: 'We go to school by car.'
  },
  {
    word: 'a bus',
    translation: 'un bus',
    category: 'transport',
    image: '/images/english/bus.jpg',
    example: 'I take the bus to school.'
  },
  {
    word: 'a bike',
    translation: 'un vélo',
    category: 'transport',
    image: '/images/english/bike.jpg',
    example: 'I ride my bike in the park.'
  },
  {
    word: 'a boat',
    translation: 'un bateau',
    category: 'transport',
    image: '/images/english/boat.jpg',
    example: 'The boat sails on the sea.'
  },

  // Maison (House)
  {
    word: 'a house',
    translation: 'une maison',
    category: 'house',
    image: '/images/english/house.jpg',
    example: 'I live in a big house.'
  },
  {
    word: 'a door',
    translation: 'une porte',
    category: 'house',
    image: '/images/english/door.jpg',
    example: 'Please close the door.'
  },
  {
    word: 'a window',
    translation: 'une fenêtre',
    category: 'house',
    image: '/images/english/window.jpg',
    example: 'Open the window, please.'
  },
  {
    word: 'a bed',
    translation: 'un lit',
    category: 'house',
    image: '/images/english/bed.jpg',
    example: 'I sleep in my bed.'
  }
];
