'use client';

import React, { useState, useEffect } from 'react';
import { JournalEntry, Quest } from '@/types/quest';
import {
  getJournalEntries,
  deleteJournalEntry,
  getSavedQuests,
  removeSavedQuest,
  setActiveQuest,
} from '@/lib/storage/indexed-db';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Bookmark,
  Play,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

export default function JournalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'entries' | 'saved'>('entries');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [savedQuests, setSavedQuests] = useState<Quest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const [loadedEntries, loadedSaved] = await Promise.all([
        getJournalEntries(),
        getSavedQuests(),
      ]);
      if (!ignore) {
        setEntries(loadedEntries);
        setSavedQuests(loadedSaved);
        setIsLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const loadData = async () => {
    const [loadedEntries, loadedSaved] = await Promise.all([
      getJournalEntries(),
      getSavedQuests(),
    ]);
    setEntries(loadedEntries);
    setSavedQuests(loadedSaved);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Delete this journal entry? This action cannot be undone.')) {
      await deleteJournalEntry(id);
      await loadData();
    }
  };

  const handleRemoveSaved = async (id: string) => {
    await removeSavedQuest(id);
    await loadData();
  };

  const handleStartSavedQuest = async (quest: Quest) => {
    await setActiveQuest(quest, Date.now());
    router.push('/field');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#121312] pb-4 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#121312] tracking-tight">
            Field Journal & Archives
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#525a54] mt-1">
            Personal repository of completed observations, reflections, and saved expeditions.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('entries')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-[#121312] transition-all ${
              activeTab === 'entries'
                ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
            }`}
          >
            Past Logs ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-[#121312] transition-all ${
              activeTab === 'saved'
                ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
            }`}
          >
            Saved Quests ({savedQuests.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-mono text-sm text-[#525a54]">
          Reading local journal archives...
        </div>
      ) : activeTab === 'entries' ? (
        /* Journal Entries Tab */
        entries.length === 0 ? (
          <div className="bg-white neo-border neo-shadow p-12 text-center max-w-lg mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-[#1b382b] mx-auto" />
            <h3 className="text-xl font-black uppercase text-[#121312]">
              Your Journal Is Empty
            </h3>
            <p className="text-sm text-[#525a54]">
              You haven&apos;t logged any urban explorations yet. Complete a quest and record your reflections to fill these pages!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#1b382b] text-[#fbf9f4] font-black uppercase text-xs neo-border-sm hover:bg-[#2d5a45]"
            >
              Start First Quest
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="bg-white neo-border neo-shadow transition-all"
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#121312]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#e8f0eb] text-[#1b382b] border border-[#1b382b]">
                          {entry.style || 'Exploration'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#525a54]">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(entry.completedAt)}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#525a54]">
                          <Clock className="w-3.5 h-3.5" />
                          {entry.durationMinutes} mins
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase text-[#121312] mt-1">
                        {entry.questTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-[#fbf9f4] hover:bg-[#e8f0eb] border border-[#121312] flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>Collapse</span>
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Read Log</span>
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1.5 text-xs bg-white hover:bg-[#fef9e7] text-[#c85a32] border border-[#121312]"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content View */}
                  {isExpanded && (
                    <div className="p-6 space-y-6 bg-[#fbf9f4]">
                      {/* Reflection Q&A */}
                      <div className="p-4 bg-white border-2 border-[#121312]">
                        <h4 className="text-xs font-mono font-bold uppercase text-[#c85a32] mb-1">
                          Reflection Prompt: &ldquo;{entry.reflectionQuestion}&rdquo;
                        </h4>
                        <p className="text-sm font-semibold text-[#121312] whitespace-pre-wrap leading-relaxed mt-2">
                          {entry.reflectionAnswer}
                        </p>
                      </div>

                      {/* Field notes if any */}
                      {entry.notes && (
                        <div className="p-4 bg-white border-2 border-[#121312]">
                          <h4 className="text-xs font-mono font-bold uppercase text-[#1b382b] mb-1">
                            Additional Field Observations
                          </h4>
                          <p className="text-sm text-[#121312] whitespace-pre-wrap leading-relaxed">
                            {entry.notes}
                          </p>
                        </div>
                      )}

                      {/* Photo artifact if any */}
                      {entry.photoUrl && (
                        <div className="p-4 bg-white border-2 border-[#121312]">
                          <h4 className="text-xs font-mono font-bold uppercase text-[#121312] mb-2 flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-[#1b382b]" />
                            <span>Visual Artifact</span>
                          </h4>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={entry.photoUrl}
                            alt="Field entry visual"
                            className="max-h-80 object-cover border-2 border-[#121312]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Saved Quests Tab */
        savedQuests.length === 0 ? (
          <div className="bg-white neo-border neo-shadow p-12 text-center max-w-lg mx-auto space-y-4">
            <Bookmark className="w-12 h-12 text-[#1b382b] mx-auto" />
            <h3 className="text-xl font-black uppercase text-[#121312]">
              No Saved Quests
            </h3>
            <p className="text-sm text-[#525a54]">
              Bookmark quests on the home screen to build your backlog of urban outings.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#1b382b] text-[#fbf9f4] font-black uppercase text-xs neo-border-sm hover:bg-[#2d5a45]"
            >
              Browse Quests
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-white neo-border neo-shadow p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#e8f0eb] text-[#1b382b] border border-[#1b382b]">
                      {quest.duration} mins • {quest.style || 'Exploration'}
                    </span>
                    <button
                      onClick={() => handleRemoveSaved(quest.id)}
                      className="p-1 text-[#c85a32] hover:bg-[#fef9e7] border border-[#121312]"
                      title="Remove from saved"
                      aria-label="Remove saved quest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-black uppercase text-[#121312] mt-2">
                    {quest.title}
                  </h3>
                  <p className="text-xs text-[#525a54] italic mt-1">&ldquo;{quest.premise}&rdquo;</p>
                  <p className="text-sm font-semibold text-[#121312] mt-3 p-3 bg-[#fbf9f4] border border-[#121312]">
                    {quest.task}
                  </p>
                </div>

                <button
                  onClick={() => handleStartSavedQuest(quest)}
                  className="w-full py-2.5 px-4 bg-[#1b382b] text-[#fbf9f4] text-xs font-black uppercase neo-border-sm hover:bg-[#2d5a45] flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#f4c430]" />
                  <span>Embark On This Mission</span>
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
