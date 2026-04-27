import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function DownloadApp() {
  const [size, setSize] = useState<{ sizeBytes?: number; sizeKB?: number; sizeMB?: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/apk-metadata')
      .then((r) => r.json())
      .then((data) => {
        if (mounted && !data.error) setSize({ sizeBytes: data.sizeBytes, sizeKB: data.sizeKB, sizeMB: data.sizeMB });
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      mounted = false;
    };
  }, []);

  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  const onDownload = async () => {
    setMessage(null);
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (!cleaned) {
      setMessage('Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    try {
      // normalize to E.164 with +254 prefix
      let e164 = cleaned;
      if (e164.startsWith('0')) e164 = e164.slice(1);
      if (!e164.startsWith('254')) e164 = '254' + e164;
      e164 = '+' + e164;

      const res = await fetch('/api/apk-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164 }),
      });

      if (!res.ok) {
        setMessage('Could not record download.');
        setSaving(false);
        return;
      }

      // trigger download
      const a = document.createElement('a');
      a.href = '/app-release.apk';
      a.download = 'app-release.apk';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSaving(false);
      setMessage('Download started. Thank you!');
    } catch (err) {
      console.error(err);
      setMessage('Error occurred.');
      setSaving(false);
    }
  };

  return (
    <section id="download-app" className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-light mb-4">
            <span className="text-brand-dark font-medium">Get the App</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-primary">Download riders App (FetchrAi)</h2>
          <p className="text-lg text-gray-700 mb-8">Install the SwifttDrop Android app to manage deliveries, track orders and receive notifications. Tap the button below to download the APK file.</p>

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-300">+254</div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="712 345 678"
                className="w-full sm:w-72 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-2 mt-2">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-gray-700">
                I consent to provide my phone number and accept the{' '}
                <Link href="/privacy" className="underline text-brand-primary">Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" className="underline text-brand-primary">Terms &amp; Conditions</Link>.
              </label>
            </div>

            <button
              onClick={onDownload}
              disabled={saving || !consent}
              className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow hover:opacity-95 transition disabled:opacity-60"
            >
              <Download className="w-5 h-5" />
              {saving ? 'Recording...' : 'Download APK'}
            </button>

            {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
          </div>

          <div className="mt-4">
            {size ? (
              <p className="text-sm text-gray-600">APK size: <strong>{size.sizeMB} MB</strong> ({size.sizeKB} KB)</p>
            ) : (
              <p className="text-sm text-gray-600">APK size: <em>loading…</em></p>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-6">Note: Android only — you may need to allow installs from unknown sources in your device settings. Replace this APK in <code>/public/app-release.apk</code> with your signed release before production.</p>
        </div>
      </div>
    </section>
  );
}
