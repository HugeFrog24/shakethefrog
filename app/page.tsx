'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import Image from 'next/image';
import { FloatingHearts } from './components/FloatingHearts';
import { ThemeToggle } from './components/ThemeToggle';
import { SpeechBubble } from './components/SpeechBubble';
import { shakeConfig } from './config/shake';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { appConfig } from './config/app';

export default function Home() {
  const [isShaken, setIsShaken] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [motionPermission, setMotionPermission] = useState<PermissionState>('prompt');
  const isMobile = useIsMobile();
  const [, setIsAnimating] = useState(false);
  const [, setShakeQueue] = useState<number[]>([]);
  const isAnimatingRef = useRef<boolean>(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const animationStartTimeRef = useRef<number>(0);

  // Check if device motion is available and handle permissions
  const requestMotionPermission = async () => {
    if (typeof window === 'undefined') return;

    // Check if device motion is available
    if (!('DeviceMotionEvent' in window)) {
      setMotionPermission('denied');
      return;
    }

    // Request permission on iOS devices
    if ('requestPermission' in DeviceMotionEvent) {
      try {
        // @ts-expect-error - TypeScript doesn't know about requestPermission
        const permission = await DeviceMotionEvent.requestPermission();
        setMotionPermission(permission);
      } catch (err) {
        console.error('Error requesting motion permission:', err);
        setMotionPermission('denied');
      }
    } else {
      // Android or desktop - no permission needed
      setMotionPermission('granted');
    }
  };

  const triggerShake = useCallback((intensity: number) => {
    // Use ref instead of state to prevent race conditions
    if (!isAnimatingRef.current) {
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Start shake animation
      isAnimatingRef.current = true;
      animationStartTimeRef.current = Date.now(); // Track when animation starts
      setIsAnimating(true);
      setIsShaken(true);
      setShakeIntensity(intensity);
      setShakeCount(count => count + 1);
      
      // Reset shake after configured duration
      animationTimeoutRef.current = setTimeout(() => {
        setIsShaken(false);
        setShakeIntensity(0);
        setIsAnimating(false);
        isAnimatingRef.current = false;
        
        // Process next shake in queue if any
        setShakeQueue(prev => {
          if (prev.length > 0) {
            const [nextIntensity, ...rest] = prev;
            // Small delay before triggering next shake to ensure clean transition
            setTimeout(() => {
              triggerShake(nextIntensity);
            }, 16);
            return rest;
          }
          return prev;
        });
      }, shakeConfig.animations.shakeReset);
    } else {
      // Only queue if we're not at the start of the animation
      const timeSinceStart = Date.now() - animationStartTimeRef.current;
      if (timeSinceStart > 100) { // Only queue if animation has been running for a bit
        setShakeQueue(prev => {
          // Hard limit at 1 item
          if (prev.length >= 1) return prev;
          return [...prev, intensity];
        });
      }
    }
  }, []); // Remove isAnimating from dependencies since we're using ref

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        triggerShake(shakeConfig.defaultTriggerIntensity);
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastUpdate;

      if (timeDiff > shakeConfig.debounceTime) {
        setLastUpdate(currentTime);

        const speed = Math.abs(acceleration.x || 0) + 
                     Math.abs(acceleration.y || 0) + 
                     Math.abs(acceleration.z || 0);

        if (speed > shakeConfig.threshold) {
          triggerShake(speed);
        }
      }
    };

    // Only add motion listener if permission is granted
    if (typeof window !== 'undefined') {
      if (motionPermission === 'granted' && 'DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleMotion);
      }
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (typeof window !== 'undefined') {
        if (motionPermission === 'granted') {
          window.removeEventListener('devicemotion', handleMotion);
        }
        window.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [lastUpdate, motionPermission, triggerShake]);

  // Initial permission check
  useEffect(() => {
    requestMotionPermission();
  }, []);

  const handleClick = () => {
    triggerShake(shakeConfig.defaultTriggerIntensity);
  };

  // Add cleanup in the component
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-between p-4 bg-green-50 dark:bg-slate-900 relative">
      <ThemeToggle />
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <FloatingHearts intensity={shakeIntensity} />
        </div>
        
        <button 
          onClick={handleClick}
          className="relative z-10"
          aria-label="Shake the frog"
        >
          <FloatingHearts intensity={shakeIntensity} />
          <SpeechBubble isShaken={isShaken} triggerCount={shakeCount} />
          <Image
            src={isShaken ? '/images/frog-shaken.svg' : '/images/frog.svg'}
            alt="Frog"
            width={200}
            height={200}
            priority
            className={isShaken ? 'animate-shake' : ''}
          />
        </button>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-[240px]">
            {motionPermission === 'prompt' ? (
              <button 
                onClick={requestMotionPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Enable device shake
              </button>
            ) : motionPermission === 'granted' ? (
              `Shake your device${!isMobile ? ', press spacebar,' : ''} or click/tap frog!`
            ) : (
              `${!isMobile ? 'Press spacebar or ' : ''}Click/tap frog!`
            )}
          </p>
        </div>
      </div>
      
      <footer className="w-full text-center text-xs text-gray-400 dark:text-gray-600 mt-auto pt-4">
        © {new Date().getFullYear()}{' '}
        <a 
          href="https://github.com/HugeFrog24/shakethefrog"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors inline-flex items-center gap-1"
        >
          {appConfig.name}
          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        </a>
      </footer>
    </main>
  );
}
