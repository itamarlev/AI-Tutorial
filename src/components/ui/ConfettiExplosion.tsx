'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiExplosionProps {
  trigger: boolean;
}

export function ConfettiExplosion({ trigger }: ConfettiExplosionProps) {
  useEffect(() => {
    if (trigger) {
      const end = Date.now() + 1000;
      const colors = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [trigger]);

  return null;
}
