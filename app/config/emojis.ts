// Define our curated emoji pool
const emojiPool = [
  '💫', '💝', '💘', '💖', '💕',
  '💓', '💗', '💞', '✨', '🌟',
  '🔥', '👼', '⭐', '💎', '💨',
  '🎉', '🕸️', '🤗', '💋', '😘',
  '🫂', '👫', '💟', '💌', '🥰',
  '😍', '🥺', '😢', '😭'
];

// Helper function to get a random emoji
export function getRandomEmoji(): string {
  return emojiPool[Math.floor(Math.random() * emojiPool.length)];
} 