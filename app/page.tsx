'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quest, QuestPreferences } from '@/types/quest';
import { setActiveQuest } from '@/lib/storage/indexed-db';
import QuestCard from '@/components/QuestCard';
import QuestForm from '@/components/QuestForm';
import QuestDetailModal from '@/components/QuestDetailModal';
import { saveQuestLocally, removeSavedQuest, getSavedQuests } from '@/lib/storage/indexed-db';
import { Sparkles, AlertTriangle, RefreshCw, Footprints } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasOllama, setHasOllama] = useState<boolean | null>(null);
  const [generationNotice, setGenerationNotice] = useState<{
    mode: 'local-ai' | 'demo';
    message: string;
  } | null>(null);
  const [lastPrefs, setLastPrefs] = useState<QuestPreferences | null>(null);

  useEffect(() => {
    // Check Ollama status
    fetch('/api/ollama/status')
      .then((res) => res.json())
      .then((data) => {
        setHasOllama(data.connected);
      })
      .catch(() => {
        setHasOllama(false);
      });

    // Load saved quests ids to show bookmark status
    getSavedQuests().then((saved) => {
      setSavedIds(new Set(saved.map((q) => q.id)));
    });
  }, []);

  const handleGenerate = async (prefs: QuestPreferences) => {
    setIsLoading(true);
    setGenerationNotice(null);
    setLastPrefs(prefs);

    try {
      const response = await fetch('/api/quests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Fallback option directly provided if Ollama is unreachable
        if (errorData.canFallbackToDemo) {
          // Explicitly fall back to demo mode with clear indication
          const demoFallbackRes = await fetch('/api/quests/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...prefs, forceDemo: true }),
          });
          const demoData = await demoFallbackRes.json();
          setQuests(demoData.quests);
          setGenerationNotice({
            mode: 'demo',
            message:
              'Ollama is offline or unreachable. We loaded 3 curated Demo Quests so you can explore without interruption!',
          });
          return;
        }
        throw new Error(errorData.error || 'Failed to generate quests');
      }

      const data = await response.json();
      setQuests(data.quests);
      if (data.mode === 'local-ai') {
        setGenerationNotice({
          mode: 'local-ai',
          message: `Generated using local Gemma model (${data.modelUsed || 'gemma'}). Verified by safety engine.`,
        });
      } else {
        setGenerationNotice({
          mode: 'demo',
          message: 'Personalized from our curated urban exploration catalog (Demo Mode).',
        });
      }
    } catch (err: unknown) {
      console.error(err);
      // Fallback cleanly
      const demoFallbackRes = await fetch('/api/quests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prefs, forceDemo: true }),
      });
      const demoData = await demoFallbackRes.json();
      setQuests(demoData.quests);
      setGenerationNotice({
        mode: 'demo',
        message: 'Loaded curated Demo Quests due to network or AI inference timeout.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuest = async (quest: Quest) => {
    await setActiveQuest(quest, Date.now());
    router.push('/field');
  };

  const handleToggleSave = async (quest: Quest) => {
    const isCurrentlySaved = savedIds.has(quest.id);
    if (isCurrentlySaved) {
      await removeSavedQuest(quest.id);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(quest.id);
        return next;
      });
    } else {
      await saveQuestLocally(quest);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.add(quest.id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Editorial Hero Banner */}
      <section className="bg-white neo-border neo-shadow-lg p-6 sm:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1b382b] text-[#f4c430] text-xs font-mono font-bold uppercase border border-[#121312]">
            <Footprints className="w-4 h-4" />
            <span>DEV.to Touch Grass Challenge 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-[#121312] tracking-tight leading-[1.05]">
            The city is full of things you&apos;ve never noticed.
          </h1>

          <p className="text-base sm:text-lg text-[#525a54] font-medium leading-relaxed max-w-2xl">
            Put away your phone. Step out your front door. ParaQuest turns routine streets into
            sensory playgrounds with short, mind-opening real-world observation quests.
          </p>

          {/* 3 Steps Visual Flow */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#fbf9f4] border-2 border-[#121312]">
              <span className="font-mono text-xs font-bold text-[#c85a32]">01 // SELECT</span>
              <p className="text-xs font-bold text-[#121312] mt-0.5">Pick 10, 20, or 30 minutes</p>
            </div>
            <div className="p-3 bg-[#fbf9f4] border-2 border-[#121312]">
              <span className="font-mono text-xs font-bold text-[#1b382b]">02 // EXPLORE</span>
              <p className="text-xs font-bold text-[#121312] mt-0.5">Pocket your device & observe</p>
            </div>
            <div className="p-3 bg-[#fbf9f4] border-2 border-[#121312]">
              <span className="font-mono text-xs font-bold text-[#121312]">03 // RECORD</span>
              <p className="text-xs font-bold text-[#121312] mt-0.5">Log discoveries in field journal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quest Configuration Form */}
      <section>
        <QuestForm onGenerate={handleGenerate} isLoading={isLoading} hasOllama={hasOllama} />
      </section>

      {/* Generation Status Alert Banner */}
      {generationNotice && (
        <div
          className={`p-4 border-2 border-[#121312] neo-shadow-sm flex items-start justify-between gap-3 ${
            generationNotice.mode === 'local-ai' ? 'bg-[#e8f0eb]' : 'bg-[#fef9e7]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {generationNotice.mode === 'local-ai' ? (
              <Sparkles className="w-5 h-5 text-[#1b382b] shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#c85a32] shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-bold text-[#121312]">
              {generationNotice.message}
            </p>
          </div>
          {generationNotice.mode === 'demo' && (
            <Link
              href="/settings"
              className="text-xs font-mono font-bold underline text-[#121312] hover:text-[#1b382b] shrink-0"
            >
              Configure Ollama →
            </Link>
          )}
        </div>
      )}

      {/* Quests Display */}
      {quests.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b-2 border-[#121312] gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#121312]">
                Your Three Quests
              </h2>
              <p className="text-xs font-mono text-[#525a54]">
                Choose one expedition to begin right now, or save them to your field notebook.
              </p>
            </div>
            {lastPrefs && (
              <button
                onClick={() => handleGenerate(lastPrefs)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#e8f0eb] border-2 border-[#121312] text-xs font-bold uppercase transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Generate Another Set</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isSaved={savedIds.has(quest.id)}
                onStartQuest={handleStartQuest}
                onToggleSave={handleToggleSave}
                onViewDetails={(q) => setSelectedQuest(q)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Details Modal */}
      <QuestDetailModal
        quest={selectedQuest}
        onClose={() => setSelectedQuest(null)}
        onStartQuest={handleStartQuest}
      />
    </div>
  );
}
