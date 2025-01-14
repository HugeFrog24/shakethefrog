'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

interface Heart {
  id: number;
  angle: number;
  speed: number;
  startPosition: { x: number; y: number };
  scale: number;
}

interface FloatingHeartsProps {
  intensity: number;
}

export function FloatingHearts({ intensity }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (intensity <= 0) return;

    // Number of hearts based on intensity
    const numHearts = Math.min(Math.floor(intensity * 2), 50);

    // Create waves of hearts
    const waves = 4; // Number of waves
    const heartsPerWave = Math.ceil(numHearts / waves);
    const waveDelay = 200; // Delay between waves in ms
    const timers: NodeJS.Timeout[] = [];

    // Generate hearts in waves
    for (let wave = 0; wave < waves; wave++) {
      const timer = setTimeout(() => {
        const newHearts = Array.from({ length: heartsPerWave }, (_, i) => {
          const totalIndex = wave * heartsPerWave + i;
          return {
            id: Date.now() + totalIndex,
            // Distribute angles evenly within each wave
            angle: Math.random() * 360, // Random angle for full radial distribution
            speed: 0.8 + Math.random() * 0.4,
            startPosition: {
              x: Math.random() * 40 - 20,
              y: Math.random() * 40 - 20,
            },
            scale: 0.8 + Math.random() * 0.4,
          };
        });

        setHearts(prev => [...prev, ...newHearts]);
      }, wave * waveDelay);

      timers.push(timer);
    }

    // Remove hearts after animation completes
    const cleanupTimer = setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id > Date.now() - 3500));
    }, waves * waveDelay + 3500);

    timers.push(cleanupTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [intensity]);

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      {hearts.map((heart) => {
        const style = {
          '--angle': `${heart.angle}deg`,
          '--speed': `${heart.speed}`,
          '--start-x': `${heart.startPosition.x}px`,
          '--start-y': `${heart.startPosition.y}px`,
          '--scale': heart.scale,
        } as React.CSSProperties;

        return (
          <div
            key={heart.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-heart"
            style={style}
          >
            <HeartIcon 
              className="w-16 h-16 text-pink-500 opacity-80 animate-fade-out" 
              style={{ transform: `scale(var(--scale))` }}
            />
          </div>
        );
      })}
    </div>
  );
}
