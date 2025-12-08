'use client';

import { MessageSquare, Truck, Clock, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="w-12 h-12 sm:w-14 sm:h-14" />,
      title: "Book via WhatsApp",
      description: "Send your delivery details through WhatsApp - no app download required.",
      color: "swift-blue",
      gradient: "from-swift-blue-500 to-swift-blue-600",
      lightGradient: "from-swift-blue-50 to-swift-blue-100",
      darkGradient: "from-swift-blue-600 to-swift-blue-700",
      number: "01"
    },
    {
      icon: <Truck className="w-12 h-12 sm:w-14 sm:h-14" />,
      title: "Pickup & Deliver",
      description: "Our verified rider picks up your package and delivers it to the destination.",
      color: "swift-blue",
      gradient: "from-swift-blue-500 to-swift-blue-600",
      lightGradient: "from-swift-blue-50 to-swift-blue-100",
      darkGradient: "from-swift-blue-600 to-swift-blue-700",
      number: "02"
    },
    {
      icon: <Clock className="w-12 h-12 sm:w-14 sm:h-14" />,
      title: "Real-Time Tracking",
      description: "Track your delivery status in real-time through WhatsApp updates.",
      color: "swift-blue",
      gradient: "from-swift-blue-500 to-swift-blue-600",
      lightGradient: "from-swift-blue-50 to-swift-blue-100",
      darkGradient: "from-swift-blue-600 to-swift-blue-700",
      number: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gray-50 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-swift-blue-300 rounded-full filter blur-[150px] opacity-20 z-0"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-swift-blue-300 rounded-full filter blur-[150px] opacity-20 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-light/30 mb-4 animate-fade-in-up">
            <span className="text-brand-primary font-medium">Simple 3-Step Process</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-gray-900">
            How SwifttDrop Works
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-100">
            Simple, fast, and efficient delivery process — all through WhatsApp
          </p>
        </div>
        
        {/* Desktop view */}
        <div className="hidden md:flex justify-center items-center max-w-6xl mx-auto relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-1 bg-brand-primary transform -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="w-1/3 px-4 relative z-10 animate-fade-in-up"
              style={{ '--animation-delay': `${(index + 2) * 0.1}s` } as React.CSSProperties}
            >
              <div className="relative rounded-2xl p-8 transition-all duration-500 group hover:shadow-2xl bg-white hover:shadow-swift-blue-200/40 border border-gray-100 hover:border-swift-blue-200 overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-brand-light/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Step number */}
                <div className="absolute top-4 right-4 font-bold text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 z-10">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-primary text-white p-4 shadow-lg group-hover:shadow-xl transition-all duration-500 z-20">
                  {step.icon}
                  <div className="absolute inset-0 rounded-2xl bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="relative z-20">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile view */}
        <div className="md:hidden space-y-12 max-w-sm mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in-up" style={{ '--animation-delay': `${(index + 2) * 0.1}s` } as React.CSSProperties}>
              <div className="relative rounded-2xl p-8 bg-white shadow-xl border border-swift-blue-100 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-brand-light/30 opacity-20"></div>
                
                {/* Step number */}
                <div className="absolute top-4 right-4 font-bold text-4xl opacity-10">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-primary text-white p-4 shadow-lg">
                  {step.icon}
                </div>
                
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce-custom animation-duration-1-5s">
                  <ArrowRight className="w-6 h-6 transform rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}