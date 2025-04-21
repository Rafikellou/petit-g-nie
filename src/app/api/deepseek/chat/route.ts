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
    const { message, history, context } = await request.json();

    console.log('Sending request to Deepseek with:', {
      messageLength: message.length,
      historyLength: history?.length || 0,
      contextLength: context?.length || 0
    });

    // Construire l'historique des messages pour l'API
    const messages = [
      {
        role: "system",
        content: context
      },
      // Ajouter l'historique des messages précédents
      ...(history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      // Ajouter le message actuel
      {
        role: "user",
        content: message
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
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Deepseek API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: 'Deepseek API error', 
          details: errorData || response.statusText 
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
    let responseContent = data.choices[0].message.content;
    
    // Nettoyer la réponse pour extraire uniquement le JSON valide
    try {
      // Vérifier si la réponse contient des délimiteurs de code markdown
      if (responseContent.includes('```json')) {
        console.log('Détection de délimiteurs de code JSON dans la réponse');
        const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          responseContent = jsonMatch[1].trim();
          console.log('JSON extrait des délimiteurs de code');
        }
      } else if (responseContent.includes('```')) {
        console.log('Détection de délimiteurs de code génériques dans la réponse');
        const codeMatch = responseContent.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          responseContent = codeMatch[1].trim();
          console.log('Code extrait des délimiteurs');
        }
      }
      
      // Essayer de trouver un objet ou tableau JSON dans la réponse
      const jsonRegex = /\{[\s\S]*\}|\[[\s\S]*\]/;
      const jsonMatch = responseContent.match(jsonRegex);
      if (jsonMatch && jsonMatch[0]) {
        // Vérifier que c'est un JSON valide en le parsant puis en le stringifiant à nouveau
        const parsedJson = JSON.parse(jsonMatch[0]);
        responseContent = JSON.stringify(parsedJson);
        console.log('JSON valide extrait et reformatté');
      }
    } catch (error) {
      console.warn('Erreur lors du nettoyage de la réponse JSON:', error);
      // Continuer avec la réponse originale
    }

    return NextResponse.json({
      response: responseContent
    });
  } catch (error) {
    console.error('Error in Deepseek chat:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
