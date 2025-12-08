import { NextRequest, NextResponse } from 'next/server';
import { saveWebhookData } from '@/utils/saveWebhookData';

export interface RiderData {
  fullName: string;
  phone: string;
  email: string;
  vehicleType: string;
  location: string;
  experience: string;
  availability: string;
  timestamp?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  enabled: boolean;
}

// Configuration for webhooks
const WEBHOOK_CONFIGS: WebhookConfig[] = [
  {
    url: process.env.CRM_WEBHOOK_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CRM_WEBHOOK_TOKEN || ''}`,
    },
    enabled: !!process.env.CRM_WEBHOOK_URL,
  },
];

// WhatsApp number is defined in environment variables
// Currently WhatsApp messaging is handled client-side
// const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '254725264955';

async function sendToWebhooks(data: RiderData) {
  const webhookPromises = WEBHOOK_CONFIGS
    .filter(config => config.enabled && config.url)
    .map(async (config) => {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers || { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'rider_registration',
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
function formatWhatsAppMessage(data: RiderData): string {
  return `
🏍️ NEW RIDER REGISTRATION

👤 PERSONAL DETAILS
• Full Name: ${data.fullName}
• Phone: ${data.phone}
• Email: ${data.email}
• Location: ${data.location}

🚗 VEHICLE & EXPERIENCE
• Vehicle Type: ${data.vehicleType}
• Experience: ${data.experience}
• Availability: ${data.availability}

🆔 Registration ID: ${data.requestId}
⏰ Time: ${data.timestamp}

Please follow up with this rider registration.
  `.trim();
}
*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'phone', 'email', 'vehicleType', 
      'location', 'experience', 'availability'
    ];
    
    for (const field of requiredFields) {
      if (!body[field] || !body[field].toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate phone number (Kenya format)
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare rider data
    const riderData: RiderData = {
      ...body,
      timestamp: new Date().toISOString(),
      requestId: `RID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Save webhook data to file
    const saveResult = await saveWebhookData('rider', riderData);
    
    // Send to webhooks (CRM systems)
    const webhookResults = await sendToWebhooks(riderData);

    // Return response with webhook results
    return NextResponse.json({
      success: true,
      requestId: riderData.requestId,
      webhookResults,
      saveResult,
      message: 'Rider registration processed successfully',
    });

  } catch (error) {
    console.error('Rider API error:', error);
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
    message: 'SwifttDrop Rider API',
    endpoints: {
      POST: '/api/rider - Register a new rider'
    },
    version: '1.0.0'
  });
}