'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FloatingHearts } from './components/FloatingHearts';

export default function Home() {
  const [isShaken, setIsShaken] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [motionPermission, setMotionPermission] = useState<PermissionState>('prompt');
  const shakeThreshold = 15;

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

  const triggerShake = (intensity: number) => {
    // Start shake animation
    setIsShaken(true);
    
    // Always reset shake after 500ms
    setTimeout(() => {
      setIsShaken(false);
    }, 500);
    
    // Trigger hearts with a shorter duration
    setShakeIntensity(intensity);
    setTimeout(() => setShakeIntensity(0), 300);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        triggerShake(25);
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastUpdate;

      if (timeDiff > 100) {
        setLastUpdate(currentTime);

        const speed = Math.abs(acceleration.x || 0) + 
                     Math.abs(acceleration.y || 0) + 
                     Math.abs(acceleration.z || 0);

        if (speed > shakeThreshold) {
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
    triggerShake(25);
  };

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center p-4 bg-green-50 dark:bg-slate-900">
      <div 
        className={`relative ${isShaken ? 'animate-shake' : ''} z-10`}
        onClick={handleClick}
      >
        <FloatingHearts intensity={shakeIntensity} />
        <Image
          src={isShaken ? '/images/frog-shaken.svg' : '/images/frog.svg'}
          alt="Frog"
          width={200}
          height={200}
          priority
        />
      </div>
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
            "Shake your device, press spacebar, or click/tap frog!"
          ) : (
            "Press spacebar or click/tap frog!"
          )}
        </p>
      </div>
    </main>
  );
}
