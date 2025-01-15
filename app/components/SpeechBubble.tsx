import { useEffect, useState, useCallback, useRef } from 'react';
import { frogMessages } from '../config/messages';

// Increase visibility duration for speech bubbles
const VISIBILITY_MS = 3000; // 3 seconds for message visibility
const COOLDOWN_MS = 2000;   // 2 seconds between new messages

interface SpeechBubbleProps {
  isShaken: boolean;
  triggerCount: number;
}

export function SpeechBubble({ isShaken, triggerCount }: SpeechBubbleProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const lastTriggerTime = useRef(0);
  const showTimeRef = useRef<number>(0);
  const getRandomMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * frogMessages.length);
    return frogMessages[randomIndex];
  }, []);

  // Handle showing new messages
  useEffect(() => {
    if (triggerCount === 0) return; // Skip initial mount
    
    const now = Date.now();
    const timeSinceLastMessage = now - lastTriggerTime.current;

    // Show new message if cooldown has expired
    if (timeSinceLastMessage >= COOLDOWN_MS) {
      lastTriggerTime.current = now;
      showTimeRef.current = now;
      const newMessage = getRandomMessage();
      setMessage(newMessage);
      setIsVisible(true);
    }
  }, [triggerCount, getRandomMessage]);

  // Handle visibility duration
  useEffect(() => {
    if (!isVisible) return;

    const checkVisibility = setInterval(() => {
      const now = Date.now();
      const timeVisible = now - showTimeRef.current;
      
      if (timeVisible >= VISIBILITY_MS) {
        setIsVisible(false);
      }
    }, 100); // Check every 100ms

    return () => {
      clearInterval(checkVisibility);
    };
  }, [isVisible]);
  
  // Uncomment and modify the useEffect to control visibility based on isShaken prop
  // This will make the speech bubble stay visible even after shaking stops
  useEffect(() => {
    if (!isShaken) {
      // Don't hide the speech bubble when shaking stops
      // The visibility duration timer will handle hiding it
      return;
    }
  }, [isShaken]);

  if (!isVisible) return null;

  return (
    <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg animate-float z-20">
      <div className="relative">
        {message}
        {/* Triangle pointer */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[8px] border-l-transparent
                      border-r-[8px] border-r-transparent
                      border-t-[8px] border-t-white
                      dark:border-t-slate-800" />
      </div>
    </div>
  );
}
