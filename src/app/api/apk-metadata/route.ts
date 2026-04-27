import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'app-release.apk');
    const stats = await fs.promises.stat(filePath);
    const sizeBytes = stats.size;
    const sizeKB = Math.round((sizeBytes / 1024) * 100) / 100;
    const sizeMB = Math.round((sizeBytes / (1024 * 1024)) * 100) / 100;

    return NextResponse.json({ name: 'app-release.apk', sizeBytes, sizeKB, sizeMB });
  } catch (err) {
    console.error('Error reading APK file:', err);
    return NextResponse.json({ error: 'APK not found' }, { status: 404 });
  }
}
