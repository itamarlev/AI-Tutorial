'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Trophy,
  Medal,
  FlaskConical,
  Settings,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/playground', label: 'Playground', icon: FlaskConical },
  { href: '/challenges', label: 'Challenges', icon: Gamepad2 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Zap size={24} className="text-claude-light" />
        <span className="text-lg font-bold">AI Tutorial</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-claude/10 text-claude-light font-medium'
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted">AI Tutorial v1.0</p>
      </div>
    </aside>
  );
}
