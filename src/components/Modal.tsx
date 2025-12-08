'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close modal on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  if (!isMounted && !isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black transition-all duration-500 ${
        isOpen ? 'bg-opacity-60 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-none pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`${sizeClasses[size]} w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } relative overflow-hidden max-h-[95vh] flex flex-col`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-swift-blue-100 rounded-full filter blur-xl opacity-30 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-swift-blue-100 rounded-full filter blur-xl opacity-30 z-0"></div>
        
        <div className="relative z-10 flex flex-col h-full max-h-[95vh]">
          <div className="flex items-center justify-between p-3 sm:p-5 md:p-6 border-b border-gray-200 flex-shrink-0">
            <h3 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate pr-2">{title}</h3>
            <button
              onClick={onClose}
              className="text-swift-blue-500 hover:text-swift-blue-700 focus:outline-none focus:ring-2 focus:ring-swift-blue-500 rounded-full p-2 bg-swift-blue-50 hover:bg-swift-blue-100 transition-all duration-300 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="p-3 sm:p-5 md:p-8 flex-grow modal-content-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}