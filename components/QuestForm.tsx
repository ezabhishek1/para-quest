'use client';

import React, { useState } from 'react';
import { QuestPreferences, QuestDuration, Environment, QuestStyle, Difficulty } from '@/types/quest';
import { Compass, Sliders, RefreshCw } from 'lucide-react';

interface QuestFormProps {
  onGenerate: (prefs: QuestPreferences) => void;
  isLoading: boolean;
  hasOllama: boolean | null;
}

export default function QuestForm({ onGenerate, isLoading, hasOllama }: QuestFormProps) {
  const [duration, setDuration] = useState<QuestDuration>(20);
  const [environment, setEnvironment] = useState<Environment>('neighbourhood');
  const [style, setStyle] = useState<QuestStyle>('nature');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [forceDemo, setForceDemo] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      duration,
      environment,
      style,
      difficulty,
      forceDemo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[#121312] gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#1b382b]" />
          <h2 className="text-lg font-black uppercase text-[#121312] tracking-tight">
            Configure Your Expedition
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasOllama === true ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-[#e8f0eb] text-[#1b382b] border border-[#1b382b]">
              <span className="w-2 h-2 rounded-full bg-[#1b382b] animate-pulse"></span>
              Ollama Gemma Ready
            </span>
          ) : hasOllama === false ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-[#fef9e7] text-[#c85a32] border border-[#c85a32]">
              Demo Mode Active
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Available Time */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312]">
            1. Available Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setDuration(mins as QuestDuration)}
                className={`py-2.5 px-2 text-center text-xs font-mono font-bold uppercase border-2 border-[#121312] transition-all ${
                  duration === mins
                    ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                    : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* 2. Environment */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312]">
            2. Environment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'campus', label: 'Campus' },
              { id: 'neighbourhood', label: 'Hood' },
              { id: 'park', label: 'Park' },
              { id: 'anywhere', label: 'Anywhere' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setEnvironment(item.id as Environment)}
                className={`py-2.5 px-2 text-center text-xs font-bold uppercase border-2 border-[#121312] transition-all ${
                  environment === item.id
                    ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                    : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Quest Style */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312]">
            3. Quest Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'nature', label: 'Nature / Botany' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'observation', label: 'Deep Observation' },
              { id: 'surprise', label: 'Surprise / Drift' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setStyle(item.id as QuestStyle)}
                className={`py-2.5 px-2 text-center text-xs font-bold uppercase border-2 border-[#121312] transition-all ${
                  style === item.id
                    ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                    : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Difficulty */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase text-[#121312]">
            4. Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'easy', label: 'Easy (Gentle)' },
              { id: 'adventurous', label: 'Adventurous' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setDifficulty(item.id as Difficulty)}
                className={`py-2.5 px-2 text-center text-xs font-bold uppercase border-2 border-[#121312] transition-all ${
                  difficulty === item.id
                    ? 'bg-[#1b382b] text-[#fbf9f4] neo-shadow-sm'
                    : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Mode Option */}
      <div className="p-3 bg-[#fbf9f4] border-2 border-[#121312] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="forceDemo"
            checked={forceDemo}
            onChange={(e) => setForceDemo(e.target.checked)}
            className="w-4 h-4 border-2 border-[#121312] accent-[#1b382b] rounded-none cursor-pointer"
          />
          <label htmlFor="forceDemo" className="font-semibold text-[#121312] cursor-pointer">
            Use Curated Demo Quests (Faster, bypass local AI inference)
          </label>
        </div>
        <span className="font-mono text-[#525a54] text-[11px]">
          {forceDemo ? 'Mode: Curated Demo' : 'Mode: Local Ollama / Auto-fallback'}
        </span>
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-[#1b382b] text-[#fbf9f4] neo-border neo-shadow hover:bg-[#2d5a45] text-base font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-[#f4c430]" />
              <span>Forging Your 3 Urban Quests...</span>
            </>
          ) : (
            <>
              <Compass className="w-5 h-5 text-[#f4c430]" />
              <span>Find My Quests</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
