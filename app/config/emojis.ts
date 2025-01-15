// Define our curated emoji pool
export const emojiPool = [
  '💫', '💝', '💘', '💖', '💕', 
  '💓', '💗', '💞', '✨', '🌟',
  '🔥', '👼', '⭐', '💎', '💨',
  '🎉', '🕸️', '🤗', '💋', '😘',
  '🫂', '👫', '💟', '💌', '🥰',
  '😍',
];

// Helper function to get a random emoji
export function getRandomEmoji(): string {
  return emojiPool[Math.floor(Math.random() * emojiPool.length)];
} 