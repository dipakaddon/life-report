export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { generateAllPredictions, detectYogas, calculateDashas, ChartData } from '@/lib/jyotish-engine-v2';

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);
    // Basic validation so errors are visible in Vercel logs instead of generic 400s
    if (!body || typeof body !== 'object') {
      console.error('Report error: empty or invalid body');
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { chart, birthYear } = body as { chart?: ChartData; birthYear?: number };
    if (!chart || typeof birthYear !== 'number') {
      console.error('Report error: missing chart or birthYear', { hasChart: !!chart, birthYear });
      return NextResponse.json({ error: 'Missing required fields: chart, birthYear' }, { status: 400 });
    }

    const predictions = generateAllPredictions(chart);
    const yogas = detectYogas(chart);
    const dashas = calculateDashas(chart, birthYear);
    return NextResponse.json({ predictions, yogas, dashas });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}
