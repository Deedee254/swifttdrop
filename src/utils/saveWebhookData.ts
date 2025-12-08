import fs from 'fs';
import path from 'path';

/**
 * Saves webhook data to a JSON file in a type-specific folder
 * 
 * @param type The type of webhook (delivery, merchant, rider, tracking)
 * @param data The data to save
 * @returns Object with success status and file path or error message
 */
// We don't need a specific WebhookData interface anymore since we're using generics

export async function saveWebhookData<T extends Record<string, unknown>>(
  type: string, 
  data: T
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    // Create base directory for webhook data if it doesn't exist
    const baseDir = path.join(process.cwd(), 'webhook-data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    // Create type-specific directory if it doesn't exist
    const typeDir = path.join(baseDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    // Generate filename using timestamp and request ID
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const requestId = data.requestId || `unknown-${Date.now()}`;
    const filename = `${timestamp}-${requestId}.json`;
    
    // Full path to the file
    const filePath = path.join(typeDir, filename);
    
    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return {
      success: true,
      filePath
    };
  } catch (error) {
    console.error('Error saving webhook data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}