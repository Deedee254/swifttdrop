import { NextRequest, NextResponse } from 'next/server';
import { saveWebhookData } from '@/utils/saveWebhookData';

export interface TrackingData {
  type: string;
  trackingId: string;
  phoneNumber: string | null;
  timestamp: string;
  source: string;
  userAgent: string | null;
  ip: string;
  requestId?: string;
  [key: string]: unknown;
}

// Webhook configuration for tracking requests
const WEBHOOK_CONFIGS = [
  {
    url: process.env.CRM_WEBHOOK_URL || 'http://localhost:3000/api/webhook-test',
    token: process.env.CRM_WEBHOOK_TOKEN || 'test_token',
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingId, phoneNumber } = body;

    // Validate required fields
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    // Prepare tracking data
    const trackingData: TrackingData = {
      type: 'tracking_request',
      trackingId,
      phoneNumber: phoneNumber || null,
      timestamp: new Date().toISOString(),
      source: 'SwifttDrop_website',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    };

    console.log('Processing tracking request:', trackingData);

    // Send to configured webhooks
    const webhookPromises = WEBHOOK_CONFIGS.map(async (config) => {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.token}`,
            'X-Webhook-Source': 'SwifttDrop-tracking'
          },
          body: JSON.stringify(trackingData)
        });

        if (!response.ok) {
          console.error(`Webhook failed: ${config.url}`, response.status);
          return { success: false, url: config.url, status: response.status };
        }

        return { success: true, url: config.url, status: response.status };
      } catch (error) {
        console.error(`Webhook error: ${config.url}`, error);
        return { success: false, url: config.url, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    const webhookResults = await Promise.all(webhookPromises);
    
    // Check if at least one webhook succeeded
    const hasSuccessfulWebhook = webhookResults.some(result => result.success);

    if (!hasSuccessfulWebhook) {
      console.error('All webhooks failed:', webhookResults);
    }
    
    // Save tracking data to file
    const saveResult = await saveWebhookData('tracking', trackingData);

    // Return success response with tracking info
    return NextResponse.json({
      success: true,
      message: 'Tracking request processed successfully',
      trackingId,
      saveResult,
      webhookResults: webhookResults.map(result => ({
        url: result.url,
        success: result.success,
        status: result.status
      }))
    });

  } catch (error) {
    console.error('Tracking API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process tracking request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for tracking status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get('trackingId');

  if (!trackingId) {
    return NextResponse.json(
      { error: 'Tracking ID is required' },
      { status: 400 }
    );
  }

  // This would typically query your database for tracking information
  // For now, return a mock response
  return NextResponse.json({
    trackingId,
    status: 'in_transit',
    message: 'Your package is on the way! Contact us on WhatsApp for real-time updates.',
    whatsappNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '16018432762',
    lastUpdated: new Date().toISOString()
  });
}