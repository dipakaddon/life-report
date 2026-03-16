/**
 * Next.js API Route: /api/chart
 * Vercel:  routes to /api/chart.py  (Python serverless)
 * Local:   calls python3 subprocess  (same calc_chart.py)
 */
import { NextRequest, NextResponse } from 'next/server';

async function calcLocal(payload: object): Promise<object> {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const path = await import('path');
  const execAsync = promisify(exec);
  const scriptPath = path.join(process.cwd(), 'calc_chart.py');
  const input = JSON.stringify(payload).replace(/'/g, "'\\''");
  const { stdout } = await execAsync(
    `echo '${input}' | python3 "${scriptPath}"`,
    { timeout: 20000 }
  );
  return JSON.parse(stdout.trim());
}

async function calcVercel(payload: object, req: NextRequest): Promise<object> {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  const proto = process.env.VERCEL ? 'https' : 'http';
  const res = await fetch(`${proto}://${host}/api/chart-py`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Python function returned ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, minute, lat, lon } = body;
    if ([year, month, day, hour, minute, lat, lon].some(v => v === undefined)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const payload = { year, month, day, hour, minute, lat, lon };
    const chartData = process.env.VERCEL
      ? await calcVercel(payload, req)
      : await calcLocal(payload);
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Chart error:', error);
    return NextResponse.json({ error: 'Chart calculation failed. Please try again.' }, { status: 500 });
  }
}
