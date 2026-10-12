export type Environment = 'campus' | 'neighbourhood' | 'park' | 'anywhere';
export type QuestStyle = 'nature' | 'architecture' | 'observation' | 'surprise';
export type Difficulty = 'easy' | 'adventurous';
export type QuestDuration = 10 | 20 | 30;

export interface QuestPreferences {
  duration: QuestDuration;
  environment: Environment;
  style: QuestStyle;
  difficulty: Difficulty;
  forceDemo?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  premise: string;
  task: string;
  duration: QuestDuration;
  difficulty: Difficulty;
  hint: string;
  completionCriteria: string;
  reflectionQuestion: string;
  isDemo?: boolean;
  environment?: Environment;
  style?: QuestStyle;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  questId: string;
  questTitle: string;
  questPremise: string;
  task: string;
  reflectionQuestion: string;
  reflectionAnswer: string;
  notes: string;
  photoUrl?: string; // Base64 data URL
  completedAt: number; // Timestamp
  durationMinutes: number;
  environment?: Environment;
  style?: QuestStyle;
  difficulty: Difficulty;
}

export interface OllamaStatus {
  connected: boolean;
  model: string;
  availableModels?: string[];
  error?: string;
}

export interface QuestGenerationResponse {
  quests: Quest[];
  mode: 'local-ai' | 'demo';
  modelUsed?: string;
  warning?: string;
}
