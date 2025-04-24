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

    console.log('Sending request to Deepseek API with payload:', JSON.stringify({
      model: "deepseek-chat",
      messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' })),
      temperature: 0.7,
      max_tokens: 2000,
    }));
    
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
    
    console.log('Deepseek API response status:', response.status, response.statusText);

    if (!response.ok) {
      // Tenter de récupérer le texte brut de la réponse d'abord
      const responseText = await response.text();
      console.error('Deepseek API error - Raw response:', responseText);
      
      // Essayer de parser le JSON si possible
      let errorData = null;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
      }
      
      console.error('Deepseek API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: 'Deepseek API error', 
          details: errorData || responseText || response.statusText 
        },
        { status: response.status }
      );
    }

    // Récupérer d'abord le texte brut de la réponse pour le débogage
    const responseText = await response.text();
    console.log('Deepseek API raw response:', responseText);
    
    // Tenter de parser le JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Deepseek response as JSON:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from Deepseek', 
          rawResponse: responseText.substring(0, 1000) // Limiter la taille pour éviter des logs trop volumineux
        },
        { status: 500 }
      );
    }
    
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
        try {
          // Vérifier que c'est un JSON valide en le parsant puis en le stringifiant à nouveau
          const parsedJson = JSON.parse(jsonMatch[0]);
          responseContent = JSON.stringify(parsedJson);
          console.log('JSON valide extrait et reformatté');
        } catch (parseError) {
          console.warn('Erreur lors du parsing du JSON extrait:', parseError);
          // Essayer une approche plus agressive pour nettoyer le JSON
          const firstBrace = responseContent.indexOf('{');
          const firstBracket = responseContent.indexOf('[');
          const lastBrace = responseContent.lastIndexOf('}');
          const lastBracket = responseContent.lastIndexOf(']');
          
          let start = -1;
          let end = -1;
          
          if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = lastBrace;
          } else if (firstBracket !== -1) {
            start = firstBracket;
            end = lastBracket;
          }
          
          if (start !== -1 && end !== -1 && end > start) {
            const extractedJson = responseContent.substring(start, end + 1);
            console.log('Tentative de parsing avec JSON extrait par délimiteurs:', extractedJson);
            try {
              const parsedJson = JSON.parse(extractedJson);
              responseContent = JSON.stringify(parsedJson);
              console.log('JSON valide extrait par délimiteurs et reformatté');
            } catch (finalError) {
              console.error('Impossible de parser le JSON même après extraction agressive:', finalError);
            }
          }
        }
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
