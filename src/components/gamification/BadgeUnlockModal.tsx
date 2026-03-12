'use client';

import { Modal } from '@/components/ui/Modal';
import { ConfettiExplosion } from '@/components/ui/ConfettiExplosion';
import { Badge } from '@/types';
import { getRarityColor } from '@/lib/utils';

interface BadgeUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

export function BadgeUnlockModal({ isOpen, onClose, badge }: BadgeUnlockModalProps) {
  if (!badge) return null;

  return (
    <>
      <ConfettiExplosion trigger={isOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-center py-4">
          <div className="text-6xl mb-4">{badge.icon}</div>
          <div className={`text-xs uppercase font-bold mb-2 ${getRarityColor(badge.rarity)}`}>
            {badge.rarity} Badge Unlocked!
          </div>
          <h2 className="text-2xl font-bold mb-1">{badge.name}</h2>
          <p className="text-muted mb-6">{badge.description}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-claude hover:bg-claude-light text-white rounded-lg transition-colors"
          >
            Collect Badge
          </button>
        </div>
      </Modal>
    </>
  );
}
