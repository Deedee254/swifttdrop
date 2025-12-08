import { NextRequest, NextResponse } from 'next/server';

// This is a test webhook endpoint that you can use to test webhook functionality
// You can point your CRM_WEBHOOK_URL to this endpoint during development

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('=== WEBHOOK TEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('=== END WEBHOOK TEST ===');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      message: 'Webhook test received successfully',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SwifttDrop Webhook Test Endpoint',
    description: 'Use this endpoint to test webhook functionality during development',
    usage: {
      method: 'POST',
      contentType: 'application/json',
      example: {
        type: 'delivery_request',
        data: { /* your data here */ },
        source: 'SwifttDrop_landing',
        timestamp: new Date().toISOString(),
      }
    },
    version: '1.0.0'
  });
}