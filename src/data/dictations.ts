export interface Dictation {
  id: string;
  text: string;
  level: 'CE1' | 'CE2' | 'CM1' | 'CM2';
  category: 'grammaire' | 'conjugaison' | 'orthographe';
  duration: number;
}

export const dictations: Dictation[] = [
  {
    id: '1',
    text: "Je vois un chat noir. Il dort sur le lit.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '2',
    text: "Mon chien court dans le jardin. Il cherche un bâton.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '3',
    text: "L'oiseau chante. Il est posé sur la branche.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '4',
    text: "Maman cuisine une soupe. Elle sent très bon.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '5',
    text: "En classe, je lis mon livre. J'aime les histoires.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '6',
    text: "Le matin, je bois du lait chaud. Puis je range mon bol.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '7',
    text: "J'ai un crayon rouge. Je colorie ma pomme.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '8',
    text: "Le soleil brille. Je mets un chapeau bleu.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '9',
    text: "Papa conduit la voiture. Nous allons chez Mamie.",
    level: 'CE1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '10',
    text: "Je dis bonjour à mes amis. Nous jouons à la marelle.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '11',
    text: "Il pleut dehors. Je prends mon parapluie vert.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '12',
    text: "Le chien aboie. Il veut sortir du jardin.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '13',
    text: "Je range ma chambre. Je plie mes vêtements.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '14',
    text: "Mon petit frère rit. Il est content de jouer.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '15',
    text: "À la cantine, je mange une pomme. Elle est très sucrée.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '16',
    text: "La maîtresse écrit au tableau. Je copie la leçon.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '17',
    text: "La pluie tombe. Les flaques d'eau brillent.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '18',
    text: "Je mange une tartine. Elle est couverte de confiture.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '19',
    text: "Le chaton joue avec une pelote. Il s'amuse beaucoup.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '20',
    text: "Papa lit le journal. Je regarde les images.",
    level: 'CE2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '21',
    text: "J'entends la cloche de l'école. Je range mes affaires.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '22',
    text: "Mon cousin a un ballon rouge. Nous jouons au foot.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '23',
    text: "J'ai un livre sur les animaux. J'apprends leurs noms.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '24',
    text: "Le vent souffle fort. Les feuilles s'envolent.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '25',
    text: "Je dessine une fleur. Elle a des pétales jaunes.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '26',
    text: "Nous chantons en classe. J'adore la musique.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '27',
    text: "Je mets ma veste. Il fait froid ce matin.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '28',
    text: "Le poisson nage dans son bocal. Il tourne en rond.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '29',
    text: "Je fais mes devoirs. J'écris bien sur mon cahier.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '30',
    text: "Ma tante apporte un gâteau. Il sent le chocolat.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '31',
    text: "Je me lave les mains. L'eau est tiède.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '32',
    text: "Sur la table, il y a une nappe rose. Je m'assieds pour dîner.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '33',
    text: "Nous partons en pique-nique. J'emporte un sandwich.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '34',
    text: "La ferme est grande. Il y a des vaches et des poules.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '35',
    text: "Je lance un frisbee. Mon frère le rattrape.",
    level: 'CM1',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '36',
    text: "J'aide ma maman. Je range la vaisselle.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '37',
    text: "Le soleil se lève. La lumière entre dans ma chambre.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '38',
    text: "Je prends un feutre bleu. Je colorie la mer.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '39',
    text: "J'ouvre le livre. Je regarde les belles images.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '40',
    text: "Je souffle sur la soupe. Elle est trop chaude.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '41',
    text: "Le papillon vole. Ses ailes sont multicolores.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '42',
    text: "Je vais à la piscine. L'eau est fraîche.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '43',
    text: "Papi arrose les fleurs. Je l'aide avec l'arrosoir.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '44',
    text: "Je mets mes chaussures. Elles sont rouges et blanches.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '45',
    text: "La souris grignote un morceau de fromage. Elle se cache vite.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '46',
    text: "Je cours dans la cour. Mes amis me poursuivent.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '47',
    text: "Nous sommes mercredi. Je ne vais pas à l'école cet après-midi.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '48',
    text: "Je vois un arc-en-ciel. Ses couleurs sont magnifiques.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '49',
    text: "J'ouvre la porte. Je sors pour jouer dehors.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  },
  {
    id: '50',
    text: "Je fais un beau rêve. Le matin, je me réveille content.",
    level: 'CM2',
    category: 'orthographe',
    duration: 60
  }
];
