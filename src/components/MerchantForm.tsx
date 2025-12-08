'use client';

import { useState } from 'react';
import { Send, Store, CheckCircle, AlertCircle } from 'lucide-react';

export default function MerchantForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    location: '',
    businessType: '',
    deliveriesPerMonth: '30'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    // Format WhatsApp message directly
    const requestId = `MER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const whatsappMessage = `
🏪 NEW MERCHANT REGISTRATION

🏢 BUSINESS DETAILS
• Business Name: ${formData.businessName}
• Business Type: ${formData.businessType}
• Location: ${formData.location}
• Expected Deliveries: ${formData.deliveriesPerMonth}/month

👤 CONTACT DETAILS
• Contact Person: ${formData.contactName}
• Phone: ${formData.phone}
• Email: ${formData.email}

🆔 Registration ID: ${requestId}
⏰ Time: ${timestamp}

Please follow up with this merchant registration.
`.trim();

    // Open WhatsApp with the formatted message
    const phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '254725264955';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    try {
      // Send data to API endpoint (without waiting for WhatsApp URL)
      const response = await fetch('/api/merchant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requestId,
          timestamp
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit merchant registration');
      }

      // Success - show success message
      setSubmitStatus('success');
      setSubmitMessage(`Registration submitted successfully! Request ID: ${requestId}`);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          businessName: '',
          contactName: '',
          phone: '',
          email: '',
          location: '',
          businessType: '',
          deliveriesPerMonth: '30'
        });
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Merchant registration error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <Store className="w-5 h-5 mr-2 text-blue-600" />
          Business Information
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
              placeholder="e.g. Tasty Delights Restaurant"
              required
            />
          </div>
          
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
              placeholder="e.g. John Kamau"
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
              placeholder="e.g. 0712345678"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
              placeholder="e.g. john@business.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Business Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
            placeholder="e.g. Westlands, Nairobi"
            required
          />
        </div>
        
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800"
            required
          >
            <option value="" className="text-gray-600">Select Business Type</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Grocery Store">Grocery Store</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Electronics Store">Electronics Store</option>
            <option value="Fashion Boutique">Fashion Boutique</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6">
        <label htmlFor="deliveriesPerMonth" className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Deliveries Per Month
        </label>
        <input
          type="number"
          id="deliveriesPerMonth"
          name="deliveriesPerMonth"
          value={formData.deliveriesPerMonth}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 text-gray-800"
          placeholder="e.g. 30"
          min="1"
          required
        />
      </div>
      
      {/* Status Message */}
      {submitMessage && (
        <div className={`p-4 rounded-xl border ${
          submitStatus === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {submitStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{submitMessage}</p>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-dark'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : submitStatus === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Registration Submitted
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Start Your Business Partnership
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        By clicking &quot;Start Your Business Partnership&quot;, your registration will be sent to our system and you&apos;ll be redirected to WhatsApp for confirmation.
      </p>
    </form>
  );
}