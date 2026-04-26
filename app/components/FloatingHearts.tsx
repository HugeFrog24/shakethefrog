'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { shakeConfig } from '../config/shake';

interface Heart {
  id: number;
  angle: number;
  speed: number;
  startPosition: { x: number; y: number };
  scale: number;
  createdAt: number;
}

interface FloatingHeartsProps {
  intensity: number;
}

export function FloatingHearts({ intensity }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Cleanup interval to remove old hearts
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setHearts(prev => prev.filter(heart => 
        now - heart.createdAt < shakeConfig.animations.heartFloat
      ));
    }, shakeConfig.hearts.cleanupInterval);

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    if (intensity <= 0) return;

    // Number of hearts based on intensity
    const numHearts = Math.min(Math.floor(intensity * 2), shakeConfig.hearts.maxPerShake);

    // Create waves of hearts
    const heartsPerWave = Math.ceil(numHearts / shakeConfig.hearts.waves);
    const timers: NodeJS.Timeout[] = [];

    // Generate hearts in waves
    for (let wave = 0; wave < shakeConfig.hearts.waves; wave++) {
      const timer = setTimeout(() => {
        const now = Date.now();
        const newHearts = Array.from({ length: heartsPerWave }, (_, i) => ({
          id: now + i,
          angle: Math.random() * 360,
          speed: shakeConfig.hearts.minSpeed + 
                Math.random() * (shakeConfig.hearts.maxSpeed - shakeConfig.hearts.minSpeed),
          startPosition: {
            x: Math.random() * (shakeConfig.hearts.spreadX * 2) - shakeConfig.hearts.spreadX,
            y: Math.random() * (shakeConfig.hearts.spreadY * 2) - shakeConfig.hearts.spreadY,
          },
          scale: shakeConfig.hearts.minScale + 
                Math.random() * (shakeConfig.hearts.maxScale - shakeConfig.hearts.minScale),
          createdAt: now,
        }));

        setHearts(prev => [...prev, ...newHearts]);

        // Remove this wave's hearts after animation
        const cleanupTimer = setTimeout(() => {
          setHearts(prev => prev.filter(heart => heart.createdAt !== now));
        }, shakeConfig.animations.heartFloat);

        timers.push(cleanupTimer);
      }, wave * shakeConfig.hearts.waveDelay);

      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [intensity]);

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
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
            onAnimationEnd={() => {
              setHearts(prev => prev.filter(h => h.id !== heart.id));
            }}
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
