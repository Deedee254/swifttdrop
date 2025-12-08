'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Show tooltip after 3 seconds if user hasn't interacted
  useEffect(() => {
    if (!hasInteracted) {
      const timer = setTimeout(() => {
        setIsTooltipVisible(true);
        
        // Auto-hide tooltip after 5 seconds
        const hideTimer = setTimeout(() => {
          setIsTooltipVisible(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);
  
  const handleWhatsAppClick = () => {
    setHasInteracted(true);
    setIsTooltipVisible(false);
    
    const phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '16018432762';
    const message = 'Hi! I would like to know more about SwifttDrop delivery services.';
    const contactUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(contactUrl, '_blank');
  };
  
  const handleTooltipClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    setIsTooltipVisible(false);
  };

  return (
    <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50">
      {isTooltipVisible && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-5 mb-3 w-72 text-base animate-fade-in border border-brand-light backdrop-blur-sm">
          <button 
            onClick={handleTooltipClose}
            className="absolute top-3 right-3 text-brand-primary hover:text-brand-secondary transition-colors w-6 h-6 rounded-full bg-brand-light hover:bg-brand-light/80 flex items-center justify-center"
            aria-label="Close tooltip"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center mr-3 flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Need help?</h4>
              <p className="text-gray-600">Chat with us on WhatsApp for instant support!</p>
            </div>
          </div>
          
          {/* Animated arrow pointing to the button */}
          <div className="absolute bottom-[-12px] right-6 w-6 h-6 transform rotate-45 bg-white border-r border-b border-brand-light"></div>
        </div>
      )}
      
      <div className="relative group">
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-brand-primary opacity-30 group-hover:opacity-40 animate-ping"></div>
        
        {/* Button */}
        <button
          onClick={handleWhatsAppClick}
          className="relative bg-brand-primary hover:bg-brand-secondary text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-fade-in z-10"
          aria-label="Contact us on WhatsApp"
        >
          <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" fill="white" />
        </button>
      </div>
    </div>
  );
}