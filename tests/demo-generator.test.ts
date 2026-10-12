import { describe, it, expect } from 'vitest';
import { generateDemoQuests } from '../lib/ai/demo-generator';
import { QuestPreferences } from '../types/quest';
import { validateQuestSafety } from '../lib/safety/validator';
import { QuestSchema } from '../lib/quests/schemas';

describe('Demo Quest Generation & Zod Validation', () => {
  it('generates exactly 3 distinct quests respecting requested duration and difficulty', () => {
    const prefs: QuestPreferences = {
      duration: 20,
      environment: 'park',
      style: 'nature',
      difficulty: 'adventurous',
    };

    const quests = generateDemoQuests(prefs);
    expect(quests).toHaveLength(3);

    const ids = new Set(quests.map((q) => q.id));
    expect(ids.size).toBe(3); // Unique IDs

    for (const quest of quests) {
      expect(quest.duration).toBe(20);
      expect(quest.difficulty).toBe('adventurous');
      expect(quest.isDemo).toBe(true);

      // Verify Zod schema parsing
      const parseResult = QuestSchema.safeParse(quest);
      expect(parseResult.success).toBe(true);

      // Verify safety validation
      const safetyResult = validateQuestSafety(quest);
      expect(safetyResult.isSafe).toBe(true);
    }
  });

  it('generates valid quests for all durations (10, 20, 30)', () => {
    for (const duration of [10, 20, 30] as const) {
      const quests = generateDemoQuests({
        duration,
        environment: 'campus',
        style: 'architecture',
        difficulty: 'easy',
      });
      expect(quests).toHaveLength(3);
      expect(quests[0].duration).toBe(duration);
    }
  });
});
