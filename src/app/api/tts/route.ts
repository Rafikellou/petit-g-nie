import { NextRequest, NextResponse } from 'next/server';

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('ELEVENLABS_API_KEY is not configured in environment variables');
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
// Voix "Rémy" - voix masculine française
const VOICE_ID = 'ThT5KcBeYPX3keUQqHPh';

// Formater le texte pour la dictée
function formatDictationText(text: string): string {
  // 1. Ajouter des points de respiration naturels
  text = text.replace(/([.!?])\s+/g, '$1 ... ');
  
  // 2. Ajouter des micro-pauses aux virgules
  text = text.replace(/,\s+/g, ', .. ');
  
  // 3. Ajouter des pauses aux points-virgules et deux-points
  text = text.replace(/[;:]\s+/g, '; ... ');
  
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { text, isDictation } = await req.json();
    console.log('Request received:', { text, isDictation });

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const formattedText = isDictation ? formatDictationText(text) : text;
    console.log('Formatted text:', formattedText);
    console.log('Using voice ID:', VOICE_ID);

    const requestBody = {
      text: formattedText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0,
        speed: 0.85 // Réduire la vitesse pour une meilleure compréhension
      }
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log('API URL:', `${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}`);
    console.log('Headers:', {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY?.substring(0, 8) + '...',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData?.detail || response.statusText);
    }

    console.log('ElevenLabs API response successful');
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error in TTS API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
