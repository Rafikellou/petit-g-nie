import { MasterQuestion } from "@/types/masterQuestion";

// Utilisez NEXT_PUBLIC_ pour les variables d'environnement côté client
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export interface QuestionGenerationParams {
  class_level: string;
  subject: string;
  topics: string[];
  specificities: string[];
  subSpecificities: string[];
  period: string;
}

export async function generateMasterQuestion(params: QuestionGenerationParams) {
  try {
    const prompt = `Génère une question de mathématiques pour le niveau ${params.class_level} avec les caractéristiques suivantes :
    - Thématique : ${params.topics[0]}
    - Compétence : ${params.specificities[0]}
    - Sous-compétence : ${params.subSpecificities[0]}
    - Période : ${params.period}

    La question doit :
    1. Être adaptée au niveau des élèves
    2. Être claire et précise
    3. Proposer 4 réponses possibles (A, B, C, D)
    4. Indiquer la bonne réponse
    5. Inclure une explication pédagogique détaillée
    6. Déterminer le type de question le plus approprié parmi :
       - "short" : question courte avec réponses simples
       - "long" : question avec un paragraphe contextuel
       - "image" : question nécessitant une image

    Réponds uniquement au format JSON suivant :
    {
      "question": "Énoncé de la question",
      "options": {
        "A": "Première option",
        "B": "Deuxième option",
        "C": "Troisième option",
        "D": "Quatrième option"
      },
      "correctAnswer": "A/B/C/D",
      "explanation": "Explication pédagogique détaillée",
      "type": "short/long/image"
    }`;

    const response = await fetch('/api/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de la génération de la question");
    }

    const data = await response.json();
    console.log("Réponse du service:", data);
    
    if (data.content) {
      return data.content;
    } else {
      console.error("Réponse inattendue de l'API:", data);
      throw new Error("Format de réponse inattendu de l'API");
    }
  } catch (error) {
    console.error("Erreur lors de la génération de la question:", error);
    throw error;
  }
}

function generatePrompt(question: MasterQuestion): string {
  return `Génère une question de mathématiques pour le niveau ${question.class_level} avec les caractéristiques suivantes :
  - Thématique : ${question.topic}
  - Compétence : ${question.specificity}
  - Sous-compétence : ${question.subSpecificity}
  - Période : ${question.period}

  La question doit :
  1. Être adaptée au niveau des élèves
  2. Être claire et précise
  3. Proposer 4 réponses possibles (A, B, C, D)
  4. Indiquer la bonne réponse
  5. Inclure une explication pédagogique détaillée

  Format de réponse souhaité :
  {
    "question": "Énoncé de la question",
    "options": {
      "A": "Première option",
      "B": "Deuxième option",
      "C": "Troisième option",
      "D": "Quatrième option"
    },
    "correctAnswer": "A/B/C/D",
    "explanation": "Explication pédagogique détaillée"
  }`;
}

export async function generateSimilarQuestions(masterQuestion: any, count: number = 3) {
  const prompt = `Tu dois générer ${count} questions similaires à celle-ci, en utilisant un langage naturel et pédagogique :
  ${JSON.stringify(masterQuestion, null, 2)}

  Les questions doivent :
  1. Être du même niveau de difficulté
  2. Porter sur le même concept mathématique
  3. Avoir une structure similaire
  4. Être variées dans leurs énoncés
  
  Chaque question doit avoir :
  - Un énoncé clair
  - 4 options de réponse (A, B, C, D)
  - Une réponse correcte
  - Une explication pédagogique

  N'hésite pas à être créatif et à adapter ton langage au niveau scolaire concerné.`;

  try {
    const response = await fetch('/api/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la génération des questions similaires');
    }

    const data = await response.json();
    console.log("Réponse du service pour les questions similaires:", data);
    
    if (data.content) {
      // Nettoyer la réponse des caractères d'échappement superflus
      let content = data.content;
      if (typeof content === 'string') {
        content = content.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      
      // Retourner le contenu tel quel, sans essayer de le parser
      // La validation et le parsing se feront lors de l'étape de validation par l'utilisateur
      return content;
    } else {
      console.error("Réponse inattendue de l'API:", data);
      throw new Error("Format de réponse inattendu de l'API");
    }
  } catch (error) {
    console.error('Erreur lors de la génération des questions similaires:', error);
    throw error;
  }
}
