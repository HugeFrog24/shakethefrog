'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import Image from 'next/image';
import { FloatingHearts } from '../components/FloatingHearts';
import { ThemeToggle } from '../components/ThemeToggle';
import { SpeechBubble } from '../components/SpeechBubble';
import { SkinSelector } from '../components/SkinSelector';
import { shakeConfig } from '../config/shake';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { appConfig } from '../config/app';
import { useSkin } from '../hooks/useSkin';
import { LanguageToggle } from '../components/LanguageToggle';
import { useTranslations } from 'next-intl';
import { useLocalizedSkinName } from '../hooks/useLocalizedSkinName';

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
  const currentSkin = useSkin();
  const getLocalizedSkinName = useLocalizedSkinName();
  const t = useTranslations('ui');

  const requestMotionPermission = async () => {
    if (typeof window === 'undefined') return;

    if (!('DeviceMotionEvent' in window)) {
      setMotionPermission('denied');
      return;
    }

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
      setMotionPermission('granted');
    }
  };

  const triggerShake = useCallback((intensity: number) => {
    if (!isAnimatingRef.current) {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      isAnimatingRef.current = true;
      animationStartTimeRef.current = Date.now();
      setIsAnimating(true);
      setIsShaken(true);
      setShakeIntensity(intensity);
      setShakeCount(count => count + 1);
      
      animationTimeoutRef.current = setTimeout(() => {
        setIsShaken(false);
        setShakeIntensity(0);
        setIsAnimating(false);
        isAnimatingRef.current = false;
        
        setShakeQueue(prev => {
          if (prev.length > 0) {
            const [nextIntensity, ...rest] = prev;
            setTimeout(() => {
              triggerShake(nextIntensity);
            }, 16);
            return rest;
          }
          return prev;
        });
      }, shakeConfig.animations.shakeReset);
    } else {
      const timeSinceStart = Date.now() - animationStartTimeRef.current;
      if (timeSinceStart > 100) {
        setShakeQueue(prev => {
          if (prev.length >= 1) return prev;
          return [...prev, intensity];
        });
      }
    }
  }, []);

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

  useEffect(() => {
    requestMotionPermission();
  }, []);

  const handleClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short 50ms vibration
    }
    triggerShake(shakeConfig.defaultTriggerIntensity);
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col items-center justify-between p-4 bg-green-50 dark:bg-slate-900 relative">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <SkinSelector />
        </div>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <FloatingHearts intensity={shakeIntensity} />
        </div>
        
        <button 
          onClick={handleClick}
          className="relative z-10"
          aria-label={t('shakeCharacter', { item: getLocalizedSkinName(currentSkin) })}
        >
          <FloatingHearts intensity={shakeIntensity} />
          <SpeechBubble
            isShaken={isShaken}
            triggerCount={shakeCount}
          />
          <Image
            src={isShaken
              ? appConfig.skins[currentSkin].shaken
              : appConfig.skins[currentSkin].normal
            }
            alt={getLocalizedSkinName(currentSkin)}
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
                {t('enableDeviceShake')}
              </button>
            ) : motionPermission === 'granted' ? (
              t(
                isMobile ? 'shakeInstructionsMobile' : 'shakeInstructionsDesktop',
                { item: getLocalizedSkinName(currentSkin) }
              )
            ) : (
              t(
                isMobile ? 'noShakeInstructionsMobile' : 'noShakeInstructionsDesktop',
                { item: getLocalizedSkinName(currentSkin) }
              )
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
    </div>
  );
}

