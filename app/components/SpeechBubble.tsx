import { useEffect, useState, useCallback, useRef } from 'react';
import { loadMessages, SupportedLanguage } from '../config/messages';
import { getRandomEmoji } from '../config/emojis';

// Increase visibility duration for speech bubbles
const VISIBILITY_MS = 3000; // 3 seconds for message visibility
const COOLDOWN_MS = 2000;   // 2 seconds between new messages

interface SpeechBubbleProps {
  isShaken: boolean;
  triggerCount: number;
  language: SupportedLanguage;
}

export function SpeechBubble({ triggerCount, language }: SpeechBubbleProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [, setMessages] = useState<string[]>([]);
  const messagesRef = useRef<string[]>([]);
  const lastTriggerTime = useRef(0);
  const showTimeRef = useRef<number>(0);
  const lastFadeTime = useRef(0);
  
  // Load messages when language changes
  useEffect(() => {
    loadMessages(language).then(newMessages => {
      setMessages(newMessages);
      messagesRef.current = newMessages; // Keep ref in sync
    }).catch(error => {
      console.error('Failed to load messages:', error);
    });
  }, [language]);

  const getRandomMessage = useCallback(() => {
    const currentMessages = messagesRef.current;
    if (currentMessages.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * currentMessages.length);
    const message = currentMessages[randomIndex];
    return `${message} ${getRandomEmoji()}`;
  }, []); // No dependencies needed since we use ref

  // Handle new trigger events
  useEffect(() => {
    if (triggerCount === 0 || messagesRef.current.length === 0) return;
    
    const now = Date.now();
    const timeSinceLastFade = now - lastFadeTime.current;

    // If we're in cooldown, or a message is visible, queue the new message
    if (timeSinceLastFade < COOLDOWN_MS || isVisible) {
      const newMessage = getRandomMessage();
      if (newMessage) {
        setMessageQueue(prev => [...prev, newMessage]);
      }
      return;
    }

    // Otherwise, show the message immediately
    lastTriggerTime.current = now;
    showTimeRef.current = now;
    const newMessage = getRandomMessage();
    if (newMessage) {
      setMessage(newMessage);
      setIsVisible(true);
    }
  }, [triggerCount, isVisible, getRandomMessage]);

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
