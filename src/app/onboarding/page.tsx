'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/lib/utils';
import { DAILY_GOALS } from '@/lib/gamification';
import { Zap, User, Target, ArrowRight } from 'lucide-react';

const AVATARS = ['🧑‍💻', '👩‍💻', '🧙‍♂️', '🦊', '🐱', '🤖', '👾', '🦉'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('🧑‍💻');
  const [dailyGoal, setDailyGoal] = useState(100);
  const { setProfile } = useUserStore();
  const router = useRouter();

  const handleComplete = () => {
    setProfile({
      id: generateId(),
      username: username || 'Developer',
      avatar,
      createdAt: new Date().toISOString(),
      dailyGoal,
      settings: {
        soundEnabled: false,
        animationsEnabled: true,
        dailyGoal,
      },
    });
    router.push('/dashboard');
  };

  const steps = [
    // Step 0: Welcome
    <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
      <Zap size={64} className="text-claude-light mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">Welcome to AI Tutorial</h1>
      <p className="text-muted mb-8 max-w-md mx-auto">Learn to use AI developer tools through interactive, gamified lessons. Let&apos;s set up your profile!</p>
      <Button onClick={() => setStep(1)} size="lg" className="gap-2">
        Let&apos;s Go <ArrowRight size={18} />
      </Button>
    </motion.div>,
    // Step 1: Username & Avatar
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center max-w-md mx-auto">
      <User size={40} className="text-claude-light mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-6">Choose Your Identity</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground mb-6 focus:outline-none focus:border-claude"
        maxLength={20}
      />
      <p className="text-sm text-muted mb-3">Pick an avatar</p>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => setAvatar(a)}
            className={`text-3xl p-2 rounded-lg transition-all ${avatar === a ? 'bg-claude/20 ring-2 ring-claude scale-110' : 'hover:bg-surface-hover'}`}
          >
            {a}
          </button>
        ))}
      </div>
      <Button onClick={() => setStep(2)} size="lg" className="gap-2">
        Next <ArrowRight size={18} />
      </Button>
    </motion.div>,
    // Step 2: Daily Goal
    <motion.div key="goal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center max-w-md mx-auto">
      <Target size={40} className="text-xp mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Set Your Daily Goal</h2>
      <p className="text-muted mb-6">How much XP do you want to earn each day?</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {DAILY_GOALS.map((goal) => (
          <button
            key={goal}
            onClick={() => setDailyGoal(goal)}
            className={`p-4 rounded-xl border transition-all ${
              dailyGoal === goal
                ? 'bg-xp/10 border-xp text-xp font-bold'
                : 'bg-surface border-border hover:border-muted text-muted'
            }`}
          >
            <div className="text-2xl font-bold">{goal}</div>
            <div className="text-xs mt-1">XP / day</div>
          </button>
        ))}
      </div>
      <Button onClick={handleComplete} size="lg" className="gap-2">
        Start Learning <ArrowRight size={18} />
      </Button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= step ? 'bg-claude' : 'bg-border'}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
      </div>
    </div>
  );
}
