import { useEffect, useState, useCallback, useRef } from 'react';
import { useMessages } from 'next-intl';
import { getRandomEmoji } from '../config/emojis';

const VISIBILITY_MS = 3000;
const COOLDOWN_MS = 2000;

interface SpeechBubbleProps {
  isShaken: boolean;
  triggerCount: number;
}

export function SpeechBubble({ triggerCount }: SpeechBubbleProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const allMessages = useMessages();
  const messagesRef = useRef<string[]>([]);
  const lastTriggerTime = useRef(0);
  const showTimeRef = useRef<number>(0);
  const lastFadeTime = useRef(0);
  
  useEffect(() => {
    if (messagesRef.current.length > 0) return;
    
    try {
      const characterMessages = allMessages.character;
      
      if (characterMessages && typeof characterMessages === 'object') {
        const messageArray = Object.values(characterMessages) as string[];
        
        if (messageArray.length === 0) {
          console.error(`No character messages found! Expected messages in 'character' namespace but got none.`);
          return;
        }
        
        console.log(`Loaded ${messageArray.length} character messages`);
        messagesRef.current = messageArray;
      } else {
        console.error(`Character messages not found or invalid format:`, characterMessages);
      }
    } catch (error) {
      console.error(`Error loading character messages:`, error);
    }
  }, [allMessages]);

  const getRandomMessage = useCallback(() => {
    const currentMessages = messagesRef.current;
    if (currentMessages.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * currentMessages.length);
    const messageValue = currentMessages[randomIndex];
    return `${messageValue} ${getRandomEmoji()}`;
  }, []);

  useEffect(() => {
    if (triggerCount === 0 || messagesRef.current.length === 0) return;
    
    const now = Date.now();
    const timeSinceLastFade = now - lastFadeTime.current;

    if (timeSinceLastFade < COOLDOWN_MS || isVisible) {
      const newMessage = getRandomMessage();
      if (newMessage) {
        setMessageQueue(prev => [...prev, newMessage]);
      }
      return;
    }

    lastTriggerTime.current = now;
    showTimeRef.current = now;
    const newMessage = getRandomMessage();
    if (newMessage) {
      setMessage(newMessage);
      setIsVisible(true);
    }
  }, [triggerCount, isVisible, getRandomMessage]);

  useEffect(() => {
    if (messageQueue.length === 0 || isVisible) return;

    const now = Date.now();
    const timeSinceLastFade = now - lastFadeTime.current;

    if (timeSinceLastFade >= COOLDOWN_MS) {
      const nextMessage = messageQueue[0];
      setMessageQueue(prev => prev.slice(1));
      lastTriggerTime.current = now;
      showTimeRef.current = now;
      setMessage(nextMessage);
      setIsVisible(true);
    }
  }, [messageQueue, isVisible]);

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
      className={`absolute -top-24 bg-white dark:bg-slate-800
                  px-4 py-2 rounded-xl shadow-lg z-20 transition-opacity duration-300
                  ${isVisible ? 'opacity-100 animate-float' : 'opacity-0 pointer-events-none'}`}
      style={{
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      {message}
    </div>
  );
}
