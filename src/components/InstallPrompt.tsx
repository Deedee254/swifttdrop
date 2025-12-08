'use client';

import { useState, useEffect } from 'react';

// Define a proper type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      // Check if the user has already dismissed the prompt
      const hasUserDismissedPrompt = localStorage.getItem('pwaPromptDismissed');
      if (hasUserDismissedPrompt === 'true') {
        return;
      }
    } catch (error) {
      console.error('Error in InstallPrompt useEffect:', error);
      return;
    }

    // Function to handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        // Prevent the default browser install prompt
        if (typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        // Save the event so it can be triggered later
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      } catch (error) {
        console.error('Error in beforeinstallprompt handler:', error);
      }
    };

    // Listen for the beforeinstallprompt event
    try {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    } catch (error) {
      console.error('Error adding beforeinstallprompt listener:', error);
    }

    // Show the install prompt after 5 seconds
    const timer = setTimeout(() => {
      if (isInstallable) {
        setShowInstallPrompt(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      try {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      } catch (error) {
        console.error('Error removing beforeinstallprompt listener:', error);
      }
    };
  }, [isInstallable]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      await deferredPrompt.userChoice;
      
      // We no longer need the prompt. Clear it up
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember that the user dismissed the prompt
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pwaPromptDismissed', 'true');
    }
  };

  if (!showInstallPrompt || !isInstallable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-brand-dark rounded-lg shadow-lg p-4 z-50 border border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Install SwifttDrop</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Install our app for a better experience with offline access and faster loading times.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}