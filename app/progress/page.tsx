'use client';

import React, { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/quest';
import { getJournalEntries } from '@/lib/storage/indexed-db';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  Calendar as CalendarIcon,
  TreePine,
  Building,
  Eye,
  Shuffle,
} from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getJournalEntries().then((data) => {
      setEntries(data);
      setIsLoading(false);
    });
  }, []);

  const totalQuests = entries.length;
  const totalMinutes = entries.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Category breakdown
  const styleBreakdown = entries.reduce<Record<string, number>>((acc, curr) => {
    const key = curr.style || 'observation';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Date groups (History timeline)
  const sortedEntries = [...entries].sort((a, b) => b.completedAt - a.completedAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#121312] pb-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#121312] tracking-tight">
          Exploration Index
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#525a54] mt-1">
          A calm, non-addictive log of your real-world observations and outdoor immersion.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-mono text-sm text-[#525a54]">
          Computing personal exploration metrics...
        </div>
      ) : totalQuests === 0 ? (
        <div className="bg-white neo-border neo-shadow p-12 text-center max-w-lg mx-auto space-y-4">
          <BarChart3 className="w-12 h-12 text-[#1b382b] mx-auto" />
          <h3 className="text-xl font-black uppercase text-[#121312]">No Expeditions Logged</h3>
          <p className="text-sm text-[#525a54]">
            As you complete outdoor quests and answer reflection questions, your exploration milestones will appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#1b382b] text-[#fbf9f4] font-black uppercase text-xs neo-border-sm hover:bg-[#2d5a45]"
          >
            Embark on First Quest
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white neo-border neo-shadow p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#525a54]">
                  Total Outings
                </span>
                <p className="text-4xl font-black text-[#121312] mt-1 font-mono">{totalQuests}</p>
                <span className="text-[11px] text-[#1b382b] font-medium">Completed outdoor quests</span>
              </div>
              <div className="w-12 h-12 bg-[#e8f0eb] border-2 border-[#121312] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#1b382b]" />
              </div>
            </div>

            <div className="bg-white neo-border neo-shadow p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#525a54]">
                  Outdoor Immersion
                </span>
                <p className="text-4xl font-black text-[#121312] mt-1 font-mono">{totalMinutes}m</p>
                <span className="text-[11px] text-[#c85a32] font-medium">{totalHours} total exploration hours</span>
              </div>
              <div className="w-12 h-12 bg-[#f5ede4] border-2 border-[#121312] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#c85a32]" />
              </div>
            </div>

            <div className="bg-white neo-border neo-shadow p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#525a54]">
                  Observations
                </span>
                <p className="text-4xl font-black text-[#121312] mt-1 font-mono">{totalQuests}</p>
                <span className="text-[11px] text-[#121312] font-medium">Reflections recorded</span>
              </div>
              <div className="w-12 h-12 bg-[#fef9e7] border-2 border-[#121312] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#121312]" />
              </div>
            </div>
          </div>

          {/* Sensory Focus Breakdown */}
          <div className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black uppercase text-[#121312] tracking-tight">
              Exploration Balance By Style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#e8f0eb] border-2 border-[#121312] flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#1b382b]">
                  <TreePine className="w-4 h-4" />
                  <span>Nature</span>
                </div>
                <div className="mt-3 text-2xl font-black font-mono text-[#121312]">
                  {styleBreakdown['nature'] || 0}
                </div>
              </div>

              <div className="p-4 bg-[#f5ede4] border-2 border-[#121312] flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#c85a32]">
                  <Building className="w-4 h-4" />
                  <span>Architecture</span>
                </div>
                <div className="mt-3 text-2xl font-black font-mono text-[#121312]">
                  {styleBreakdown['architecture'] || 0}
                </div>
              </div>

              <div className="p-4 bg-[#fef9e7] border-2 border-[#121312] flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#121312]">
                  <Eye className="w-4 h-4" />
                  <span>Observation</span>
                </div>
                <div className="mt-3 text-2xl font-black font-mono text-[#121312]">
                  {styleBreakdown['observation'] || 0}
                </div>
              </div>

              <div className="p-4 bg-[#fbf9f4] border-2 border-[#121312] flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#121312]">
                  <Shuffle className="w-4 h-4" />
                  <span>Surprise</span>
                </div>
                <div className="mt-3 text-2xl font-black font-mono text-[#121312]">
                  {styleBreakdown['surprise'] || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Chronological History View */}
          <div className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black uppercase text-[#121312] tracking-tight">
              Chronological Expedition Timeline
            </h3>

            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-[#fbf9f4] border-2 border-[#121312] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#525a54]">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{new Date(entry.completedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1b382b] uppercase">{entry.style || 'Exploration'}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#121312] uppercase">
                      {entry.questTitle}
                    </h4>
                    <p className="text-xs text-[#525a54] italic">
                      &ldquo;{entry.reflectionAnswer}&rdquo;
                    </p>
                  </div>

                  <div className="text-xs font-mono font-bold px-3 py-1 bg-white border border-[#121312] self-start sm:self-center shrink-0">
                    {entry.durationMinutes} mins
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
