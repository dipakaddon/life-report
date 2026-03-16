/**
 * Next.js API Route: /api/chart
 * Pure TypeScript — no Python needed.
 * Uses astronomy-engine npm package for planetary positions.
 * Works on Vercel, Railway, Render — any Node.js host.
 */
import { NextRequest, NextResponse } from 'next/server';
import { calculateChart } from '@/lib/chart-calculator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, minute, lat, lon } = body;

    if ([year, month, day, hour, minute, lat, lon].some(v => v === undefined || v === null)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const chart = calculateChart(
      Number(year), Number(month), Number(day),
      Number(hour), Number(minute),
      Number(lat),  Number(lon)
    );

    return NextResponse.json(chart);

  } catch (error) {
    console.error('Chart error:', error);
    return NextResponse.json(
      { error: 'Chart calculation failed. Please try again.' },
      { status: 500 }
    );
  }
}
