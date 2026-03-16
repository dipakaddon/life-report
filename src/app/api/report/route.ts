import { NextRequest, NextResponse } from 'next/server';
import { generateAllPredictions, detectYogas, calculateDashas, ChartData } from '@/lib/jyotish-engine-v2';

export async function POST(req: NextRequest) {
  try {
    const { chart, birthYear } = await req.json() as { chart: ChartData; birthYear: number };
    const predictions = generateAllPredictions(chart);
    const yogas = detectYogas(chart);
    const dashas = calculateDashas(chart, birthYear);
    return NextResponse.json({ predictions, yogas, dashas });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}
