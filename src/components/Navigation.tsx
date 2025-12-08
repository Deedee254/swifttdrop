'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  // Add a style tag with a media query to ensure desktop menu is hidden on mobile
  const mobileStyle = `
    @media (max-width: 1023px) {
      .desktop-menu {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style jsx>{mobileStyle}</style>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isOpen 
            ? 'bg-brand-dark shadow-lg py-3' 
            : 'bg-brand-dark py-5'
        }`}
      >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo - always visible */}
          <Link 
            href="#hero" 
            className="text-2xl sm:text-3xl font-bold transition-colors duration-300 text-white"
            onClick={handleNavClick}
          >
            SwifttDrop
          </Link>

          {/* Desktop Navigation - hidden on mobile with CSS */}
          <div className="desktop-menu hidden lg:flex items-center space-x-10">
            <Link 
              href="#how-it-works" 
              className="text-white hover:text-brand-primary transition-colors duration-300 font-medium relative group"
            >
              How It Works
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#features" 
              className="text-white hover:text-brand-primary transition-colors duration-300 font-medium relative group"
            >
              Features
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#pricing" 
              className="text-white hover:text-brand-primary transition-colors duration-300 font-medium relative group"
            >
              Pricing
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="#faq" 
              className="text-white hover:text-brand-primary transition-colors duration-300 font-medium relative group"
            >
              FAQ
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <button 
              onClick={() => window.location.href = '#hero'}
              className="group relative overflow-hidden rounded-xl btn-primary px-6 py-2.5 text-white font-semibold shadow-lg"
            >
              <span className="relative z-10">Request Delivery</span>
              <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            </button>
          </div>

          {/* Mobile Menu Button - only visible on mobile with CSS */}
          <button
            className="block lg:hidden focus:outline-none transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isOpen ? 'top-3 rotate-45' : 'top-1'
                }`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                } top-3`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isOpen ? 'top-3 -rotate-45' : 'top-5'
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu - controlled by isOpen state */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[60px] bg-brand-dark shadow-xl transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[calc(100vh-60px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden z-[100]`}
        >
          <div className="px-6 py-8 max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="flex flex-col space-y-6">
              <Link
                href="#how-it-works"
                className="text-white hover:text-brand-primary transition-colors py-2 font-medium text-lg flex items-center"
                onClick={handleNavClick}
              >
                <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                How It Works
              </Link>
              <Link
                href="#features"
                className="text-white hover:text-brand-primary transition-colors py-2 font-medium text-lg flex items-center"
                onClick={handleNavClick}
              >
                <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-white hover:text-brand-primary transition-colors py-2 font-medium text-lg flex items-center"
                onClick={handleNavClick}
              >
                <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-white hover:text-brand-primary transition-colors py-2 font-medium text-lg flex items-center"
                onClick={handleNavClick}
              >
                <span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>
                FAQ
              </Link>

              <div className="pt-6 mt-2 border-t border-gray-700">
                <button
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-brand-primary/30 text-lg"
                  onClick={() => {
                    window.location.href = '#hero';
                    handleNavClick();
                  }}
                >
                  Request Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
