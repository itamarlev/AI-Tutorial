'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Zap, BookOpen, Gamepad2, Trophy, ArrowRight, Code, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/stores/useUserStore';

export default function LandingPage() {
  const { isOnboarded } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-claude/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap size={40} className="text-claude-light" />
              <h1 className="text-4xl md:text-6xl font-bold">AI Tutorial</h1>
            </div>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-8">
              Master AI developer tools through interactive, gamified lessons. Learn Claude, Cursor, and Codex by doing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isOnboarded ? '/dashboard' : '/onboarding'}>
                <Button size="lg" className="gap-2">
                  {isOnboarded ? 'Continue Learning' : 'Get Started'}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              {!isOnboarded && (
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg">
                    Skip to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'Interactive Lessons',
              description: '36+ lessons across Claude, Cursor, and Codex with hands-on exercises.',
              color: 'text-claude-light',
            },
            {
              icon: Gamepad2,
              title: 'Gamified Learning',
              description: 'Earn XP, level up, unlock badges, maintain streaks, and complete timed challenges.',
              color: 'text-xp',
            },
            {
              icon: Trophy,
              title: '30+ Achievements',
              description: 'Collect badges from Common to Legendary across 5 categories.',
              color: 'text-legendary',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <feature.icon size={32} className={feature.color + ' mb-4'} />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tools Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Learn Three Powerful AI Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Claude', icon: Brain, color: 'from-claude/20 to-claude/5', border: 'border-claude/30', text: 'text-claude-light', desc: 'CLI, API, prompt engineering' },
              { name: 'Cursor', icon: Code, color: 'from-cursor/20 to-cursor/5', border: 'border-cursor/30', text: 'text-cursor-light', desc: 'AI-powered code editing' },
              { name: 'Codex', icon: Sparkles, color: 'from-codex/20 to-codex/5', border: 'border-codex/30', text: 'text-codex-light', desc: 'Code generation & integration' },
            ].map((tool) => (
              <div
                key={tool.name}
                className={`bg-gradient-to-b ${tool.color} border ${tool.border} rounded-xl p-6`}
              >
                <tool.icon size={28} className={tool.text + ' mb-3'} />
                <h3 className={`text-lg font-bold ${tool.text}`}>{tool.name}</h3>
                <p className="text-sm text-muted mt-1">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
