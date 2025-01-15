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

    return NextResponse.json({
      response: data.choices[0].message.content
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
