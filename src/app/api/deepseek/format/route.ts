import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY; 
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(request: Request) {
  if (!DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY is not configured');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { rawResponse, isArray } = await request.json();

    console.log('Sending format request to Deepseek with raw response length:', rawResponse.length);

    // Construire le prompt pour le formatage
    const formatPrompt = isArray 
      ? `Voici une réponse qui devrait être un tableau JSON de questions de quiz : "${rawResponse}". Convertis cette réponse en un tableau JSON valide avec le format suivant, sans aucun texte supplémentaire ni délimiteurs de code : 
      [
        {
          "question": "Texte de la question",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correctAnswer": "A",
          "explanation": "Explication de la réponse"
        }
      ]
      Renvoie UNIQUEMENT le tableau JSON valide, sans aucun texte avant ou après, ni délimiteurs de code.`
      : `Voici une réponse qui devrait être un objet JSON de question de quiz : "${rawResponse}". Convertis cette réponse en un objet JSON valide avec le format suivant, sans aucun texte supplémentaire ni délimiteurs de code : 
      {
        "question": "Texte de la question",
        "options": {
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        },
        "correctAnswer": "A",
        "explanation": "Explication de la réponse"
      }
      Renvoie UNIQUEMENT l'objet JSON valide, sans aucun texte avant ou après, ni délimiteurs de code.`;

    // Construire les messages pour l'API
    const messages = [
      {
        role: "system",
        content: "Tu es un assistant spécialisé dans le formatage de données JSON. Ta tâche est de convertir des réponses textuelles en JSON valide, en suivant strictement le format demandé."
      },
      {
        role: "user",
        content: formatPrompt
      }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.1, // Température basse pour des réponses plus déterministes
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Deepseek API error - Raw response:', responseText);
      
      let errorData = null;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
      }
      
      return NextResponse.json(
        { 
          error: 'Deepseek API error', 
          details: errorData || responseText || response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected Deepseek response format:', data);
      return NextResponse.json(
        { error: 'Invalid response format from Deepseek' },
        { status: 500 }
      );
    }
    
    // Récupérer le contenu de la réponse
    let formattedContent = data.choices[0].message.content;
    
    // Nettoyer la réponse pour extraire uniquement le JSON valide
    try {
      // Vérifier si la réponse contient des délimiteurs de code markdown
      if (formattedContent.includes('```json')) {
        const jsonMatch = formattedContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          formattedContent = jsonMatch[1].trim();
        }
      } else if (formattedContent.includes('```')) {
        const codeMatch = formattedContent.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          formattedContent = codeMatch[1].trim();
        }
      }
      
      // Essayer de parser le JSON pour vérifier qu'il est valide
      const parsedJson = JSON.parse(formattedContent);
      
      // Vérifier que le format est correct
      if (isArray) {
        if (!Array.isArray(parsedJson)) {
          throw new Error('La réponse n\'est pas un tableau JSON');
        }
      } else {
        if (Array.isArray(parsedJson)) {
          throw new Error('La réponse est un tableau JSON alors qu\'un objet était attendu');
        }
      }
      
      return NextResponse.json({
        formattedResponse: parsedJson
      });
    } catch (error) {
      console.error('Error parsing formatted response:', error);
      return NextResponse.json(
        { 
          error: 'Failed to format response as valid JSON',
          message: error instanceof Error ? error.message : 'Unknown error',
          rawContent: formattedContent
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in Deepseek format:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
