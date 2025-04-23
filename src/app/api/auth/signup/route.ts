import { NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Log pour débogage
    console.log('Données reçues pour inscription:', JSON.stringify(userData, null, 2));
    
    const { user, error } = await authService.signUp(userData);
    
    if (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
