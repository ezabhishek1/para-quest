'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Quest, JournalEntry } from '@/types/quest';
import {
  getActiveQuest,
  clearActiveQuest,
  getSavedQuests,
  saveJournalEntry,
} from '@/lib/storage/indexed-db';
import { validatePhotoFile, processAndCompressImage } from '@/lib/storage/image-handler';
import { JournalEntrySchema } from '@/lib/quests/schemas';
import { BookOpen, Camera, Trash2, CheckCircle, ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function JournalNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questIdParam = searchParams.get('questId');
  const durationParam = parseInt(searchParams.get('duration') || '15', 10);

  const [quest, setQuest] = useState<Quest | null>(null);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [notes, setNotes] = useState('');
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuest() {
      // Check active quest
      const active = await getActiveQuest();
      if (active && (!questIdParam || active.quest.id === questIdParam)) {
        setQuest(active.quest);
        setIsReady(true);
        return;
      }

      // Check saved quests
      if (questIdParam) {
        const saved = await getSavedQuests();
        const match = saved.find((q) => q.id === questIdParam);
        if (match) {
          setQuest(match);
          setIsReady(true);
          return;
        }
      }

      // If active quest exists at all
      if (active) {
        setQuest(active.quest);
      }
      setIsReady(true);
    }

    loadQuest();
  }, [questIdParam]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid photo format');
      return;
    }

    try {
      const compressed = await processAndCompressImage(file);
      setPhotoData(compressed);
    } catch {
      setPhotoError('Failed to process image. Please try a different photo.');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoData(null);
    setPhotoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quest) return;
    setFormError(null);

    const entry: JournalEntry = {
      id: `journal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      questId: quest.id,
      questTitle: quest.title,
      questPremise: quest.premise,
      task: quest.task,
      reflectionQuestion: quest.reflectionQuestion,
      reflectionAnswer: reflectionAnswer.trim(),
      notes: notes.trim(),
      photoUrl: photoData || undefined,
      completedAt: Date.now(),
      durationMinutes: durationParam > 0 ? durationParam : quest.duration,
      environment: quest.environment,
      style: quest.style,
      difficulty: quest.difficulty,
    };

    const validated = JournalEntrySchema.safeParse(entry);
    if (!validated.success) {
      setFormError(validated.error.issues[0]?.message || 'Please fill in required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveJournalEntry(entry);
      await clearActiveQuest();

      // Trigger celebratory touch-grass confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1b382b', '#f4c430', '#c85a32', '#2d5a45'],
      });

      router.push('/journal');
    } catch (err) {
      console.error(err);
      setFormError('Failed to save to local IndexedDB. Ensure storage permissions are enabled.');
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return <div className="py-20 text-center font-mono text-sm text-[#525a54]">Loading journal draft...</div>;
  }

  if (!quest) {
    return (
      <div className="bg-white neo-border neo-shadow p-8 max-w-lg mx-auto text-center space-y-4">
        <h2 className="text-xl font-black uppercase text-[#121312]">No Quest to Journal</h2>
        <p className="text-sm text-[#525a54]">
          You haven&apos;t completed a mission yet to record in your field journal.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-[#1b382b] text-[#fbf9f4] font-black uppercase text-xs neo-border-sm hover:bg-[#2d5a45]"
        >
          Pick A Quest
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between border-b-2 border-[#121312] pb-3">
        <Link
          href="/field"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#525a54] hover:text-[#121312]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field View</span>
        </Link>
        <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase bg-[#f4c430] text-[#121312] border border-[#121312]">
          Entry Draft
        </span>
      </div>

      {/* Journal Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white neo-border neo-shadow-lg p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#1b382b] uppercase">Field Observation Log</span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#121312] leading-tight mt-1">
            {quest.title}
          </h1>
          <p className="text-sm text-[#525a54] mt-1 italic">
            Objective: {quest.task}
          </p>
        </div>

        {formError && (
          <div className="p-3 bg-[#fef9e7] border-2 border-[#c85a32] flex items-center gap-2 text-xs font-bold text-[#c85a32]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* 1. The Quest Reflection Question */}
        <div className="space-y-2">
          <label className="block text-sm font-black uppercase text-[#121312] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1b382b]" />
            <span>1. Reflection: {quest.reflectionQuestion}</span>
          </label>
          <textarea
            required
            rows={3}
            value={reflectionAnswer}
            onChange={(e) => setReflectionAnswer(e.target.value)}
            placeholder="Record what you observed or felt when answering this question..."
            className="w-full p-3.5 bg-[#fbf9f4] border-2 border-[#121312] text-sm text-[#121312] focus:outline-none focus:bg-white resize-y"
          />
        </div>

        {/* 2. Additional Observations */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312]">
            2. Field Notes & Discoveries (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any unexpected sights, smells, sounds, or pedestrian oddities along your route..."
            className="w-full p-3.5 bg-[#fbf9f4] border-2 border-[#121312] text-sm text-[#121312] focus:outline-none focus:bg-white resize-y"
          />
        </div>

        {/* 3. Attach Photo */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#1b382b]" />
            <span>3. Attach Photo Artifact (Optional, stays strictly in your browser)</span>
          </label>

          {photoError && (
            <p className="text-xs font-bold text-[#c85a32]">{photoError}</p>
          )}

          {photoData ? (
            <div className="relative border-2 border-[#121312] bg-[#fbf9f4] p-2 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoData}
                alt="Uploaded field discovery"
                className="max-h-64 object-cover border border-[#121312]"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c85a32] text-white text-xs font-bold uppercase border border-[#121312]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 bg-[#fbf9f4] border-2 border-dashed border-[#121312] cursor-pointer hover:bg-[#e8f0eb] transition-colors">
              <Upload className="w-6 h-6 text-[#1b382b] mb-1" />
              <span className="text-xs font-bold uppercase text-[#121312]">
                Choose or snap a photo (Max 4MB)
              </span>
              <span className="text-[11px] font-mono text-[#525a54] mt-0.5">
                Processed locally, compressed and stored in IndexedDB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-[#e8f0eb] border border-[#121312] text-[11px] font-mono text-[#1b382b]">
          🔒 Field Journal Privacy: All reflections, notes, and photos are saved directly inside your browser&apos;s IndexedDB. Nothing is transmitted to external servers or AI models.
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-[#1b382b] text-[#fbf9f4] neo-border neo-shadow hover:bg-[#2d5a45] text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <CheckCircle className="w-5 h-5 text-[#f4c430]" />
            <span>Save to Field Journal</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewJournalEntryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-mono text-sm text-[#525a54]">Loading journal editor...</div>}>
      <JournalNewContent />
    </Suspense>
  );
}
