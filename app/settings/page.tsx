'use client';

import React, { useState, useEffect } from 'react';
import { OllamaStatus } from '@/types/quest';
import { exportLocalDataAsJSON, clearAllLocalData } from '@/lib/storage/indexed-db';
import {
  Shield,
  Download,
  Trash2,
  Cpu,
  RefreshCw,
  CheckCircle,
  XCircle,
  Code,
  HardDrive,
} from 'lucide-react';

export default function SettingsPage() {
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/ollama/status');
      const data = await res.json();
      setOllamaStatus(data);
    } catch {
      setOllamaStatus({
        connected: false,
        model: 'unknown',
        error: 'Failed to query Ollama API status',
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch('/api/ollama/status');
        const data = await res.json();
        if (!ignore) {
          setOllamaStatus(data);
        }
      } catch {
        if (!ignore) {
          setOllamaStatus({
            connected: false,
            model: 'unknown',
            error: 'Failed to query Ollama API status',
          });
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleExportJSON = async () => {
    try {
      const jsonData = await exportLocalDataAsJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paraquest-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportNotice('Export complete! JSON file downloaded.');
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      setExportNotice('Export failed. Check storage permissions.');
    }
  };

  const handleClearAll = async () => {
    if (
      confirm(
        'Are you sure you want to delete ALL journal entries and saved quests? This cannot be undone.'
      )
    ) {
      await clearAllLocalData();
      setDeleteNotice('All local storage has been wiped clean.');
      setTimeout(() => setDeleteNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#121312] pb-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#121312] tracking-tight">
          System Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#525a54] mt-1">
          Local AI inference diagnostics, data persistence, and privacy controls.
        </p>
      </div>

      {/* 1. Local AI / Ollama Status */}
      <section className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#121312] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#1b382b]" />
            <h2 className="text-lg font-black uppercase text-[#121312]">
              Local AI Engine (Ollama)
            </h2>
          </div>
          <button
            onClick={fetchStatus}
            disabled={isChecking}
            className="px-3 py-1.5 bg-[#fbf9f4] hover:bg-[#e8f0eb] border border-[#121312] text-xs font-mono font-bold uppercase flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fbf9f4] border-2 border-[#121312]">
              <span className="text-xs font-mono text-[#525a54] uppercase block">
                Connection Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                {ollamaStatus?.connected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#1b382b]" />
                    <span className="font-bold text-[#1b382b] uppercase">Connected (Online)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#c85a32]" />
                    <span className="font-bold text-[#c85a32] uppercase">
                      Offline / Unreachable
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f4] border-2 border-[#121312]">
              <span className="text-xs font-mono text-[#525a54] uppercase block">
                Target AI Model
              </span>
              <div className="font-mono font-bold text-[#121312] text-base mt-1">
                {ollamaStatus?.model || 'gemma:2b'}
              </div>
            </div>
          </div>

          {ollamaStatus?.error && (
            <div className="p-3 bg-[#fef9e7] border border-[#c85a32] text-xs font-mono text-[#c85a32]">
              Diagnostics: {ollamaStatus.error}
            </div>
          )}

          {ollamaStatus?.availableModels && ollamaStatus.availableModels.length > 0 && (
            <div className="p-4 bg-[#e8f0eb] border border-[#121312] text-xs font-mono">
              <span className="font-bold text-[#1b382b] block mb-1">
                Detected Installed Models on Local Ollama:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ollamaStatus.availableModels.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-white border border-[#121312] text-[#121312] font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Setup Guide */}
          <div className="p-4 bg-[#fbf9f4] border-2 border-[#121312] space-y-2">
            <h4 className="text-xs font-black uppercase text-[#121312] flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#1b382b]" />
              How To Run Ollama Locally With Gemma
            </h4>
            <ol className="list-decimal list-inside text-xs font-mono text-[#525a54] space-y-1">
              <li>
                Install Ollama from{' '}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-[#1b382b]"
                >
                  ollama.com
                </a>
              </li>
              <li>
                Run in terminal: <code className="bg-white px-1 border border-[#121312]">ollama pull gemma:2b</code>
              </li>
              <li>
                Start server: <code className="bg-white px-1 border border-[#121312]">ollama serve</code>
              </li>
              <li>Verify that it listens on default port <code className="bg-white px-1 border border-[#121312]">11434</code>.</li>
            </ol>
            <p className="text-[11px] text-[#525a54] italic pt-1">
              * Note: If Ollama is not running, ParaQuest will automatically run in Demo Mode using curated, verified quests!
            </p>
          </div>
        </div>
      </section>

      {/* 2. Privacy Policy */}
      <section className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-[#121312] pb-3">
          <Shield className="w-5 h-5 text-[#1b382b]" />
          <h2 className="text-lg font-black uppercase text-[#121312]">
            Data Sovereignty & Privacy
          </h2>
        </div>
        <p className="text-sm text-[#525a54] leading-relaxed">
          ParaQuest was engineered around physical reality rather than surveillance capitalism.
          Your field reflections, photos, and saved quests are persisted purely within your
          browser&apos;s <strong>IndexedDB</strong>.
        </p>
        <ul className="text-xs font-mono text-[#525a54] space-y-1.5 list-disc list-inside">
          <li>Zero GPS tracking: we do not access or record your location coordinates.</li>
          <li>Zero remote cloud storage: photos are stored as local base64 records.</li>
          <li>
            Zero training leak: Journal entries are NEVER dispatched to any AI model.
          </li>
        </ul>
      </section>

      {/* 3. Export & Delete Data */}
      <section className="bg-white neo-border neo-shadow p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-[#121312] pb-3">
          <HardDrive className="w-5 h-5 text-[#1b382b]" />
          <h2 className="text-lg font-black uppercase text-[#121312]">
            Data Management
          </h2>
        </div>

        {exportNotice && (
          <div className="p-3 bg-[#e8f0eb] border border-[#1b382b] text-xs font-mono font-bold text-[#1b382b]">
            {exportNotice}
          </div>
        )}

        {deleteNotice && (
          <div className="p-3 bg-[#fef9e7] border border-[#c85a32] text-xs font-mono font-bold text-[#c85a32]">
            {deleteNotice}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportJSON}
            className="flex-1 py-3 px-4 bg-white hover:bg-[#e8f0eb] border-2 border-[#121312] text-xs font-black uppercase flex items-center justify-center gap-2 neo-shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-[#1b382b]" />
            <span>Export Journal Backup (JSON)</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex-1 py-3 px-4 bg-white hover:bg-[#fef9e7] border-2 border-[#c85a32] text-[#c85a32] text-xs font-black uppercase flex items-center justify-center gap-2 neo-shadow-sm transition-all"
          >
            <Trash2 className="w-4 h-4 text-[#c85a32]" />
            <span>Erase All Local Data</span>
          </button>
        </div>
      </section>
    </div>
  );
}
