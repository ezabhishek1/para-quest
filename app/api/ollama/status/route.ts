import { NextResponse } from 'next/server';
import { checkOllamaStatus } from '@/lib/ai/ollama-client';

export async function GET() {
  const status = await checkOllamaStatus();
  return NextResponse.json(status);
}
