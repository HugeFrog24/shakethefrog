import { useEffect, useState, useCallback, useRef } from 'react';
import { frogMessages } from '../config/messages';

// Increase visibility duration for speech bubbles
const VISIBILITY_MS = 3000; // 3 seconds for message visibility
const COOLDOWN_MS = 2000;   // 2 seconds between new messages

interface SpeechBubbleProps {
  isShaken: boolean;
  triggerCount: number;
}

export function SpeechBubble({ triggerCount }: SpeechBubbleProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const lastTriggerTime = useRef(0);
  const showTimeRef = useRef<number>(0);
  const lastFadeTime = useRef(0);
  
  const getRandomMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * frogMessages.length);
    return frogMessages[randomIndex];
  }, []);

  // Handle new trigger events
  useEffect(() => {
    if (triggerCount === 0) return;
    
    const now = Date.now();
    const timeSinceLastFade = now - lastFadeTime.current;

    // If we're in cooldown, or a message is visible, queue the new message
    if (timeSinceLastFade < COOLDOWN_MS || isVisible) {
      const newMessage = getRandomMessage();
      setMessageQueue(prev => [...prev, newMessage]);
      return;
    }

    // Otherwise, show the message immediately
    lastTriggerTime.current = now;
    showTimeRef.current = now;
    const newMessage = getRandomMessage();
    setMessage(newMessage);
    setIsVisible(true);
  }, [triggerCount, getRandomMessage, isVisible]);

  // Handle message queue
  useEffect(() => {
    if (messageQueue.length === 0 || isVisible) return;

    const now = Date.now();
    const timeSinceLastFade = now - lastFadeTime.current;

    // Only show next message if cooldown has expired
    if (timeSinceLastFade >= COOLDOWN_MS) {
      const nextMessage = messageQueue[0];
      setMessageQueue(prev => prev.slice(1)); // Remove the message from queue
      lastTriggerTime.current = now;
      showTimeRef.current = now;
      setMessage(nextMessage);
      setIsVisible(true);
    }
  }, [messageQueue, isVisible]);

  // Handle visibility duration
  useEffect(() => {
    if (!isVisible) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      lastFadeTime.current = Date.now();
    }, VISIBILITY_MS);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  return (
    <div 
      className={`absolute -top-24 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 
                  px-4 py-2 rounded-xl shadow-lg z-20 transition-opacity duration-300
                  ${isVisible ? 'opacity-100 animate-float' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative">
        {message}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[8px] border-l-transparent
                      border-r-[8px] border-r-transparent
                      border-t-[8px] border-t-white
                      dark:border-t-slate-800" />
      </div>
    </div>
  );
}
