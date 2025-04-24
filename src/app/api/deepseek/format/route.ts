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
    const { rawResponse, isArray } = await request.json();

    console.log('Sending format request to Deepseek with raw response length:', rawResponse.length);

    // Construire le prompt pour le formatage
    const formatPrompt = isArray 
      ? `Voici une réponse textuelle qui contient des informations sur des questions de quiz: "${rawResponse}". 

Ta tâche est d'extraire ces informations et de les convertir en un tableau JSON valide avec exactement ce format:
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

IMPORTANT: Ta réponse doit être UNIQUEMENT le tableau JSON valide, sans aucun texte avant ou après, ni délimiteurs de code comme \`\`\`. Vérifie que chaque question a tous les champs requis.`
      : `Voici une réponse textuelle qui contient des informations sur une question de quiz: "${rawResponse}". 

Ta tâche est d'extraire ces informations et de les convertir en un objet JSON valide avec exactement ce format:
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

IMPORTANT: Ta réponse doit être UNIQUEMENT l'objet JSON valide, sans aucun texte avant ou après, ni délimiteurs de code comme \`\`\`. Vérifie que tous les champs requis sont présents.`;

    // Construire les messages pour l'API
    const messages = [
      {
        role: "system",
        content: "Tu es un assistant spécialisé dans l'extraction et le formatage de données JSON. Ta tâche est de convertir des réponses textuelles en JSON valide, en suivant strictement le format demandé. Tu dois renvoyer UNIQUEMENT du JSON valide, sans aucun texte ou délimiteur supplémentaire."
      },
      {
        role: "user",
        content: formatPrompt
      }
    ];

    // Utiliser AbortController pour gérer les timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes de timeout
    
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
          temperature: 0.1, // Température basse pour des réponses plus déterministes
          max_tokens: 2000,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
      console.log('Formatted content from Deepseek:', formattedContent.substring(0, 200) + '...');
      
      // Nettoyer la réponse pour extraire uniquement le JSON valide
      try {
        // Fonction pour extraire le JSON d'une chaîne de texte
        const extractJson = (text: string): string => {
          // Étape 1: Vérifier les délimiteurs de code markdown
          if (text.includes('```json')) {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              return jsonMatch[1].trim();
            }
          } else if (text.includes('```')) {
            const codeMatch = text.match(/```\s*([\s\S]*?)\s*```/);
            if (codeMatch && codeMatch[1]) {
              return codeMatch[1].trim();
            }
          }
          
          // Étape 2: Rechercher des accolades ou crochets pour identifier du JSON
          const jsonRegex = /\{[\s\S]*\}|\[[\s\S]*\]/;
          const jsonMatch = text.match(jsonRegex);
          if (jsonMatch && jsonMatch[0]) {
            return jsonMatch[0];
          }
          
          // Si aucun JSON n'a été trouvé, retourner le texte original
          return text;
        };
        
        // Extraire le JSON de la réponse
        const extractedJson = extractJson(formattedContent);
        console.log('Extracted JSON:', extractedJson.substring(0, 200) + '...');
        
        // Essayer de parser le JSON pour vérifier qu'il est valide
        const parsedJson = JSON.parse(extractedJson);
        
        // Vérifier que le format est correct
        if (isArray) {
          if (!Array.isArray(parsedJson)) {
            throw new Error('La réponse n\'est pas un tableau JSON');
          }
          
          // Vérifier que chaque élément du tableau a le bon format
          for (const item of parsedJson) {
            if (!item.question || !item.options || !item.correctAnswer || !item.explanation) {
              console.warn('Item incomplet dans le tableau:', item);
            }
          }
        } else {
          if (Array.isArray(parsedJson)) {
            // Si on attendait un objet mais qu'on a reçu un tableau, prendre le premier élément
            if (parsedJson.length > 0) {
              console.warn('Reçu un tableau au lieu d\'un objet, utilisation du premier élément');
              return NextResponse.json({
                formattedResponse: parsedJson[0]
              });
            } else {
              throw new Error('La réponse est un tableau vide alors qu\'un objet était attendu');
            }
          }
          
          // Vérifier que l'objet a le bon format
          if (!parsedJson.question || !parsedJson.options || !parsedJson.correctAnswer || !parsedJson.explanation) {
            console.warn('Objet incomplet:', parsedJson);
          }
        }
        
        return NextResponse.json({
          formattedResponse: parsedJson
        });
      } catch (error) {
        console.error('Error parsing formatted response:', error);
        
        // Tentative de récupération en cas d'erreur
        try {
          // Essayer une approche plus agressive pour extraire le JSON
          const firstBrace = formattedContent.indexOf('{');
          const firstBracket = formattedContent.indexOf('[');
          const lastBrace = formattedContent.lastIndexOf('}');
          const lastBracket = formattedContent.lastIndexOf(']');
          
          let start = -1;
          let end = -1;
          
          if (isArray && firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            start = firstBracket;
            end = lastBracket;
          } else if (!isArray && firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            start = firstBrace;
            end = lastBrace;
          }
          
          if (start !== -1 && end !== -1) {
            const extractedJson = formattedContent.substring(start, end + 1);
            console.log('Tentative de récupération avec JSON extrait manuellement:', extractedJson.substring(0, 200) + '...');
            
            try {
              const parsedJson = JSON.parse(extractedJson);
              return NextResponse.json({
                formattedResponse: parsedJson,
                warning: 'JSON récupéré après extraction manuelle'
              });
            } catch (finalError) {
              console.error('Échec de la récupération manuelle:', finalError);
            }
          }
        } catch (recoveryError) {
          console.error('Erreur lors de la tentative de récupération:', recoveryError);
        }
        
        return NextResponse.json(
          { 
            error: 'Failed to format response as valid JSON',
            message: error instanceof Error ? error.message : 'Unknown error',
            rawContent: formattedContent.substring(0, 500) // Limiter la taille pour éviter des réponses trop volumineuses
          },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request to Deepseek API timed out');
        return NextResponse.json(
          { error: 'Request to Deepseek API timed out after 30 seconds' },
          { status: 504 }
        );
      }
      
      throw fetchError; // Relancer l'erreur pour qu'elle soit traitée par le catch externe
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
