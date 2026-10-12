'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, BarChart3, Settings, Footprints } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Quests', icon: Compass },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f4] border-b-[2.5px] border-[#121312]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#1b382b] text-[#f4c430] neo-border flex items-center justify-center neo-shadow-sm group-hover:rotate-3 transition-transform">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#121312] uppercase flex items-center gap-1">
              ParaQuest
              <span className="text-[10px] bg-[#f4c430] text-[#121312] px-1.5 py-0.5 border border-[#121312] font-mono font-bold rounded-xs">
                FIELD v1
              </span>
            </span>
            <p className="text-[11px] font-mono text-[#525a54] hidden sm:block">
              Touch Grass Urban Exploration
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold uppercase transition-all rounded-none ${
                  isActive
                    ? 'bg-[#1b382b] text-[#fbf9f4] border-2 border-[#121312] neo-shadow-sm'
                    : 'text-[#121312] hover:bg-[#e8f0eb] border-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
