import { useState, useEffect } from 'react';
import { SpeechBubble } from './SpeechBubble';
import FrogImage from '../public/images/frog-ai.ai'; // Assuming this is the frog image

export function ParentComponent() {
  const [isShaken, setIsShaken] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  const handleShake = () => {
    setTriggerCount(prev => prev + 1);
    setIsShaken(true);
    // Shake the frog for 1 second
    setTimeout(() => {
      setIsShaken(false);
    }, 1000);
  };

  return (
    <div>
      <FrogImage className={isShaken ? 'shake-animation' : ''} />
      <SpeechBubble isShaken={isShaken} triggerCount={triggerCount} />
      <button onClick={handleShake}>Shake the Frog</button>
    </div>
  );
} 