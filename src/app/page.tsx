'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Truck, 
  Star, 
  CheckCircle, 
  Store,
  Package,
  Phone,
  Mail,
  MapPin,
  MapPin as LocationIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
  MessageSquare,
  CreditCard,
  Zap
} from 'lucide-react';

// Import components
import Modal from '@/components/Modal';
import DeliveryForm from '@/components/DeliveryForm';
import MerchantForm from '@/components/MerchantForm';
import RiderForm from '@/components/RiderForm';
import DeliverySimulator from '@/components/DeliverySimulator';
import BenefitsModal from '@/components/BenefitsModal';
import HowItWorks from '@/components/HowItWorks';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Navigation from '@/components/Navigation';
import InstallPromptWrapper from '@/components/InstallPromptWrapper';
import dynamic from 'next/dynamic';
const DownloadApp = dynamic(() => import('@/components/DownloadApp'));

export default function Home() {
  // We're using useState but not isClient directly - it's used to ensure client-side rendering
  const [, setIsClient] = useState(false);
  const [activeModal, setActiveModal] = useState<'delivery' | 'merchant' | 'rider' | 'simulator' | 'benefits' | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Kimani',
      role: 'Restaurant Owner',
      content: 'SwifttDrop has transformed our delivery service. Orders are tracked in real-time and payments are instant!',
      rating: 5
    },
    {
      name: 'David Mwangi',
      role: 'Delivery Rider',
      content: 'I earn more with SwifttDrop than any other platform. The payment system is reliable and instant.',
      rating: 5
    },
    {
      name: 'Grace Wanjiku',
      role: 'Customer',
      content: 'Ordering through WhatsApp is so convenient! I can track my package and pay easily.',
      rating: 5
    },
    {
      name: 'Peter Ochieng',
      role: 'Shop Owner',
      content: 'SwifttDrop helps us reach more customers. The business dashboard makes managing deliveries easy.',
      rating: 5
    }
  ];

  // Auto-play testimonials slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => 
        prev === testimonials.length - 2 ? 0 : prev + 1
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonials = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === testimonials.length - 2 ? 0 : prev + 1
    );
  };

  const prevTestimonials = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 2 : prev - 1
    );
  };

  const handleTrackingRequest = async () => {
    if (!trackingInput.trim()) return;
    
    // Directly format and open WhatsApp message
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '16018432762';
    const message = `Track my delivery: ${trackingInput}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset the input field
    setTrackingInput('');
    
    // Send tracking request to API in the background (don't wait for response)
    try {
      fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingId: trackingInput.trim(),
        }),
      }).catch(error => {
        console.error('Error sending tracking request to API:', error);
      });
    } catch (error) {
      console.error('Error preparing tracking request:', error);
    }
  };
  




  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'WhatsApp Booking',
      description: 'Book deliveries directly through WhatsApp - no app download required.'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'M-Pesa Payments',
      description: 'Safe and secure payment processing with M-Pesa integration for riders and merchants.'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Real-Time Tracking',
      description: 'Track your deliveries in real-time with live updates via WhatsApp.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service with our network of verified delivery partners.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Delivery Partners' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const faqs = [
    {
      question: "How do I place a delivery order?",
      answer: "Simply click on the 'Create Delivery' button, fill in the pickup and dropoff details, and send the request via WhatsApp. Our team will confirm your order immediately."
    },
    {
      question: "How much does delivery cost?",
      answer: "Our delivery fees start at KES 150 and vary based on distance and package size. Use our Delivery Simulator to get an accurate estimate for your specific delivery."
    },
    {
      question: "How do I track my delivery?",
      answer: "Once your delivery is confirmed, you'll receive real-time updates via WhatsApp, including rider details, pickup confirmation, and estimated arrival time."
    },
    {
      question: "How do riders get paid?",
      answer: "Riders receive instant payments via M-Pesa after each completed delivery. Earnings are calculated based on distance, time, and other factors."
    },
    {
      question: "Can I become a delivery rider?",
      answer: "Yes! Click on 'Become a Rider' to apply. You'll need a vehicle (motorcycle preferred), a smartphone with WhatsApp, and valid identification."
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Install Prompt */}
      <InstallPromptWrapper />
      
      {/* Hero Section */}
      <section id="hero" className="relative text-white overflow-hidden min-h-screen flex items-center">
        {/* Background with optimized overlay */}
        <div className="absolute inset-0 z-0">
          {/* Base background color */}
          <div className="absolute inset-0 bg-brand-dark z-0"></div>
          
          {/* Background image with better visibility and responsiveness */}
          <div 
            className="absolute inset-0 z-10 hero-bg-image"
          ></div>
          
          {/* Simplified overlay for better image visibility */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/30 to-black/50"></div>
          
          {/* Subtle accent color - animation removed */}
          <div className="absolute inset-0 opacity-10 z-30 bg-brand-primary"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32 z-40">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left mt-12 sm:mt-16 lg:mt-0">
              <div className="inline-block px-4 py-1 rounded-full bg-white/20 border border-white/30 mb-6 animate-fade-in-up">
                <span className="text-white font-medium text-sm">Kenya&apos;s Premier Last-Mile Delivery Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight animate-fade-in-up">
                Deliver Faster.
                <span className="block text-brand-secondary  mt-2"> Reliable & Transparent.</span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10 text-white/90 leading-relaxed animate-fade-in-up delay-100 max-w-xl mx-auto lg:mx-0">
                Book deliveries, register, and track — all via WhatsApp.
                <span className="block mt-2 text-lg sm:text-xl text-white/80">No app download required.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up delay-200">
                <button 
                  onClick={() => setActiveModal('delivery')}
                  className="btn btn-primary group relative overflow-hidden rounded-xl shadow-lg px-4 py-2 text-sm"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Package className="w-5 h-5 mr-2" />
                    Create Delivery
                  </span>
                  <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                </button>

                <a
                  href="/app-release.apk"
                  download
                  className="group relative overflow-hidden rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Download App
                  </span>
                  <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                </a>
              </div>
            </div>
            
            <div className="grid gap-6 sm:gap-8 max-w-md mx-auto lg:mx-0 lg:max-w-none">
              {/* Track Your Delivery */}
              <div className="p-6 sm:p-8 shadow-2xl animate-fade-in-up delay-300 rounded-2xl bg-blue-100">
                {/* Removed blur backgrounds */}
                
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/30 border border-brand-primary/40">
                      <div className="w-3 h-3 bg-brand-primary rounded-full animate-pulse-custom"></div>
                    </div>
                    <span className="text-base font-semibold text-brand-dark">Track Your Delivery</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter tracking ID"
                        className="w-full bg-white/70 border border-brand-primary/20 rounded-xl px-5 py-4 text-brand-dark placeholder-brand-dark/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all duration-300"
                      />
                    </div>
                    
                    <button
                      onClick={handleTrackingRequest}
                      className="w-full btn btn-primary py-4 rounded-xl font-medium flex items-center justify-center shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Track via WhatsApp
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-brand-dark justify-center">
                    <MessageSquare className="w-4 h-4" />
                    <span>Receive real-time updates via WhatsApp</span>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent z-35"></div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-bounce-custom animation-duration-2s">
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse-custom"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

  {/* Download App Section */}
  <DownloadApp />

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-brand-secondary z-0"></div>
        
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-light mb-4 animate-fade-in-up">
              <span className="text-brand-dark font-medium">Powerful Features</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up" >
              Why Choose SwifttDrop
            </h2>
            
            <p className="text-xl text-brand-white max-w-3xl mx-auto animate-fade-in-up delay-100">
              Designed for speed, reliability, and convenience in the heart of Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-6xl mx-auto">
            {features.map((feature, index) => {

              
              return (
                <div 
                  key={index} 
                  className="group relative rounded-2xl p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up border border-brand-light hover:border-brand-primary overflow-hidden transform hover:-translate-y-2"
                  style={{ '--animation-delay': `${(index + 2) * 0.1}s` } as React.CSSProperties}
                >
                  {/* Background color on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-brand-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary text-white p-3 shadow-lg group-hover:shadow-xl group-hover:shadow-brand-primary/20 transition-all duration-500 z-10">
                    {feature.icon}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary">{feature.title}</h3>
                    <p className="text-brand-dark group-hover:text-brand-dark">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-section-dark z-0"></div>
        
       
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-500 to-blue-700 bg-cover bg-center z-0"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white opacity-30 animate-pulse animation-duration-3s"></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-white opacity-20 animate-pulse animation-duration-4s"></div>
        <div className="absolute top-1/3 right-1/4 w-5 h-5 rounded-full bg-white opacity-25 animate-pulse animation-duration-5s"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-white opacity-20 animate-pulse animation-duration-3-5s"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="relative group p-6 sm:p-8 rounded-2xl bg-white/20 border border-white/30 transform transition-all duration-500 hover:scale-105 hover:bg-white/30 hover:border-white/40 hover:shadow-xl"
                >
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white group-hover:text-brand-primary transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm sm:text-base group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-slate-100"></div>
        
       
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-light mb-4 animate-fade-in-up">
              <span className="text-brand-dark font-medium">Testimonials</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-brand-dark">
              What Our Users Say
            </h2>
            
            <p className="text-xl text-brand-dark max-w-3xl mx-auto animate-fade-in-up delay-100">
              Join thousands of satisfied customers, riders, and merchants
            </p>
          </div>
          
          {/* Testimonials Slider */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonials}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextTestimonials}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider Container */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
              >
                {Array.from({ length: testimonials.length - 1 }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8 px-4">
                      {testimonials.slice(slideIndex, slideIndex + 2).map((testimonial, index) => {
                        const actualIndex = slideIndex + index;
                        // Define colors based on index
                        const colors = [
                          {
                            bg: "bg-brand-primary",
                            light: "bg-brand-light",
                            accent: "brand-light"
                          },
                          {
                            bg: "bg-brand-secondary",
                            light: "bg-brand-light",
                            accent: "brand-light"
                          },
                          {
                            bg: "bg-brand-primary",
                            light: "bg-brand-light",
                            accent: "brand-light"
                          },
                          {
                            bg: "bg-brand-secondary",
                            light: "bg-brand-light",
                            accent: "brand-light"
                          }
                        ];
                        
                        const color = colors[actualIndex % colors.length];
                        
                        return (
                          <div 
                            key={actualIndex} 
                            className="group relative rounded-2xl p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-brand-light hover:border-brand-primary overflow-hidden"
                          >
                            {/* Background color on hover */}
                            <div className={`absolute inset-0 ${color.light} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <h4 className="text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors duration-300">
                                    {testimonial.name}
                                  </h4>
                                  <p className="text-brand-dark text-sm sm:text-base group-hover:text-brand-primary transition-colors duration-300">
                                    {testimonial.role}
                                  </p>
                                </div>
                                <div className="flex">
                                  {renderStars(testimonial.rating)}
                                </div>
                              </div>
                              
                              <div className="relative mb-8">
                                <div className={`absolute -top-4 -left-2 text-4xl sm:text-5xl text-brand-primary opacity-50`}>&ldquo;</div>
                                <p className="text-brand-dark relative z-10 pl-6 italic text-base sm:text-lg leading-relaxed group-hover:text-brand-dark transition-colors duration-300">
                                  {testimonial.content}
                                </p>
                                <div className={`absolute -bottom-6 -right-2 text-4xl sm:text-5xl text-brand-primary opacity-50`}>&rdquo;</div>
                              </div>
                              
                              <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300`}>
                                  {testimonial.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm text-brand-dark/60 group-hover:text-brand-dark transition-colors duration-300 flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    Verified Customer
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: testimonials.length - 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonialIndex === index 
                      ? 'bg-brand-primary scale-125' 
                      : 'bg-brand-primary/30 hover:bg-brand-primary/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={currentTestimonialIndex === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
          
            {/* Partner logos */}
            <div className="mt-20 text-center">
            <p className="text-gray-500 mb-8 text-sm uppercase tracking-wider font-medium">Trusted by local businesses across Kenya</p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
               <div className="w-24 h-12 relative">
                <Image src="/partners/ilovalue.jpg" alt="Partner Logo 1" fill className="object-contain" />
              </div>
               <div className="w-24 h-12 relative">
                <Image src="/partners/unleash.jpg" alt="Partner Logo 2" fill className="object-contain" />
              </div>
               <div className="w-24 h-12 relative">
                <Image src="/partners/trendy-baby-wear-logo.png" alt="Partner Logo 3" fill className="object-contain" />
              </div>
            </div>
            </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-blue-100"></div>
        
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-light mb-4 animate-fade-in-up">
              <span className="text-brand-dark font-medium">Pricing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-brand-dark">
              Simple, Transparent Pricing
            </h2>
            
            <p className="text-xl text-brand-dark max-w-3xl mx-auto animate-fade-in-up delay-100">
              Affordable delivery rates with no hidden fees
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 sm:gap-0 items-center">
              {/* Customer pricing card */}
              <div className="card rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-slate-100"></div>
                
                
                <div className="relative z-10 p-8 sm:p-10 md:p-12">
                  <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-brand-light/50 mb-6">
                    <span className="text-brand-dark font-medium text-sm">For Customers</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">Save More on Every Delivery</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl sm:text-6xl font-bold text-brand-primary">Save More</span>
                    <span className="ml-2 text-brand-primary">/vs competitors</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Real-time tracking via WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Cash on Delivery</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Instant M-Pesa payment options</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Delivery across all Nairobi zones</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => setActiveModal('delivery')}
                    className="btn btn-primary btn-lg group relative overflow-hidden w-full rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Package className="w-5 h-5 mr-2" />
                      Request Delivery
                    </span>
                    <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  </button>
                </div>
              </div>
              
              {/* Merchant pricing card - CENTER & BIGGER */}
              <div className="card card-dark rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up delay-50 transform md:scale-110 z-10">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-brand-primary z-0"></div>
                
                
                <div className="relative z-10 p-8 sm:p-10 md:p-12 text-white">
                  <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/30 mb-6">
                    <span className="text-white font-medium text-sm">For Merchants</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">Business Solutions</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl sm:text-6xl font-bold text-white">Free Sign Up</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">Dedicated business dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">Bulk order discounts</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">Priority support via WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">Customized delivery solutions</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => setActiveModal('merchant')}
                    className="btn btn-primary btn-lg group relative overflow-hidden w-full rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Store className="w-5 h-5 mr-2" />
                      Join as Merchant
                    </span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  </button>
                </div>
              </div>
              
              {/* Rider pricing card */}
              <div className="card rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up delay-100">
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-slate-100"></div>
                
                
                <div className="relative z-10 p-8 sm:p-10 md:p-12">
                  <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-brand-light/50 mb-6">
                    <span className="text-brand-dark font-medium text-sm">For Riders</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4">Earn More Daily</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl sm:text-6xl font-bold text-brand-primary">Earn More</span>
                    <span className="ml-2 text-brand-primary">/than others</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Instant M-Pesa payments</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Flexible working hours</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Performance bonuses</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-brand-dark">Free rider identification cards</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => setActiveModal('rider')}
                    className="btn btn-primary btn-lg group relative overflow-hidden w-full rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Join Our Network
                    </span>
                    <div className="absolute inset-0 bg-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quantify Benefits Button */}
            <div className="mt-12 text-center">
              <button 
                onClick={() => setActiveModal('benefits')}
                className="btn btn-secondary btn-lg group relative overflow-hidden rounded-xl shadow-lg mb-8"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quantify Our Benefits
                </span>
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </button>
              
              <p className="text-brand-dark max-w-3xl mx-auto">
                Need custom delivery solutions for your business? 
                <button 
                  onClick={() => setActiveModal('merchant')}
                  className="text-brand-primary font-medium ml-1 hover:text-brand-secondary focus:outline-none transition-colors"
                >
                  Contact our team
                </button> 
                for personalized pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-slate-100"></div>
        
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-light mb-4 animate-fade-in-up">
              <span className="text-brand-dark font-medium">FAQ</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-brand-dark">
              Frequently Asked Questions
            </h2>
            
            <p className="text-xl text-brand-dark max-w-3xl mx-auto animate-fade-in-up delay-100">
              Everything you need to know about SwifttDrop
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-5 sm:space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 animate-fade-in-up"
                  style={{ '--animation-delay': `${(index + 1) * 0.1}s` } as React.CSSProperties}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-white to-brand-light/50 opacity-${activeFaq === index ? '100' : '0'} transition-opacity duration-500 z-0`}></div>
                  
                  {/* Border */}
                  <div className={`absolute inset-0 rounded-2xl border ${activeFaq === index ? 'border-brand-light' : 'border-gray-200'} ${activeFaq === index ? 'shadow-lg' : ''} transition-all duration-500 z-0`}></div>
                  
                  <button
                    onClick={() => toggleFaq(index)}
                    className="relative w-full flex justify-between items-center p-6 sm:p-8 text-left transition-colors z-10"
                    aria-expanded={activeFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className={`text-lg sm:text-xl font-bold pr-4 transition-colors duration-300 ${activeFaq === index ? 'text-brand-primary' : 'text-brand-dark'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${activeFaq === index ? 'bg-brand-light text-brand-primary' : 'bg-brand-light/50 text-brand-dark'}`}>
                      {activeFaq === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  
                  <div 
                    id={`faq-answer-${index}`}
                    className={`relative px-6 sm:px-8 overflow-hidden transition-all duration-500 z-10 ${
                      activeFaq === index ? 'max-h-96 opacity-100 pb-6 sm:pb-8' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-brand-light pt-4 mt-1"></div>
                    <p className="text-base sm:text-lg text-brand-dark leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional help */}
            <div className="mt-12 text-center card card-highlight rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Still have questions?</h3>
              <p className="text-gray-700 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Reach out to our customer support team.
              </p>
              <button 
                onClick={() => window.open(`https://wa.me/${process.env.WHATSAPP_BUSINESS_NUMBER || '16018432762'}?text=I%20have%20a%20question%20about%20SwifttDrop`, '_blank')}
                className="btn btn-primary btn-md inline-flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-brand-secondary z-0"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
        
          {/* Animated particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white opacity-20 animate-pulse animation-duration-3s"></div>
          <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-white opacity-10 animate-pulse animation-duration-4s"></div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 rounded-full bg-white opacity-15 animate-pulse animation-duration-5s"></div>
          <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-white opacity-10 animate-pulse animation-duration-3-5s"></div>
          
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-white/30 border border-white/40 mb-6 animate-fade-in-up">
              <span className="text-white font-medium">Get Started Today</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white animate-fade-in-up">
              Ready to Transform Your Deliveries?
            </h2>
            
            <p className="text-xl sm:text-2xl text-white mb-10 max-w-3xl mx-auto animate-fade-in-up delay-100 leading-relaxed">
              Join thousands of customers, merchants, and riders using SwifttDrop for fast, reliable deliveries across Kenya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up delay-200">
              <button 
                onClick={() => setActiveModal('delivery')}
                className="btn btn-lg btn-outline-white group relative overflow-hidden rounded-xl shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Package className="w-6 h-6 mr-3" />
                  Create Delivery
                </span>
                <div className="absolute inset-0 bg-brand-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </button>
              
              <button 
                onClick={() => setActiveModal('simulator')}
                className="btn btn-lg btn-tertiary group relative overflow-hidden rounded-xl shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Search className="w-6 h-6 mr-3" />
                  Simulate Cost
                </span>
                <div className="absolute inset-0 bg-brand-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </button>
            </div>
            
            <p className="mt-8 text-white/90 animate-fade-in-up delay-300">
              No app download required. Everything happens via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12">
        {/* Background */}
        <div className="absolute inset-0 bg-section-dark z-0"></div>
        
      
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white opacity-30 animate-pulse animation-duration-3s"></div>
          <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-white opacity-20 animate-pulse animation-duration-4s"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white opacity-25 animate-pulse animation-duration-5s"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-white opacity-20 animate-pulse animation-duration-3-5s"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">SwifttDrop</h3>
                <div className="w-12 h-1 bg-brand-primary rounded-full"></div>
              </div>
              
              <p className="text-gray-300 mb-6 text-base leading-relaxed">
                The modern last-mile delivery platform in Kenya. Fast, reliable, and affordable deliveries via WhatsApp.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-brand-dark hover:bg-brand-secondary flex items-center justify-center text-brand-light hover:text-white transition-all duration-300 transform hover:-translate-y-1" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-dark hover:bg-brand-secondary flex items-center justify-center text-brand-light hover:text-white transition-all duration-300 transform hover:-translate-y-1" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-dark hover:bg-brand-secondary flex items-center justify-center text-brand-light hover:text-white transition-all duration-300 transform hover:-translate-y-1" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-brand-dark hover:bg-brand-secondary flex items-center justify-center text-brand-light hover:text-white transition-all duration-300 transform hover:-translate-y-1" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#hero" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-brand-neutral rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Services</h4>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => setActiveModal('delivery')} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-left"
                  >
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Create Delivery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('merchant')} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-left"
                  >
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    For Merchants
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('rider')} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-left"
                  >
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    For Riders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('simulator')} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-left"
                  >
                    <span className="w-2 h-2 bg-swift-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Delivery Calculator
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-swift-blue-900 group-hover:bg-swift-blue-800 flex items-center justify-center text-swift-blue-400 group-hover:text-white transition-all duration-300 mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">+254 736 772 050</p>
                    <p className="text-swift-blue-600/70 text-sm">Mon-Fri 8am-6pm</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-swift-blue-900 group-hover:bg-swift-blue-800 flex items-center justify-center text-swift-blue-400 group-hover:text-white transition-all duration-300 mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">info@Swifttdrop.com</p>
                    <p className="text-swift-blue-600/70 text-sm">We reply within 24 hours</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-swift-blue-900 group-hover:bg-swift-blue-800 flex items-center justify-center text-swift-blue-400 group-hover:text-white transition-all duration-300 mr-4 flex-shrink-0">
                    <LocationIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">Nairobi, Kenya</p>
                    <p className="text-swift-blue-600/70 text-sm">Serving all major neighborhoods</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-swift-blue-900 mt-12 sm:mt-16 pt-8 sm:pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-swift-blue-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SwifttDrop. All rights reserved.
              </p>
              
              <div className="flex space-x-6">
                <a href="#" className="text-swift-blue-400 hover:text-white transition-colors duration-300 text-sm">Privacy Policy</a>
                <a href="#" className="text-swift-blue-400 hover:text-white transition-colors duration-300 text-sm">Terms of Service</a>
                <a href="#" className="text-swift-blue-400 hover:text-white transition-colors duration-300 text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'delivery'} 
        onClose={() => setActiveModal(null)}
        title="Create Delivery"
        size="lg"
      >
        <DeliveryForm />
      </Modal>

      <Modal 
        isOpen={activeModal === 'merchant'} 
        onClose={() => setActiveModal(null)}
        title="Join as Merchant"
        size="lg"
      >
        <MerchantForm />
      </Modal>

      <Modal 
        isOpen={activeModal === 'rider'} 
        onClose={() => setActiveModal(null)}
        title="Become a Rider"
        size="lg"
      >
        <RiderForm />
      </Modal>

      <Modal 
        isOpen={activeModal === 'simulator'} 
        onClose={() => setActiveModal(null)}
        title="Delivery Cost Simulator"
        size="md"
      >
        <DeliverySimulator />
      </Modal>

      <Modal 
        isOpen={activeModal === 'benefits'} 
        onClose={() => setActiveModal(null)}
        title="Quantify Our Benefits"
        size="xl"
      >
        <BenefitsModal onModalChange={setActiveModal} />
      </Modal>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
    </div>
  );
}