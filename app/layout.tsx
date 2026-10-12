import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ParaQuest — The City Is Your Playground',
  description:
    'Short, inspiring, AI-generated urban exploration quests helping you reconnect with the real world. DEV.to Touch Grass Challenge 2026.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#121312] selection:bg-[#f4c430] selection:text-[#121312]">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t-[2.5px] border-[#121312] bg-[#fbf9f4] py-8 text-center text-xs font-mono text-[#525a54]">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-bold text-[#121312]">ParaQuest // Urban Observation Protocol</p>
              <p>Designed for DEV.to Hacktoberfest “Touch Grass” Challenge 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e8f0eb] border border-[#121312] font-semibold text-[#1b382b]">
                100% Client-Side Privacy
              </span>
              <span className="font-semibold text-[#121312]">No GPS Tracking Required</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
