import { NextResponse } from 'next/server';
import { queryGroq } from '@/app/services/groq';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await queryGroq(prompt);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Erreur lors de la requête à Groq:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}