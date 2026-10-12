import { Quest } from '@/types/quest';

/**
 * Hard safety validation constraints enforced strictly in deterministic code.
 * Ensures quests never ask users to enter private property, pay money,
 * touch hazardous things, take physical risks, or perform illegal acts.
 */

const FORBIDDEN_WORDS = [
  'trespass',
  'private property',
  'break in',
  'climb fence',
  'climb over',
  'cross tracks',
  'buy',
  'purchase',
  'spend money',
  'pay',
  'credit card',
  'eat wild',
  'ingest',
  'taste berry',
  'touch animal',
  'touch dog',
  'touch snake',
  'capture animal',
  'feed wild',
  'confront',
  'steal',
  'take without',
  'pick flowers',
  'tear branch',
  'damage',
  'vandalize',
  'run across highway',
  'step onto highway',
  'restricted area',
  'construction site',
  'abandoned building',
];

export interface SafetyValidationResult {
  isSafe: boolean;
  reasons: string[];
}

export function validateQuestSafety(quest: Partial<Quest>): SafetyValidationResult {
  const reasons: string[] = [];

  const textToScan = [
    quest.title || '',
    quest.premise || '',
    quest.task || '',
    quest.hint || '',
    quest.completionCriteria || '',
  ].join(' ').toLowerCase();

  for (const phrase of FORBIDDEN_WORDS) {
    if (textToScan.includes(phrase)) {
      reasons.push(`Contains unsafe prompt/action phrase: "${phrase}"`);
    }
  }

  // Duration constraint check
  if (quest.duration && ![10, 20, 30].includes(quest.duration)) {
    reasons.push(`Invalid duration: ${quest.duration}. Must be 10, 20, or 30 minutes.`);
  }

  // Title and task minimum completeness
  if (!quest.title || quest.title.trim().length < 3) {
    reasons.push('Title is too short or missing.');
  }

  if (!quest.task || quest.task.trim().length < 10) {
    reasons.push('Task instruction is too short or missing.');
  }

  return {
    isSafe: reasons.length === 0,
    reasons,
  };
}

/**
 * Sanitizes and asserts that a list of quests complies with all safety rules.
 * Throws or filters out unsafe quests.
 */
export function filterSafeQuests(quests: Quest[]): Quest[] {
  return quests.filter((q) => validateQuestSafety(q).isSafe);
}
