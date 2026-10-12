import { describe, it, expect } from 'vitest';
import { validateQuestSafety, filterSafeQuests } from '../lib/safety/validator';
import { Quest } from '../types/quest';

describe('Quest Safety and Duration Validator', () => {
  it('accepts safe urban observation quests with valid durations', () => {
    const safeQuest: Partial<Quest> = {
      title: 'Leaf Structure Search',
      premise: 'Notice resilient flora in sidewalk gaps.',
      task: 'Find three different leaf shapes without picking anything.',
      hint: 'Look near streetlamp bases.',
      completionCriteria: 'Identified 3 distinct leaves.',
      duration: 20,
    };

    const result = validateQuestSafety(safeQuest);
    expect(result.isSafe).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('rejects quests asking to trespass or enter private property', () => {
    const unsafeQuest: Partial<Quest> = {
      title: 'Sneak Inside',
      task: 'Climb fence into private property to look at backyard plants.',
      duration: 10,
    };

    const result = validateQuestSafety(unsafeQuest);
    expect(result.isSafe).toBe(false);
    expect(result.reasons.some((r) => r.includes('private property'))).toBe(true);
  });

  it('rejects quests requiring spending money or purchasing items', () => {
    const paidQuest: Partial<Quest> = {
      title: 'Coffee Shop Study',
      task: 'Go buy an expensive coffee and notice the receipt.',
      duration: 10,
    };

    const result = validateQuestSafety(paidQuest);
    expect(result.isSafe).toBe(false);
    expect(result.reasons.some((r) => r.includes('buy'))).toBe(true);
  });

  it('rejects quests with invalid durations (must be 10, 20, or 30)', () => {
    const invalidDurationQuest: Partial<Quest> = {
      title: 'Quick Walk',
      task: 'Look at three street signs.',
      duration: 45 as unknown as Quest['duration'],
    };

    const result = validateQuestSafety(invalidDurationQuest);
    expect(result.isSafe).toBe(false);
    expect(result.reasons.some((r) => r.includes('Invalid duration'))).toBe(true);
  });

  it('filters out unsafe quests from a list', () => {
    const list: Quest[] = [
      {
        id: '1',
        title: 'Safe Observation',
        premise: 'Calm stroll',
        task: 'Look up at brick lintels.',
        duration: 10,
        difficulty: 'easy',
        hint: 'Look above door frames.',
        completionCriteria: 'Spotted 2 lintels.',
        reflectionQuestion: 'How old was the brick?',
        createdAt: Date.now(),
      },
      {
        id: '2',
        title: 'Unsafe Adventure',
        premise: 'Break rules',
        task: 'Climb fence into an abandoned building.',
        duration: 10,
        difficulty: 'adventurous',
        hint: 'Hurry before police see.',
        completionCriteria: 'Entered building.',
        reflectionQuestion: 'Was it scary?',
        createdAt: Date.now(),
      },
    ];

    const safeOnly = filterSafeQuests(list);
    expect(safeOnly).toHaveLength(1);
    expect(safeOnly[0].id).toBe('1');
  });
});
