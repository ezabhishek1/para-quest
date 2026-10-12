'use client';

import React from 'react';
import { Quest, QuestStyle } from '@/types/quest';
import { Clock, Compass, Eye, Sparkles, Bookmark, Play } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  isSaved?: boolean;
  onStartQuest: (quest: Quest) => void;
  onToggleSave: (quest: Quest) => void;
  onViewDetails?: (quest: Quest) => void;
}

export default function QuestCard({
  quest,
  isSaved = false,
  onStartQuest,
  onToggleSave,
  onViewDetails,
}: QuestCardProps) {
  const getStyleTheme = (style?: QuestStyle) => {
    switch (style) {
      case 'nature':
        return {
          bg: 'bg-[#e8f0eb]',
          badge: 'bg-[#1b382b] text-[#fbf9f4]',
          accent: 'border-[#1b382b]',
          label: 'Botanical / Nature',
        };
      case 'architecture':
        return {
          bg: 'bg-[#f5ede4]',
          badge: 'bg-[#c85a32] text-[#fbf9f4]',
          accent: 'border-[#c85a32]',
          label: 'Architecture / Built',
        };
      case 'observation':
        return {
          bg: 'bg-[#fef9e7]',
          badge: 'bg-[#f4c430] text-[#121312]',
          accent: 'border-[#121312]',
          label: 'Deep Observation',
        };
      default:
        return {
          bg: 'bg-[#eef2f6]',
          badge: 'bg-[#121312] text-[#fbf9f4]',
          accent: 'border-[#121312]',
          label: 'Surprise Exploration',
        };
    }
  };

  const theme = getStyleTheme(quest.style);

  return (
    <div className="bg-[#ffffff] neo-border neo-shadow flex flex-col justify-between transition-transform hover:-translate-y-1 relative overflow-hidden group">
      {/* Top Banner Stripe */}
      <div className={`p-4 border-b-2 border-[#121312] ${theme.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 text-[11px] font-mono font-bold uppercase border border-[#121312] ${theme.badge}`}>
            {theme.label}
          </span>
          {quest.isDemo && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase bg-[#f4c430] text-[#121312] border border-[#121312]">
              Demo Quest
            </span>
          )}
          {!quest.isDemo && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase bg-[#1b382b] text-[#fbf9f4] border border-[#121312] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f4c430]" /> Gemma AI
            </span>
          )}
        </div>

        {/* Save Bookmark button */}
        <button
          onClick={() => onToggleSave(quest)}
          className={`p-1.5 border border-[#121312] text-xs font-bold transition-colors ${
            isSaved ? 'bg-[#f4c430] text-[#121312]' : 'bg-white hover:bg-[#e8f0eb] text-[#121312]'
          }`}
          title={isSaved ? 'Remove from saved quests' : 'Save quest for later'}
          aria-label={isSaved ? 'Remove saved quest' : 'Save quest'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-[#121312] uppercase tracking-tight leading-snug mb-3">
          {quest.title}
        </h3>

        {/* Premise */}
        <p className="text-sm font-medium text-[#525a54] mb-4 italic leading-relaxed">
          &ldquo;{quest.premise}&rdquo;
        </p>

        {/* Task Box */}
        <div className="bg-[#fbf9f4] p-4 border-2 border-[#121312] mb-4">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#1b382b] mb-1 font-mono">
            <Eye className="w-4 h-4" />
            <span>Field Objective</span>
          </div>
          <p className="text-sm font-semibold text-[#121312] leading-relaxed">
            {quest.task}
          </p>
        </div>

        {/* Meta badges: Time & Difficulty */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold uppercase mt-auto pt-2">
          <div className="flex items-center gap-1.5 bg-[#fbf9f4] px-2.5 py-1.5 border border-[#121312]">
            <Clock className="w-3.5 h-3.5 text-[#1b382b]" />
            <span>{quest.duration} Mins</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#fbf9f4] px-2.5 py-1.5 border border-[#121312]">
            <Compass className="w-3.5 h-3.5 text-[#c85a32]" />
            <span className="capitalize">{quest.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-[#fbf9f4] border-t-2 border-[#121312] flex items-center gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(quest)}
            className="flex-1 py-2.5 px-3 bg-white text-[#121312] neo-border-sm hover:bg-[#e8f0eb] font-bold text-xs uppercase text-center transition-colors"
          >
            Details
          </button>
        )}
        <button
          onClick={() => onStartQuest(quest)}
          className="flex-1 py-2.5 px-3 bg-[#1b382b] text-[#fbf9f4] neo-border-sm hover:bg-[#2d5a45] font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors neo-shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current text-[#f4c430]" />
          <span>Start Quest</span>
        </button>
      </div>
    </div>
  );
}
