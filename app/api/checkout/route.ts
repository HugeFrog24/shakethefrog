import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { initializeLemonSqueezy, lemonSqueezyConfig } from '../../config/lemonsqueezy';
import { appConfig } from '../../config/app';

export async function POST(request: NextRequest) {
  try {
    // Initialize Lemon Squeezy SDK
    initializeLemonSqueezy();

    const { skinId, locale } = await request.json();

    if (!skinId) {
      return NextResponse.json(
        { error: 'Skin ID is required' },
        { status: 400 }
      );
    }

    if (!locale) {
      return NextResponse.json(
        { error: 'Locale is required' },
        { status: 400 }
      );
    }

    // Get skin configuration
    const skin = appConfig.skins[skinId as keyof typeof appConfig.skins];
    
    if (!skin) {
      return NextResponse.json(
        { error: 'Invalid skin ID' },
        { status: 400 }
      );
    }

    if (!skin.isPremium) {
      return NextResponse.json(
        { error: 'This skin is not premium' },
        { status: 400 }
      );
    }

    if (!skin.variantId) {
      return NextResponse.json(
        { error: 'Variant ID not configured for this skin' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkout = await createCheckout(lemonSqueezyConfig.storeId!, skin.variantId!, {
      productOptions: {
        name: `Premium ${skin.name} Skin`,
        description: `Unlock the premium ${skin.name} skin for Shake the Frog!`,
        redirectUrl: `${lemonSqueezyConfig.baseUrl}/${locale}/checkout/success?skin=${skinId}`,
        receiptButtonText: 'Go to App',
        receiptThankYouNote: 'Thank you for your purchase! Your premium skin is now available.',
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
        desc: true,
        discount: true,
        subscriptionPreview: true,
        buttonColor: '#16a34a'
      },
      checkoutData: {
        custom: {
          skin_id: skinId,
        },
      },
      testMode: process.env.NODE_ENV !== 'production',
    });

    if (checkout.error) {
      console.error('Checkout creation error:', checkout.error);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkout.data?.data.attributes.url,
      checkoutId: checkout.data?.data.id,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}