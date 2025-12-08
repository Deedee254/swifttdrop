'use client';

import { useState, useEffect } from 'react';

export default function SimpleInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Check if the user has already dismissed the prompt
    try {
      const hasUserDismissedPrompt = localStorage.getItem('pwaPromptDismissed');
      if (hasUserDismissedPrompt === 'true') {
        return;
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
      return;
    }

    // Simple detection for installability
    // This is not as accurate as the beforeinstallprompt event
    // but it's a fallback that won't cause errors
    // Define a type for the navigator with standalone property
    interface NavigatorWithStandalone extends Navigator {
      standalone?: boolean;
    }
    
    const isStandalone = 
      'standalone' in window.navigator && (window.navigator as NavigatorWithStandalone).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;
    
    const isInstallable = 
      !isStandalone && 
      'serviceWorker' in navigator &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isInstallable) {
      // Show the prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    
    try {
      // Remember that the user dismissed the prompt
      localStorage.setItem('pwaPromptDismissed', 'true');
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-brand-dark rounded-lg shadow-xl p-4 z-50 border border-brand-primary animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">Install SwifttDrop</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Install our app for a better experience with offline access and faster loading times.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => {
                alert('To install this app:\n\niOS: Tap the share icon and select "Add to Home Screen"\n\nAndroid: Tap the menu button and select "Install App" or "Add to Home Screen"');
                handleDismiss();
              }}
              className="px-3 sm:px-4 py-2 btn-primary text-white text-xs sm:text-sm font-medium rounded-md"
            >
              How to Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}