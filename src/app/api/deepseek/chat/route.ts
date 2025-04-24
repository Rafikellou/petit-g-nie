import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY; 
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export const runtime = 'edge'; // Utiliser Edge Runtime pour de meilleures performances et timeouts plus longs

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
    
    // Utiliser AbortController pour gérer les timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 secondes de timeout
    
    try {
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
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Deepseek API response status:', response.status, response.statusText);

      if (!response.ok) {
        // Récupérer le texte brut de la réponse d'erreur
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

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected Deepseek response format:', data);
        return NextResponse.json(
          { error: 'Invalid response format from Deepseek' },
          { status: 500 }
        );
      }
      
      // Récupérer le contenu de la réponse sans aucun traitement supplémentaire
      const responseContent = data.choices[0].message.content;
      
      return NextResponse.json({
        response: responseContent
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request to Deepseek API timed out');
        return NextResponse.json(
          { error: 'Request to Deepseek API timed out after 50 seconds' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Relancer l'erreur pour qu'elle soit traitée par le catch externe
    }
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
