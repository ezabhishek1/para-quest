'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quest } from '@/types/quest';
import { getActiveQuest, clearActiveQuest } from '@/lib/storage/indexed-db';
import { Compass, Eye, ShieldAlert, Clock, CheckCircle2, PhoneOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FieldPage() {
  const router = useRouter();
  const [activeData, setActiveData] = useState<{ quest: Quest; startedAt: number } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getActiveQuest().then((data) => {
      if (data) {
        setActiveData(data);
        const elapsed = Math.max(0, Math.floor((Date.now() - data.startedAt) / 1000));
        setElapsedSeconds(elapsed);
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!activeData) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeData]);

  if (!isReady) {
    return (
      <div className="py-20 text-center font-mono text-sm text-[#525a54]">
        Loading field mission status...
      </div>
    );
  }

  if (!activeData) {
    return (
      <div className="bg-white neo-border neo-shadow p-8 max-w-lg mx-auto text-center space-y-4">
        <Compass className="w-12 h-12 text-[#1b382b] mx-auto" />
        <h2 className="text-2xl font-black uppercase text-[#121312]">No Active Mission</h2>
        <p className="text-sm text-[#525a54]">
          You haven&apos;t started an expedition yet. Configure your preferences and pick a quest!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-[#1b382b] text-[#fbf9f4] font-black uppercase text-xs neo-border-sm hover:bg-[#2d5a45] transition-colors"
        >
          Find A Quest
        </Link>
      </div>
    );
  }

  const { quest } = activeData;
  const targetSeconds = quest.duration * 60;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isOverTime = elapsedSeconds >= targetSeconds;

  const handleFinishOuting = () => {
    // Navigate to journal entry creation with this quest id
    router.push(`/journal/new?questId=${encodeURIComponent(quest.id)}&duration=${minutes || 1}`);
  };

  const handleAbandonQuest = async () => {
    if (confirm('Are you sure you want to cancel this quest?')) {
      await clearActiveQuest();
      router.push('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Calm Distraction-free Header */}
      <div className="flex items-center justify-between border-b-2 border-[#121312] pb-3">
        <button
          onClick={handleAbandonQuest}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#525a54] hover:text-[#121312]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Abandon Mission</span>
        </button>
        <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase bg-[#1b382b] text-[#fbf9f4] border border-[#121312]">
          Field Mode Active
        </span>
      </div>

      {/* Main Mission Board */}
      <div className="bg-white neo-border neo-shadow-lg p-6 sm:p-10 space-y-8">
        {/* Mission Title */}
        <div className="text-center space-y-2 border-b-2 border-[#121312] pb-6">
          <span className="text-xs font-mono font-bold text-[#c85a32] uppercase tracking-wider">
            Current Urban Assignment
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-[#121312] leading-tight">
            {quest.title}
          </h1>
          <p className="text-sm font-medium text-[#525a54] italic max-w-lg mx-auto">
            &ldquo;{quest.premise}&rdquo;
          </p>
        </div>

        {/* The One Clear Instruction */}
        <div className="p-6 bg-[#e8f0eb] border-2 border-[#121312] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#1b382b]">
            <Eye className="w-4 h-4" />
            <span>Sole Directive</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-[#121312] leading-snug">
            {quest.task}
          </p>
          <div className="pt-2 text-xs text-[#525a54] border-t border-[#1b382b]/30">
            <span className="font-bold text-[#1b382b]">Field Scout Hint: </span>
            {quest.hint}
          </div>
        </div>

        {/* Lock Phone Reminder */}
        <div className="p-4 bg-[#fef9e7] border-2 border-[#121312] flex items-center gap-4">
          <div className="w-10 h-10 bg-[#f4c430] border border-[#121312] flex items-center justify-center shrink-0">
            <PhoneOff className="w-5 h-5 text-[#121312]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-[#121312]">
              Pocket Your Phone Now
            </h4>
            <p className="text-xs text-[#525a54] mt-0.5">
              This app works in the background. Lock your phone, breathe in the air, and explore your surroundings. You can return whenever ready.
            </p>
          </div>
        </div>

        {/* Elapsed Timer Display */}
        <div className="p-6 bg-[#fbf9f4] border-2 border-[#121312] text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase font-bold text-[#525a54]">
            <Clock className="w-4 h-4 text-[#1b382b]" />
            <span>Elapsed Outing Time</span>
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-black text-[#121312] tracking-wider">
            {formattedTime}
          </div>
          <p className="text-xs font-mono text-[#525a54]">
            Target exploration: {quest.duration} minutes{' '}
            {isOverTime && <span className="font-bold text-[#1b382b]">(Goal Reached!)</span>}
          </p>
        </div>

        {/* Safety Reminder */}
        <div className="flex items-center gap-2.5 text-xs text-[#525a54] px-2">
          <ShieldAlert className="w-4 h-4 text-[#c85a32] shrink-0" />
          <span>
            Safety reminder: Stay in pedestrian areas. Never trespass on private grounds.
          </span>
        </div>

        {/* Complete Action Button */}
        <div className="pt-2">
          <button
            onClick={handleFinishOuting}
            className="w-full py-4 px-6 bg-[#1b382b] text-[#fbf9f4] neo-border neo-shadow hover:bg-[#2d5a45] text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-[#f4c430]" />
            <span>Finish Outing & Log Discoveries</span>
          </button>
        </div>
      </div>
    </div>
  );
}
