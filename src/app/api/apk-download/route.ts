import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').toString().trim();
    if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });

    const downloadsDir = path.join(process.cwd(), 'webhook-data', 'downloads');
    await fs.promises.mkdir(downloadsDir, { recursive: true });

    const csvPath = path.join(downloadsDir, 'downloads.csv');
    const exists = fs.existsSync(csvPath);
    const now = new Date().toISOString();
    const row = `${now},${phone}\n`;

    if (!exists) {
      const header = 'timestamp,phone\n';
      await fs.promises.writeFile(csvPath, header + row, { encoding: 'utf8' });
    } else {
      await fs.promises.appendFile(csvPath, row, { encoding: 'utf8' });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error recording apk download:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
