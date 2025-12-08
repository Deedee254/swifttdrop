'use client';

import { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Navigation from './Navigation';
import WhatsAppFloat from './WhatsAppFloat';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Use client-side only rendering for Navigation to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Simulate loading for a smoother experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin-custom" />
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse-custom">
              Loading SwifttDrop...
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {isMounted && <Navigation />}
        <main className="pt-16 flex-grow">
          {children}
        </main>
        <WhatsAppFloat />
      </div>
      
      {/* Scripts */}
      <Script
        src="/sw-register.js"
        strategy="lazyOnload"
        onError={(e) => console.error("Failed to load /sw-register.js", e)}
      />
      <Script id="pwa-install-script" strategy="lazyOnload">
        {`
          try {
            if (typeof window !== 'undefined') {
              const script = document.createElement('script');
              script.src = '/pwa-install-prompt.js';
              script.async = true;
              document.body.appendChild(script);
            }
          } catch (error) {
            console.error("Error loading PWA install prompt script:", error);
          }
        `}
      </Script>
    </ErrorBoundary>
  );
}