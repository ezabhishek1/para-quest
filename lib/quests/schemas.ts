import { z } from 'zod';

export const QuestPreferencesSchema = z.object({
  duration: z.union([z.literal(10), z.literal(20), z.literal(30)]),
  environment: z.enum(['campus', 'neighbourhood', 'park', 'anywhere']),
  style: z.enum(['nature', 'architecture', 'observation', 'surprise']),
  difficulty: z.enum(['easy', 'adventurous']),
  forceDemo: z.boolean().optional(),
});

export const QuestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(80),
  premise: z.string().min(10).max(250),
  task: z.string().min(10).max(300),
  duration: z.union([z.literal(10), z.literal(20), z.literal(30)]),
  difficulty: z.enum(['easy', 'adventurous']),
  hint: z.string().min(5).max(180),
  completionCriteria: z.string().min(5).max(200),
  reflectionQuestion: z.string().min(10).max(180),
  isDemo: z.boolean().optional(),
  environment: z.enum(['campus', 'neighbourhood', 'park', 'anywhere']).optional(),
  style: z.enum(['nature', 'architecture', 'observation', 'surprise']).optional(),
  createdAt: z.number().default(() => Date.now()),
});

export const QuestsArraySchema = z.array(QuestSchema).length(3);

export const AiQuestItemSchema = z.object({
  title: z.string().min(3).max(80),
  premise: z.string().min(10).max(250),
  task: z.string().min(10).max(300),
  duration: z.union([z.literal(10), z.literal(20), z.literal(30)]),
  difficulty: z.enum(['easy', 'adventurous']),
  hint: z.string().min(5).max(180),
  completionCriteria: z.string().min(5).max(200),
  reflectionQuestion: z.string().min(10).max(180),
});

export const AiQuestsResponseSchema = z.object({
  quests: z.array(AiQuestItemSchema).min(1).max(5),
});

export const JournalEntrySchema = z.object({
  id: z.string().min(1),
  questId: z.string().min(1),
  questTitle: z.string().min(1),
  questPremise: z.string().min(1),
  task: z.string().min(1),
  reflectionQuestion: z.string().min(1),
  reflectionAnswer: z.string().min(1, 'Please record a short reflection answer'),
  notes: z.string().optional().default(''),
  photoUrl: z.string().optional(),
  completedAt: z.number(),
  durationMinutes: z.number().min(1),
  environment: z.enum(['campus', 'neighbourhood', 'park', 'anywhere']).optional(),
  style: z.enum(['nature', 'architecture', 'observation', 'surprise']).optional(),
  difficulty: z.enum(['easy', 'adventurous']),
});
