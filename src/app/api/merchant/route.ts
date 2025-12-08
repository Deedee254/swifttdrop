import { NextRequest, NextResponse } from 'next/server';
import { saveWebhookData } from '@/utils/saveWebhookData';

export interface MerchantData {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  businessType: string;
  location: string;
  deliveriesPerMonth: string;
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

async function sendToWebhooks(data: MerchantData) {
  const webhookPromises = WEBHOOK_CONFIGS
    .filter(config => config.enabled && config.url)
    .map(async (config) => {
      try {
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers || { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'merchant_registration',
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
function formatWhatsAppMessage(data: MerchantData): string {
  return `
🏪 NEW MERCHANT REGISTRATION

🏢 BUSINESS DETAILS
• Business Name: ${data.businessName}
• Business Type: ${data.businessType}
• Location: ${data.location}
• Expected Deliveries: ${data.deliveriesPerMonth}/month

👤 CONTACT DETAILS
• Contact Person: ${data.contactName}
• Phone: ${data.phone}
• Email: ${data.email}

🆔 Registration ID: ${data.requestId}
⏰ Time: ${data.timestamp}

Please follow up with this merchant registration.
  `.trim();
}
*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'businessName', 'contactName', 'phone', 'email', 
      'businessType', 'location', 'deliveriesPerMonth'
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

    // Prepare merchant data
    const merchantData: MerchantData = {
      ...body,
      timestamp: new Date().toISOString(),
      requestId: `MER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Save webhook data to file
    const saveResult = await saveWebhookData('merchant', merchantData);
    
    // Send to webhooks (CRM systems)
    const webhookResults = await sendToWebhooks(merchantData);

    // Return response with webhook results
    return NextResponse.json({
      success: true,
      requestId: merchantData.requestId,
      webhookResults,
      saveResult,
      message: 'Merchant registration processed successfully',
    });

  } catch (error) {
    console.error('Merchant API error:', error);
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
    message: 'SwifttDrop Merchant API',
    endpoints: {
      POST: '/api/merchant - Register a new merchant'
    },
    version: '1.0.0'
  });
}