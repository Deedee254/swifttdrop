'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Package, ArrowLeft } from 'lucide-react';

export default function Offline() {
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Check for online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Redirect after a short delay to show the online status
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check current status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTryAgain = () => {
    setIsReconnecting(true);
    
    // Simulate checking connection
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = '/';
      } else {
        setIsReconnecting(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white" style={{
      backgroundImage: 'linear-gradient(to bottom right, var(--swift-blue-900), var(--swift-blue-800), var(--swift-blue-700))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Simple header to mimic the main site */}
      <div className="border-b border-swift-blue-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center">
          <div className="text-xl sm:text-2xl font-bold">SwifttDrop</div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-swift-xl border border-swift-blue-500/30 max-w-md w-full animate-fade-in-up">
          <div className="text-center space-y-5 sm:space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                {isOnline ? (
                  <div className="animate-spin-custom">
                    <RefreshCw className="w-16 sm:w-20 h-16 sm:h-20 text-swift-blue-400" />
                  </div>
                ) : (
                  <>
                    <WifiOff className="w-16 sm:w-20 h-16 sm:h-20 text-red-400" />
                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                      <Package className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Title and description */}
            <div className="animate-fade-in-up delay-100">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                {isOnline ? "You're Back Online!" : "You're Offline"}
              </h1>
              <p className="text-base sm:text-lg text-blue-100 mb-2">
                {isOnline 
                  ? "Reconnecting to SwifttDrop..." 
                  : "Please check your internet connection and try again."}
              </p>
              <p className="text-xs sm:text-sm text-blue-200/70">
                {isOnline
                  ? "You'll be redirected to the homepage shortly."
                  : "SwifttDrop needs an internet connection to book and track deliveries."}
              </p>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm bg-swift-blue-800/30 py-2 px-4 rounded-lg animate-fade-in-up delay-200">
              <div className={`w-3 h-3 rounded-full animate-pulse-custom ${isOnline ? 'bg-swift-blue-500' : 'bg-red-500'}`}></div>
              <span>{isOnline ? "Connected" : "Waiting for connection..."}</span>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3 animate-fade-in-up delay-300">
              <button 
                onClick={handleTryAgain}
                disabled={isReconnecting || isOnline}
                className={`btn-secondary w-full ${(isReconnecting || isOnline) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isReconnecting ? (
                  <>
                    <svg className="animate-spin-custom -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reconnecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </>
                )}
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-primary w-full"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center p-4 text-xs sm:text-sm text-blue-200/70">
        <p>© {new Date().getFullYear()} SwifttDrop. All rights reserved.</p>
      </div>
    </div>
  );
}