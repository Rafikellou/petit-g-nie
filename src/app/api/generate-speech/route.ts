import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    // Convertir le ReadableStream en ArrayBuffer
    const buffer = await mp3Response.arrayBuffer();

    // Créer une réponse avec le bon type MIME
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la génération de la voix:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la voix' },
      { status: 500 }
    );
  }
}
