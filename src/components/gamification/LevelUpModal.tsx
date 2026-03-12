'use client';

import { Modal } from '@/components/ui/Modal';
import { ConfettiExplosion } from '@/components/ui/ConfettiExplosion';
import { getLevelTitle } from '@/lib/gamification';
import { Star } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
}

export function LevelUpModal({ isOpen, onClose, level }: LevelUpModalProps) {
  const title = getLevelTitle(level);

  return (
    <>
      <ConfettiExplosion trigger={isOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-claude/20 flex items-center justify-center animate-pulse-glow text-claude">
            <Star size={40} className="text-claude-light" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Level Up!</h2>
          <div className="text-4xl font-bold text-claude-light mb-2">Level {level}</div>
          <div className="text-muted mb-6">{title}</div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-claude hover:bg-claude-light text-white rounded-lg transition-colors"
          >
            Awesome!
          </button>
        </div>
      </Modal>
    </>
  );
}
