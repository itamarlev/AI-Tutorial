'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useStreakStore } from '@/stores/useStreakStore';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { BadgeUnlockModal } from '@/components/gamification/BadgeUnlockModal';
import { useBadgeStore, getBadgeById } from '@/stores/useBadgeStore';

// Pages that should NOT have the app shell (sidebar, topbar, mobile nav)
const fullScreenPages = ['/', '/onboarding'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = fullScreenPages.includes(pathname);
  const { checkStreak } = useStreakStore();
  const { popNewBadge } = useBadgeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(null);

  // Check streak on mount
  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  // Check for new badges periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const badgeId = popNewBadge();
      if (badgeId) {
        setActiveBadgeId(badgeId);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [popNewBadge]);

  if (isFullScreen) {
    return <>{children}</>;
  }

  const activeBadge = activeBadgeId ? getBadgeById(activeBadgeId) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />

      {/* Global modals */}
      <LevelUpModal
        isOpen={levelUpTo !== null}
        onClose={() => setLevelUpTo(null)}
        level={levelUpTo ?? 0}
      />
      <BadgeUnlockModal
        isOpen={activeBadge !== null}
        onClose={() => setActiveBadgeId(null)}
        badge={activeBadge ?? null}
      />
    </div>
  );
}
