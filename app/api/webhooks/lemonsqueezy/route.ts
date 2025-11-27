import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { lemonSqueezyConfig } from '../../../config/lemonsqueezy';

// Webhook payload interface using proper typing
interface WebhookPayload {
  meta: {
    event_name: string;
    custom_data?: Record<string, unknown>;
  };
  data: {
    type: string;
    id: string;
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const secret = lemonSqueezyConfig.webhookSecret;
    if (!secret) {
      console.error('Webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const digest = hmac.digest('hex');

    if (signature !== digest) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const eventName = payload.meta?.event_name;

    console.log('Received webhook:', eventName);

    // Handle different webhook events
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(payload);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(payload);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(payload);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(payload);
        break;
      default:
        console.log('Unhandled webhook event:', eventName);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(payload: WebhookPayload) {
  const order = payload.data;
  const attributes = order.attributes as Record<string, unknown>;
  const firstOrderItem = attributes.first_order_item as Record<string, unknown> | undefined;
  const customData = firstOrderItem?.product_name;
  
  console.log('Order created:', {
    orderId: order.id,
    customerEmail: attributes.user_email,
    total: attributes.total_formatted,
    status: attributes.status,
    customData: customData,
  });

  // Here you could:
  // - Send confirmation email
  // - Update user permissions in your database
  // - Log the purchase for analytics
  // - Grant access to premium features
}

async function handleSubscriptionCreated(payload: WebhookPayload) {
  const subscription = payload.data;
  const attributes = subscription.attributes as Record<string, unknown>;
  
  console.log('Subscription created:', {
    subscriptionId: subscription.id,
    customerEmail: attributes.user_email,
    status: attributes.status,
    productName: attributes.product_name,
  });

  // Handle subscription creation
  // - Update user subscription status
  // - Send welcome email
  // - Grant premium access
}

async function handleSubscriptionUpdated(payload: WebhookPayload) {
  const subscription = payload.data;
  const attributes = subscription.attributes as Record<string, unknown>;
  
  console.log('Subscription updated:', {
    subscriptionId: subscription.id,
    status: attributes.status,
    endsAt: attributes.ends_at,
  });

  // Handle subscription updates
  // - Update user access based on status
  // - Handle plan changes
}

async function handleSubscriptionCancelled(payload: WebhookPayload) {
  const subscription = payload.data;
  const attributes = subscription.attributes as Record<string, unknown>;
  
  console.log('Subscription cancelled:', {
    subscriptionId: subscription.id,
    customerEmail: attributes.user_email,
    endsAt: attributes.ends_at,
  });

  // Handle subscription cancellation
  // - Schedule access removal for end date
  // - Send cancellation confirmation
}