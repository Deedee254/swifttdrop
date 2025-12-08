'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR for the client component
const ClientInstallPrompt = dynamic(() => import('./ClientInstallPrompt'), {
  ssr: false,
});

export default function InstallPromptWrapper() {
  return <ClientInstallPrompt />;
}