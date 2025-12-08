'use client';

// Fixed imports to avoid duplicate Package declaration
import { useState } from 'react';
// Renamed Package to PackageIcon to avoid naming conflicts
import { Send, MapPin, Phone, AlertCircle, Package as PackageIcon, CheckCircle } from 'lucide-react';
import Loader from './Loader';

export default function DeliveryForm() {
  const [formData, setFormData] = useState({
    pickupName: '',
    pickupPhone: '',
    pickupLocation: '',
    dropoffName: '',
    dropoffPhone: '',
    dropoffLocation: '',
    itemType: '',
    instructions: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.pickupName.trim()) errors.pickupName = "Pickup contact name is required";
    if (!formData.pickupPhone.trim()) errors.pickupPhone = "Pickup phone number is required";
    if (!formData.pickupLocation.trim()) errors.pickupLocation = "Pickup location is required";
    if (!formData.dropoffName.trim()) errors.dropoffName = "Dropoff contact name is required";
    if (!formData.dropoffPhone.trim()) errors.dropoffPhone = "Dropoff phone number is required";
    if (!formData.dropoffLocation.trim()) errors.dropoffLocation = "Dropoff location is required";
    if (!formData.itemType) errors.itemType = "Please select an item type";
    
    // Phone number validation (simple check for Kenya format)
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    if (formData.pickupPhone && !phoneRegex.test(formData.pickupPhone)) {
      errors.pickupPhone = "Please enter a valid Kenyan phone number";
    }
    if (formData.dropoffPhone && !phoneRegex.test(formData.dropoffPhone)) {
      errors.dropoffPhone = "Please enter a valid Kenyan phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    // Format WhatsApp message directly
    const requestId = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const whatsappMessage = `
🚚 NEW DELIVERY REQUEST

📍 PICKUP DETAILS
• Location: ${formData.pickupLocation}
• Contact: ${formData.pickupName}
• Phone: ${formData.pickupPhone}

📍 DROPOFF DETAILS  
• Location: ${formData.dropoffLocation}
• Contact: ${formData.dropoffName}
• Phone: ${formData.dropoffPhone}

📦 PACKAGE DETAILS
• Item Type: ${formData.itemType}
${formData.instructions ? `• Instructions: ${formData.instructions}` : ''}

🆔 Request ID: ${requestId}
⏰ Time: ${timestamp}

Please confirm this delivery request.
`.trim();

    // Open WhatsApp with the formatted message
    const phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '16018432762';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    try {
      // Send data to API endpoint (without waiting for WhatsApp URL)
      const response = await fetch('/api/delivery', {
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
        throw new Error(result.error || 'Failed to submit delivery request');
      }

      // Success - show success message
      setSubmitStatus('success');
      setSubmitMessage(`Delivery request submitted successfully! Request ID: ${requestId}`);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          pickupName: '',
          pickupPhone: '',
          pickupLocation: '',
          dropoffName: '',
          dropoffPhone: '',
          dropoffLocation: '',
          itemType: '',
          instructions: ''
        });
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Delivery submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to submit delivery request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pickup Details */}
        <div className="space-y-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-swift-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-swift-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Pickup Details</h4>
          </div>
          
          <div>
            <label htmlFor="pickupName" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name*
            </label>
            <input
              type="text"
              id="pickupName"
              name="pickupName"
              value={formData.pickupName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                formErrors.pickupName 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                  : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
              } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
              placeholder="e.g. John Doe"
            />
            {formErrors.pickupName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.pickupName}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="pickupPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="pickupPhone"
                name="pickupPhone"
                value={formData.pickupPhone}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  formErrors.pickupPhone 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                    : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
                } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
                placeholder="e.g. 0712345678"
              />
            </div>
            {formErrors.pickupPhone && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.pickupPhone}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location*
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                formErrors.pickupLocation 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                  : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
              } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
              placeholder="e.g. Westlands, Nairobi"
            />
            {formErrors.pickupLocation && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.pickupLocation}
              </p>
            )}
          </div>
        </div>
        
        {/* Dropoff Details */}
        <div className="space-y-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-swift-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-swift-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Dropoff Details</h4>
          </div>
          
          <div>
            <label htmlFor="dropoffName" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name*
            </label>
            <input
              type="text"
              id="dropoffName"
              name="dropoffName"
              value={formData.dropoffName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                formErrors.dropoffName 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                  : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
              } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
              placeholder="e.g. Jane Doe"
            />
            {formErrors.dropoffName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.dropoffName}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="dropoffPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="dropoffPhone"
                name="dropoffPhone"
                value={formData.dropoffPhone}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  formErrors.dropoffPhone 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                    : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
                } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
                placeholder="e.g. 0712345678"
              />
            </div>
            {formErrors.dropoffPhone && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.dropoffPhone}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Dropoff Location*
            </label>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                formErrors.dropoffLocation 
                  ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                  : 'border-gray-300 focus:ring-swift-blue-500 hover:border-swift-blue-300 text-gray-800'
              } focus:border-transparent focus:ring-2 transition-all duration-300 placeholder-gray-600`}
              placeholder="e.g. Kilimani, Nairobi"
            />
            {formErrors.dropoffLocation && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.dropoffLocation}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Package Details */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
            <PackageIcon className="w-5 h-5 text-brand-primary" />
          </div>
          <h4 className="text-lg font-bold text-gray-800">Package Details</h4>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="itemType" className="block text-sm font-medium text-gray-700 mb-2">
              Item Type*
            </label>
            <div className="relative">
              <select
                id="itemType"
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border appearance-none bg-white ${
                  formErrors.itemType 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 text-red-800' 
                    : 'border-gray-300 focus:ring-brand-primary hover:border-brand-light text-gray-800'
                } focus:border-transparent focus:ring-2 transition-all duration-300`}
              >
                <option value="" className="text-gray-600">Select Item Type</option>
                <option value="Document">Document</option>
                <option value="Small Package">Small Package</option>
                <option value="Medium Package">Medium Package</option>
                <option value="Large Package">Large Package</option>
                <option value="Food">Food</option>
                <option value="Fragile Item">Fragile Item</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {formErrors.itemType && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {formErrors.itemType}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent hover:border-brand-light transition-all duration-300 placeholder-gray-600 text-gray-800"
              placeholder="Any special instructions for the delivery"
            ></textarea>
          </div>
        </div>
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

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-dark'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader size="sm" className="mr-2" />
              Processing...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Request Submitted
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Request Delivery Now
            </>
          )}
        </button>
        
        <p className="mt-4 text-sm text-gray-500 text-center">
          By clicking &quot;Request Delivery Now&quot;, your request will be sent to our system and you&apos;ll be redirected to WhatsApp for confirmation.
        </p>
      </div>
    </form>
  );
}