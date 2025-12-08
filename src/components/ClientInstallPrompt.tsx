'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

// Dynamically import the SimpleInstallPrompt component with no SSR
const SimpleInstallPrompt = dynamic(() => import('./SimpleInstallPrompt'), { 
  ssr: false,
  loading: () => null,
});

export default function ClientInstallPrompt() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SimpleInstallPrompt />
    </ErrorBoundary>
  );
}