import { NextResponse } from 'next/server';
import { getVariant } from '@lemonsqueezy/lemonsqueezy.js';
import { initializeLemonSqueezy } from '../../config/lemonsqueezy';
import { appConfig } from '../../config/app';

export async function GET() {
  // Initialize Lemon Squeezy SDK
  initializeLemonSqueezy();

  const prices: Record<string, string> = {};

  // Fetch prices for all premium skins
  for (const [skinId, skin] of Object.entries(appConfig.skins)) {
    if (skin.isPremium && skin.variantId) {
      const variant = await getVariant(skin.variantId);
      
      if (!variant.data) {
        throw new Error(`No variant data found for ${skinId}`);
      }

      const priceInCents = variant.data.data.attributes.price;
      prices[skinId] = `$${(priceInCents / 100).toFixed(2)}`;
    }
  }

  return NextResponse.json({ prices });
}