import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize Lemon Squeezy SDK
export function initializeLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  
  if (!apiKey) {
    throw new Error('LEMONSQUEEZY_API_KEY is required');
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      throw error; // Fail fast instead of just logging
    },
  });
}

// Lemon Squeezy configuration with validation
function validateConfig() {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!storeId) {
    throw new Error('LEMONSQUEEZY_STORE_ID is required');
  }
  
  if (!webhookSecret) {
    throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET is required');
  }

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is required');
  }

  return { storeId, webhookSecret, baseUrl };
}

export const lemonSqueezyConfig = validateConfig();