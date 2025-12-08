'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send, MapPin, Package as PackageIcon, Clock, AlertCircle } from 'lucide-react';
import Loader from './Loader';

export default function DeliverySimulator() {
  const [formData, setFormData] = useState({
    pickupZone: '',
    dropoffZone: '',
    itemWeight: '0-5',
    deliverySpeed: 'standard',
  });
  
  const [price, setPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [weightSurcharge, setWeightSurcharge] = useState(0);
  const [speedSurcharge, setSpeedSurcharge] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  // Define calculatePrice with useCallback to memoize the function
  const calculatePrice = useCallback(() => {
    if (!formData.pickupZone || !formData.dropoffZone) {
      setPrice(0);
      setBasePrice(0);
      setWeightSurcharge(0);
      setSpeedSurcharge(0);
      return;
    }
    
    // Base pricing by zone combinations
    const zoneMatrix: Record<string, Record<string, number>> = {
      'CBD': {
        'CBD': 150,
        'Westlands': 200,
        'Kilimani': 200,
        'Eastlands': 250,
        'Karen': 350,
      },
      'Westlands': {
        'CBD': 200,
        'Westlands': 150,
        'Kilimani': 200,
        'Eastlands': 300,
        'Karen': 300,
      },
      'Kilimani': {
        'CBD': 200,
        'Westlands': 200,
        'Kilimani': 150,
        'Eastlands': 300,
        'Karen': 250,
      },
      'Eastlands': {
        'CBD': 250,
        'Westlands': 300,
        'Kilimani': 300,
        'Eastlands': 150,
        'Karen': 400,
      },
      'Karen': {
        'CBD': 350,
        'Westlands': 300,
        'Kilimani': 250,
        'Eastlands': 400,
        'Karen': 150,
      },
    };
    
    // Get base price from matrix
    const calculatedBasePrice = zoneMatrix[formData.pickupZone][formData.dropoffZone] || 300;
    setBasePrice(calculatedBasePrice);
    
    // Add weight surcharge
    const calculatedWeightSurcharge = {
      '0-5': 0,
      '5-10': 50,
      '10-20': 100,
      '20+': 200,
    }[formData.itemWeight] || 0;
    setWeightSurcharge(calculatedWeightSurcharge);
    
    // Add speed surcharge
    const calculatedSpeedSurcharge = {
      'standard': 0,
      'express': 100,
      'priority': 200,
    }[formData.deliverySpeed] || 0;
    setSpeedSurcharge(calculatedSpeedSurcharge);
  }, [formData.pickupZone, formData.dropoffZone, formData.itemWeight, formData.deliverySpeed]);
  
  // Effect to calculate price when dependencies change
  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.pickupZone) errors.pickupZone = "Please select a pickup zone";
    if (!formData.dropoffZone) errors.dropoffZone = "Please select a dropoff zone";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Format the WhatsApp message
    const message = `
DELIVERY PRICE INQUIRY
Pickup Zone: ${formData.pickupZone}
Dropoff Zone: ${formData.dropoffZone}
Item Weight: ${formData.itemWeight} kg
Delivery Speed: ${formData.deliverySpeed.charAt(0).toUpperCase() + formData.deliverySpeed.slice(1)}
Estimated Price: KSh ${price}

I'd like to place this delivery order.
    `.trim();
    
    // Open WhatsApp with the formatted message
    const phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '254725264955';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Small delay to show loading state
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    }, 500);
  };

  // Get estimated delivery time based on speed
  const getEstimatedTime = () => {
    if (!formData.pickupZone || !formData.dropoffZone) return '';
    
    switch(formData.deliverySpeed) {
      case 'priority':
        return '30-60 minutes';
      case 'express':
        return '1-2 hours';
      default:
        return '2-4 hours';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Delivery Zones
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupZone" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Zone*
            </label>
            <select
              id="pickupZone"
              name="pickupZone"
              value={formData.pickupZone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.pickupZone ? 'border-red-500 bg-red-50 text-red-800' : 'border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            >
              <option value="" className="text-gray-600">Select Pickup Zone</option>
              <option value="CBD">CBD</option>
              <option value="Westlands">Westlands</option>
              <option value="Kilimani">Kilimani</option>
              <option value="Eastlands">Eastlands</option>
              <option value="Karen">Karen</option>
            </select>
            {formErrors.pickupZone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.pickupZone}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="dropoffZone" className="block text-sm font-medium text-gray-700 mb-1">
              Dropoff Zone*
            </label>
            <select
              id="dropoffZone"
              name="dropoffZone"
              value={formData.dropoffZone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${formErrors.dropoffZone ? 'border-red-500 bg-red-50 text-red-800' : 'border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            >
              <option value="" className="text-gray-600">Select Dropoff Zone</option>
              <option value="CBD">CBD</option>
              <option value="Westlands">Westlands</option>
              <option value="Kilimani">Kilimani</option>
              <option value="Eastlands">Eastlands</option>
              <option value="Karen">Karen</option>
            </select>
            {formErrors.dropoffZone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.dropoffZone}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="itemWeight" className="block text-sm font-medium text-gray-700 mb-1">
              Item Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <PackageIcon className="w-4 h-4 text-gray-500" />
              </div>
              <select
                id="itemWeight"
                name="itemWeight"
                value={formData.itemWeight}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800"
              >
                <option value="0-5">0-5 kg</option>
                <option value="5-10">5-10 kg</option>
                <option value="10-20">10-20 kg</option>
                <option value="20+">20+ kg</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="deliverySpeed" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Speed
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <select
                id="deliverySpeed"
                name="deliverySpeed"
                value={formData.deliverySpeed}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800"
              >
                <option value="standard">Standard (2-4 hours)</option>
                <option value="express">Express (1-2 hours)</option>
                <option value="priority">Priority (30-60 min)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 rounded-xl p-6 transition-all duration-300">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Estimated Delivery Cost</h4>
          <div className={`text-3xl font-bold text-green-600 transition-all duration-300 ${price > 0 ? 'scale-110' : ''}`}>
            {price > 0 ? `KSh ${price.toLocaleString()}` : '—'}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {formData.pickupZone && formData.dropoffZone ? 
              `From ${formData.pickupZone} to ${formData.dropoffZone}` : 
              'Select zones to see pricing'}
          </p>
          {price > 0 && (
            <p className="text-sm font-medium text-blue-600 mt-1">
              Estimated delivery time: {getEstimatedTime()}
            </p>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base delivery fee:</span>
            <span className="font-semibold text-gray-900">
              {basePrice > 0 ? `KSh ${basePrice.toLocaleString()}` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Weight surcharge:</span>
            <span className="font-semibold text-gray-900">
              {weightSurcharge > 0 ? `KSh ${weightSurcharge.toLocaleString()}` : 'KSh 0'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Speed surcharge:</span>
            <span className="font-semibold text-gray-900">
              {speedSurcharge > 0 ? `KSh ${speedSurcharge.toLocaleString()}` : 'KSh 0'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>* Prices are estimates and may vary based on actual distance and traffic conditions.</p>
          <p>* Additional fees may apply for waiting time or special handling.</p>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-swift-blue-600 hover:bg-brand-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <Loader size="sm" className="mr-3" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Place Order via WhatsApp
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        By clicking &quot;Place Order&quot;, you&apos;ll be redirected to WhatsApp to complete your delivery request.
      </p>
    </form>
  );
}