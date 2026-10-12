'use client';

import React from 'react';
import { Quest } from '@/types/quest';
import { X, Play, Compass, ShieldAlert, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuestDetailModalProps {
  quest: Quest | null;
  onClose: () => void;
  onStartQuest: (quest: Quest) => void;
}

export default function QuestDetailModal({ quest, onClose, onStartQuest }: QuestDetailModalProps) {
  if (!quest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121312]/70 backdrop-blur-xs">
      <div className="bg-[#ffffff] neo-border neo-shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-[#1b382b] text-[#fbf9f4] border-b-2 border-[#121312] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase bg-[#f4c430] text-[#121312] px-2 py-0.5 font-bold border border-[#121312]">
              {quest.isDemo ? 'Demo Mission' : 'Gemma AI Generated'}
            </span>
            <span className="font-mono text-xs text-[#e8f0eb]">{quest.duration} min outing</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2d5a45] text-white border border-white/40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-[#121312] leading-tight">
              {quest.title}
            </h2>
            <p className="mt-2 text-sm text-[#525a54] italic">
              &ldquo;{quest.premise}&rdquo;
            </p>
          </div>

          {/* Primary Task */}
          <div className="p-4 bg-[#e8f0eb] border-2 border-[#121312]">
            <h4 className="text-xs font-mono font-bold uppercase text-[#1b382b] mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Primary Mission Directive
            </h4>
            <p className="text-sm font-semibold text-[#121312] leading-relaxed">
              {quest.task}
            </p>
          </div>

          {/* Hint */}
          <div className="p-4 bg-[#fef9e7] border-2 border-[#121312]">
            <h4 className="text-xs font-mono font-bold uppercase text-[#121312] mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#c85a32]" />
              Field Scout Hint
            </h4>
            <p className="text-sm text-[#121312] leading-relaxed">
              {quest.hint}
            </p>
          </div>

          {/* Completion Criteria */}
          <div className="p-4 bg-[#ffffff] border-2 border-[#121312]">
            <h4 className="text-xs font-mono font-bold uppercase text-[#121312] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1b382b]" />
              Completion Criteria
            </h4>
            <p className="text-sm text-[#525a54] leading-relaxed">
              {quest.completionCriteria}
            </p>
          </div>

          {/* Reflection Preview */}
          <div className="p-4 bg-[#f5ede4] border-2 border-[#121312]">
            <h4 className="text-xs font-mono font-bold uppercase text-[#c85a32] mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Post-Outing Reflection
            </h4>
            <p className="text-sm font-medium text-[#121312] italic">
              &ldquo;{quest.reflectionQuestion}&rdquo;
            </p>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-[#fbf9f4] border border-[#121312] flex items-start gap-2.5 text-xs text-[#525a54]">
            <ShieldAlert className="w-4 h-4 text-[#c85a32] shrink-0 mt-0.5" />
            <p>
              Stay on public walkways. Respect private property. Zero money required. Put your screen away once you start walking!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#fbf9f4] border-t-2 border-[#121312] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white text-[#121312] neo-border-sm hover:bg-[#e8f0eb] font-bold text-xs uppercase"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onStartQuest(quest);
            }}
            className="flex-1 py-3 px-4 bg-[#1b382b] text-[#fbf9f4] neo-border-sm hover:bg-[#2d5a45] font-black text-xs uppercase flex items-center justify-center gap-2 neo-shadow-sm"
          >
            <Play className="w-4 h-4 fill-current text-[#f4c430]" />
            <span>Embark Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
