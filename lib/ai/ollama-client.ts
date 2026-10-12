import { Quest, QuestPreferences, OllamaStatus } from '@/types/quest';
import { buildQuestSystemPrompt, buildQuestUserPrompt } from './prompts';
import { AiQuestsResponseSchema } from '../quests/schemas';
import { validateQuestSafety } from '../safety/validator';

const DEFAULT_OLLAMA_HOST = 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'gemma:2b';

export function getOllamaConfig() {
  const host = process.env.OLLAMA_HOST || process.env.NEXT_PUBLIC_OLLAMA_HOST || DEFAULT_OLLAMA_HOST;
  const model = process.env.OLLAMA_MODEL || DEFAULT_MODEL;
  const timeoutMs = parseInt(process.env.OLLAMA_TIMEOUT_MS || '25000', 10);

  return {
    host: host.replace(/\/+$/, ''),
    model,
    timeoutMs,
  };
}

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  const config = getOllamaConfig();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${config.host}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        connected: false,
        model: config.model,
        error: `Ollama returned status ${res.status}`,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models.map((m: { name?: string }) => m.name || '') : [];

    return {
      connected: true,
      model: config.model,
      availableModels: models,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection failed';
    return {
      connected: false,
      model: config.model,
      error: message.includes('abort') ? 'Ollama connection timed out' : 'Ollama server unreachable at ' + config.host,
    };
  }
}

export async function generateQuestsWithOllama(
  prefs: QuestPreferences
): Promise<{ quests: Quest[]; modelUsed: string }> {
  const config = getOllamaConfig();

  async function callOllama(isRetry: boolean = false): Promise<Quest[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const promptText = buildQuestUserPrompt(prefs) +
      (isRetry ? '\nIMPORTANT: Return ONLY valid JSON with 3 quests. No Markdown backticks.' : '');

    const body = {
      model: config.model,
      prompt: promptText,
      system: buildQuestSystemPrompt(),
      stream: false,
      format: 'json',
      options: {
        temperature: 0.7,
        top_p: 0.9,
      },
    };

    try {
      const response = await fetch(`${config.host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status}: ${await response.text()}`);
      }

      const raw = await response.json();
      const content = raw.response?.trim();

      if (!content) {
        throw new Error('Empty response received from Ollama model.');
      }

      // Clean markdown code blocks if the model wrapped output
      const cleaned = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // try to extract JSON array or object
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Response could not be parsed as JSON');
        }
      }

      // Validate with Zod
      const validated = AiQuestsResponseSchema.safeParse(parsed);
      if (!validated.success) {
        throw new Error(`Model schema mismatch: ${validated.error.issues.map(i => i.message).join(', ')}`);
      }

      // Convert and validate safety
      const generatedQuests: Quest[] = validated.data.quests.map((item, idx) => ({
        id: `ai-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        title: item.title,
        premise: item.premise,
        task: item.task,
        duration: prefs.duration,
        difficulty: prefs.difficulty,
        hint: item.hint,
        completionCriteria: item.completionCriteria,
        reflectionQuestion: item.reflectionQuestion,
        isDemo: false,
        environment: prefs.environment,
        style: prefs.style,
        createdAt: Date.now(),
      }));

      // Check safety constraints on each quest
      const safeQuests = generatedQuests.filter(q => validateQuestSafety(q).isSafe);

      if (safeQuests.length < 3) {
        throw new Error(`Model generated quests that failed safety checks or were incomplete (${safeQuests.length}/3 valid).`);
      }

      return safeQuests.slice(0, 3);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  try {
    const quests = await callOllama(false);
    return { quests, modelUsed: config.model };
  } catch (firstError) {
    // Retry once with a bounded prompt
    try {
      const retryQuests = await callOllama(true);
      return { quests: retryQuests, modelUsed: config.model };
    } catch {
      throw firstError;
    }
  }
}
