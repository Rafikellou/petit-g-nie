export interface Dictation {
  id: string;
  title: string;
  text: string;
  level: 'CE1' | 'CE2' | 'CM1' | 'CM2';
  category: 'grammaire' | 'conjugaison' | 'orthographe';
  duration: number;
}

export const dictations: Dictation[] = [
  {
    id: '1',
    title: 'Le chat noir',
    text: "Je vois un chat noir. Il dort sur le lit.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '2',
    title: 'Le chien dans le jardin',
    text: "Mon chien court dans le jardin. Il cherche un bâton.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '3',
    title: "L'oiseau sur la branche",
    text: "L'oiseau chante. Il est posé sur la branche.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '4',
    title: 'La soupe de maman',
    text: "Maman cuisine une soupe. Elle sent très bon.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '5',
    title: 'La lecture en classe',
    text: "En classe, je lis mon livre. J'aime les histoires.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '6',
    title: 'Le petit déjeuner',
    text: "Le matin, je bois du lait chaud. Puis je range mon bol.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '7',
    title: 'Le crayon rouge',
    text: "J'ai un crayon rouge. Je colorie ma pomme.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '8',
    title: 'Le soleil brille',
    text: "Le soleil brille. Je mets un chapeau bleu.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '9',
    title: 'La voiture de papa',
    text: "Papa conduit la voiture. Nous allons chez Mamie.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '10',
    title: 'La marelle',
    text: "Je dis bonjour à mes amis. Nous jouons à la marelle.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '11',
    title: 'Le parapluie vert',
    text: "Il pleut dehors. Je prends mon parapluie vert.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '12',
    title: 'Le chien aboie',
    text: "Le chien aboie. Il veut sortir du jardin.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '13',
    title: 'La chambre rangée',
    text: "Je range ma chambre. Je plie mes vêtements.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '14',
    title: 'Le petit frère rit',
    text: "Mon petit frère rit. Il est content de jouer.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '15',
    title: 'La cantine',
    text: "À la cantine, je mange une pomme. Elle est très sucrée.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '16',
    title: 'La leçon',
    text: "La maîtresse écrit au tableau. Je copie la leçon.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '17',
    title: 'La pluie',
    text: "La pluie tombe. Les flaques d'eau brillent.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '18',
    title: 'La tartine',
    text: "Je mange une tartine. Elle est couverte de confiture.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '19',
    title: 'Le chaton',
    text: "Le chaton joue avec une pelote. Il s'amuse beaucoup.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '20',
    title: 'Le journal',
    text: "Papa lit le journal. Je regarde les images.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '21',
    title: 'La cloche de l\'école',
    text: "J'entends la cloche de l'école. Je range mes affaires.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '22',
    title: 'Le ballon rouge',
    text: "Mon cousin a un ballon rouge. Nous jouons au foot.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '23',
    title: 'Le livre sur les animaux',
    text: "J'ai un livre sur les animaux. J'apprends leurs noms.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '24',
    title: 'Le vent',
    text: "Le vent souffle fort. Les feuilles s'envolent.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '25',
    title: 'La fleur',
    text: "Je dessine une fleur. Elle a des pétales jaunes.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '26',
    title: 'La musique',
    text: "Nous chantons en classe. J'adore la musique.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '27',
    title: 'La veste',
    text: "Je mets ma veste. Il fait froid ce matin.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '28',
    title: 'Le poisson',
    text: "Le poisson nage dans son bocal. Il tourne en rond.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '29',
    title: 'Les devoirs',
    text: "Je fais mes devoirs. J'écris bien sur mon cahier.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '30',
    title: 'Le gâteau',
    text: "Ma tante apporte un gâteau. Il sent le chocolat.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '31',
    title: 'Les mains',
    text: "Je me lave les mains. L'eau est tiède.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '32',
    title: 'La nappe rose',
    text: "Sur la table, il y a une nappe rose. Je m'assieds pour dîner.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '33',
    title: 'Le pique-nique',
    text: "Nous partons en pique-nique. J'emporte un sandwich.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '34',
    title: 'La ferme',
    text: "La ferme est grande. Il y a des vaches et des poules.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '35',
    title: 'Le frisbee',
    text: "Je lance un frisbee. Mon frère le rattrape.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '36',
    title: 'La vaisselle',
    text: "J'aide ma maman. Je range la vaisselle.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '37',
    title: 'Le soleil se lève',
    text: "Le soleil se lève. La lumière entre dans ma chambre.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '38',
    title: 'Le feutre bleu',
    text: "Je prends un feutre bleu. Je colorie la mer.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '39',
    title: 'Le livre',
    text: "J'ouvre le livre. Je regarde les belles images.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '40',
    title: 'La soupe',
    text: "Je souffle sur la soupe. Elle est trop chaude.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '41',
    title: 'Le papillon',
    text: "Le papillon vole. Ses ailes sont multicolores.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '42',
    title: 'La piscine',
    text: "Je vais à la piscine. L'eau est fraîche.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '43',
    title: 'Les fleurs',
    text: "Papi arrose les fleurs. Je l'aide avec l'arrosoir.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '44',
    title: 'Les chaussures',
    text: "Je mets mes chaussures. Elles sont rouges et blanches.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '45',
    title: 'La souris',
    text: "La souris grignote un morceau de fromage. Elle se cache vite.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '46',
    title: 'La cour',
    text: "Je cours dans la cour. Mes amis me poursuivent.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '47',
    title: 'Mercredi',
    text: "Nous sommes mercredi. Je ne vais pas à l'école cet après-midi.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '48',
    title: 'L\'arc-en-ciel',
    text: "Je vois un arc-en-ciel. Ses couleurs sont magnifiques.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '49',
    title: 'La porte',
    text: "J'ouvre la porte. Je sors pour jouer dehors.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '50',
    title: 'Le rêve',
    text: "Je fais un beau rêve. Le matin, je me réveille content.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  }
];
