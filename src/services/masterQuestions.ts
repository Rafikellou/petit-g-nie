import cpMathData from '@/data/questionStructures/cp-math.json';
import ce1MathData from '@/data/questionStructures/ce1-math.json';
import ce2MathData from '@/data/questionStructures/ce2-math.json';

export interface SubSpecificity {
  'sub-specificity': string;
  period: string;
}

export interface Specificity {
  specificity: string;
  'sub-specificities': SubSpecificity[];
}

export interface Topic {
  topic: string;
  specificities: Specificity[];
}

export interface MasterQuestionStructure {
  class: string;
  subject: string;
  topics: Topic[];
}

const questionStructures: { [key: string]: MasterQuestionStructure } = {
  'CP-Mathématiques': cpMathData,
  'CE1-Mathématiques': ce1MathData,
  'CE2-Mathématiques': ce2MathData,
};

export function getAvailableClasses(): string[] {
  return ['CP', 'CE1', 'CE2'];
}

export function getAvailableSubjects(): string[] {
  return ['Mathématiques'];
}

export function getTopics(classLevel: string, subject: string): string[] {
  const key = `${classLevel}-${subject}`;
  const structure = questionStructures[key];
  return structure ? structure.topics.map(t => t.topic) : [];
}

export function getSpecificities(classLevel: string, subject: string, topic: string): string[] {
  const key = `${classLevel}-${subject}`;
  const structure = questionStructures[key];
  if (!structure) return [];
  
  const selectedTopic = structure.topics.find(t => t.topic === topic);
  return selectedTopic ? selectedTopic.specificities.map(s => s.specificity) : [];
}

export function getSubSpecificities(
  classLevel: string,
  subject: string,
  topic: string,
  specificity: string
): { name: string; period: string }[] {
  const key = `${classLevel}-${subject}`;
  const structure = questionStructures[key];
  if (!structure) return [];
  
  const selectedTopic = structure.topics.find(t => t.topic === topic);
  if (!selectedTopic) return [];
  
  const selectedSpecificity = selectedTopic.specificities.find(s => s.specificity === specificity);
  return selectedSpecificity 
    ? selectedSpecificity['sub-specificities'].map(ss => ({
        name: ss['sub-specificity'],
        period: ss.period
      }))
    : [];
}

export function getPeriods(): string[] {
  return ['Début d\'année', 'Milieu d\'année', 'Fin d\'année', 'Fin d\'année (valeur par défaut)'];
}
