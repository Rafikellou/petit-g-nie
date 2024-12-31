export interface Joke {
  id: string;
  question: string;
  answer: string;
  category: 'science' | 'math' | 'language' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: {
    min: number;
    max: number;
  };
  likes: number;
  isApproved: boolean;
}

export const MOCK_JOKES: Joke[] = [
  {
    id: '1',
    question: 'Pourquoi les mathématiques sont-elles si tristes ?',
    answer: 'Parce qu\'elles ont trop de problèmes !',
    category: 'math',
    difficulty: 'easy',
    ageRange: { min: 6, max: 12 },
    likes: 42,
    isApproved: true
  },
  {
    id: '2',
    question: 'Que fait un atome quand il perd un électron ?',
    answer: 'Il appelle les ions positifs !',
    category: 'science',
    difficulty: 'medium',
    ageRange: { min: 8, max: 12 },
    likes: 35,
    isApproved: true
  },
  {
    id: '3',
    question: 'Quel est le fruit préféré des chats ?',
    answer: 'Le miaou-kiwi !',
    category: 'language',
    difficulty: 'easy',
    ageRange: { min: 6, max: 10 },
    likes: 56,
    isApproved: true
  },
  {
    id: '4',
    question: 'Pourquoi les livres de mathématiques sont-ils toujours stressés ?',
    answer: 'Parce qu\'ils ont trop d\'équations !',
    category: 'math',
    difficulty: 'easy',
    ageRange: { min: 7, max: 12 },
    likes: 28,
    isApproved: true
  },
  {
    id: '5',
    question: 'Comment appelle-t-on un dinosaure qui ne sait pas perdre ?',
    answer: 'Un mauvais per-dino !',
    category: 'general',
    difficulty: 'easy',
    ageRange: { min: 6, max: 12 },
    likes: 45,
    isApproved: true
  }
];
