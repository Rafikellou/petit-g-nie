import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userInput, correctText, mode } = await request.json();

    if (mode === 'realtime') {
      // Analyse en temps réel mot par mot
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un professeur de français expert en orthographe. Tu dois analyser chaque mot saisi par l'élève et le comparer avec le texte correct. Pour chaque mot, indique s'il est correct ou non. Retourne un tableau d'objets avec le mot, sa position de début et de fin, et si c'est correct."
          },
          {
            role: "user",
            content: `Texte correct: "${correctText}"\nTexte saisi: "${userInput}"\nAnalyse chaque mot et retourne un tableau d'objets au format JSON avec {word: string, start: number, end: number, isCorrect: boolean}.`
          }
        ],
        response_format: { type: "json_object" }
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    } else {
      // Analyse complète avec corrections et explications
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Tu es un professeur de français bienveillant et pédagogue. Analyse la dictée de l'élève et fournis :
            1. Une liste des erreurs avec leur emplacement
            2. Pour chaque erreur, une explication claire et pédagogique de la règle d'orthographe
            3. Des encouragements adaptés au niveau de réussite
            4. Un score sur 10
            Retourne la réponse en JSON structuré.`
          },
          {
            role: "user",
            content: `Texte correct: "${correctText}"\nTexte de l'élève: "${userInput}"\nAnalyse la dictée et fournis une correction détaillée.`
          }
        ],
        response_format: { type: "json_object" }
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse orthographique:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse orthographique' },
      { status: 500 }
    );
  }
}
