import { NextRequest, NextResponse } from 'next/server';
import { saveWebhookData } from '@/utils/saveWebhookData';

export interface DeliveryData {
  pickupName: string;
  pickupPhone: string;
  pickupLocation: string;
  dropoffName: string;
  dropoffPhone: string;
  dropoffLocation: string;
  itemType: string;
  instructions?: string;
  timestamp?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  enabled: boolean;
}

// Configuration for webhooks - you can modify these or make them environment variables
const WEBHOOK_CONFIGS: WebhookConfig[] = [
  {
    url: process.env.CRM_WEBHOOK_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CRM_WEBHOOK_TOKEN || ''}`,
    },
    enabled: !!process.env.CRM_WEBHOOK_URL,
  },
  // Add more webhook configurations as needed
];

// WhatsApp number is defined in environment variables
// Currently WhatsApp messaging is handled client-side
// const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '254725264955';

async function sendToWebhooks(data: DeliveryData) {
  const webhookPromises = WEBHOOK_CONFIGS
    .filter(config => config.enabled && config.url)
    .map(async (config) => {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers || { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'delivery_request',
            data,
            source: 'SwifttDrop_landing',
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
        }

        return {
          url: config.url,
          success: true,
          response: await response.text(),
        };
      } catch (error) {
        console.error(`Webhook error for ${config.url}:`, error);
        return {
          url: config.url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

  return Promise.all(webhookPromises);
}

// WhatsApp message formatting is currently handled client-side
// This function is kept for future server-side WhatsApp integration
/*
function formatWhatsAppMessage(data: DeliveryData): string {
  return `
🚚 NEW DELIVERY REQUEST

📍 PICKUP DETAILS
• Location: ${data.pickupLocation}
• Contact: ${data.pickupName}
• Phone: ${data.pickupPhone}

📍 DROPOFF DETAILS  
• Location: ${data.dropoffLocation}
• Contact: ${data.dropoffName}
• Phone: ${data.dropoffPhone}

📦 PACKAGE DETAILS
• Item Type: ${data.itemType}
${data.instructions ? `• Instructions: ${data.instructions}` : ''}

🆔 Request ID: ${data.requestId}
⏰ Time: ${data.timestamp}

Please confirm this delivery request.
  `.trim();
}
*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'pickupName', 'pickupPhone', 'pickupLocation',
      'dropoffName', 'dropoffPhone', 'dropoffLocation', 'itemType'
    ];
    
    for (const field of requiredFields) {
      if (!body[field] || !body[field].toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate phone numbers (Kenya format)
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(body.pickupPhone)) {
      return NextResponse.json(
        { error: 'Invalid pickup phone number format' },
        { status: 400 }
      );
    }
    if (!phoneRegex.test(body.dropoffPhone)) {
      return NextResponse.json(
        { error: 'Invalid dropoff phone number format' },
        { status: 400 }
      );
    }

    // Prepare delivery data
    const deliveryData: DeliveryData = {
      ...body,
      timestamp: new Date().toISOString(),
      requestId: `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Save webhook data to file
    const saveResult = await saveWebhookData('delivery', deliveryData);
    
    // Send to webhooks (CRM systems)
    const webhookResults = await sendToWebhooks(deliveryData);

    // Return response with webhook results
    return NextResponse.json({
      success: true,
      requestId: deliveryData.requestId,
      webhookResults,
      saveResult,
      message: 'Delivery request processed successfully',
    });

  } catch (error) {
    console.error('Delivery API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SwifttDrop Delivery API',
    endpoints: {
      POST: '/api/delivery - Create a new delivery request'
    },
    version: '1.0.0'
  });
}