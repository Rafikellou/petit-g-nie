import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(request: Request) {
  try {
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "Clé API Deepseek non configurée" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Tu es un professeur expert en pédagogie qui crée des questions d'exercices pour les élèves du primaire. Tu réponds uniquement au format JSON demandé, sans aucun texte avant ou après le JSON."
          },
          {
            role: "user",
            content: body.prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    console.log("Réponse brute de l'API DeepSeek:", data);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Erreur lors de la génération de la question" },
        { status: response.status }
      );
    }

    // Vérifier et nettoyer la réponse
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let content = data.choices[0].message.content.trim();
      
      // Supprimer tout ce qui n'est pas du JSON
      content = content.replace(/^[^{\[]+/, '').replace(/[^}\]]+$/, '');
      
      try {
        // Vérifier que c'est du JSON valide
        JSON.parse(content);
        
        return NextResponse.json({ content });
      } catch (parseError) {
        console.error("Erreur lors du parsing du JSON:", parseError);
        console.error("Contenu qui a causé l'erreur:", content);
        return NextResponse.json(
          { error: "La réponse de l'API n'est pas au format JSON valide" },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Format de réponse inattendu" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Erreur lors de la génération de la question:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la question" },
      { status: 500 }
    );
  }
}