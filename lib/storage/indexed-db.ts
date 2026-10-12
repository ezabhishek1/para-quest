import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Quest, JournalEntry } from '@/types/quest';

interface ParaQuestDB extends DBSchema {
  savedQuests: {
    key: string;
    value: Quest;
    indexes: { 'by-date': number };
  };
  journalEntries: {
    key: string;
    value: JournalEntry;
    indexes: { 'by-date': number };
  };
  activeQuest: {
    key: string;
    value: {
      quest: Quest;
      startedAt: number;
    };
  };
}

const DB_NAME = 'paraquest_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ParaQuestDB>> | null = null;

export function getDB() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB<ParaQuestDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('savedQuests')) {
          const store = db.createObjectStore('savedQuests', { keyPath: 'id' });
          store.createIndex('by-date', 'createdAt');
        }
        if (!db.objectStoreNames.contains('journalEntries')) {
          const store = db.createObjectStore('journalEntries', { keyPath: 'id' });
          store.createIndex('by-date', 'completedAt');
        }
        if (!db.objectStoreNames.contains('activeQuest')) {
          db.createObjectStore('activeQuest');
        }
      },
    });
  }
  return dbPromise;
}

// SAVED QUESTS
export async function saveQuestLocally(quest: Quest): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('savedQuests', quest);
}

export async function removeSavedQuest(questId: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('savedQuests', questId);
}

export async function getSavedQuests(): Promise<Quest[]> {
  const db = await getDB();
  if (!db) return [];
  const items = await db.getAllFromIndex('savedQuests', 'by-date');
  return items.reverse(); // newest first
}

export async function isQuestSaved(questId: string): Promise<boolean> {
  const db = await getDB();
  if (!db) return false;
  const item = await db.get('savedQuests', questId);
  return !!item;
}

// ACTIVE QUEST (FIELD MODE PERSISTENCE)
export async function setActiveQuest(quest: Quest, startedAt: number): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('activeQuest', { quest, startedAt }, 'current');
}

export async function getActiveQuest(): Promise<{ quest: Quest; startedAt: number } | null> {
  const db = await getDB();
  if (!db) return null;
  const current = await db.get('activeQuest', 'current');
  return current || null;
}

export async function clearActiveQuest(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('activeQuest', 'current');
}

// JOURNAL ENTRIES
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('journalEntries', entry);
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  if (!db) return [];
  const entries = await db.getAllFromIndex('journalEntries', 'by-date');
  return entries.reverse(); // newest first
}

export async function getJournalEntry(id: string): Promise<JournalEntry | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('journalEntries', id);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('journalEntries', id);
}

// EXPORT & CLEAR
export async function exportLocalDataAsJSON(): Promise<string> {
  const db = await getDB();
  if (!db) return JSON.stringify({ savedQuests: [], journalEntries: [] }, null, 2);

  const savedQuests = await db.getAll('savedQuests');
  const journalEntries = await db.getAll('journalEntries');

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: 'ParaQuest',
      version: '1.0.0',
      savedQuests,
      journalEntries,
    },
    null,
    2
  );
}

export async function clearAllLocalData(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.clear('savedQuests');
  await db.clear('journalEntries');
  await db.clear('activeQuest');
}
