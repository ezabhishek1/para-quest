import { NextRequest, NextResponse } from 'next/server';
import { QuestPreferencesSchema } from '@/lib/quests/schemas';
import { generateQuestsWithOllama } from '@/lib/ai/ollama-client';
import { generateDemoQuests } from '@/lib/ai/demo-generator';
import { QuestGenerationResponse } from '@/types/quest';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = QuestPreferencesSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request preferences',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const prefs = parseResult.data;

    // Explicit demo mode requested by user
    if (prefs.forceDemo) {
      const demoQuests = generateDemoQuests(prefs);
      const response: QuestGenerationResponse = {
        quests: demoQuests,
        mode: 'demo',
      };
      return NextResponse.json(response);
    }

    // Try Local AI mode
    try {
      const { quests, modelUsed } = await generateQuestsWithOllama(prefs);
      const response: QuestGenerationResponse = {
        quests,
        mode: 'local-ai',
        modelUsed,
      };
      return NextResponse.json(response);
    } catch (aiError: unknown) {
      const errMessage = aiError instanceof Error ? aiError.message : 'Unknown AI generation error';

      // Provide a structured error with explicit option to fall back to demo mode
      return NextResponse.json(
        {
          error: 'Local AI generation failed',
          message: errMessage,
          canFallbackToDemo: true,
          details:
            'Ollama could not be reached or failed to produce valid quests. You can retry with Demo Mode or inspect your local Ollama setup in Settings.',
        },
        { status: 503 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
