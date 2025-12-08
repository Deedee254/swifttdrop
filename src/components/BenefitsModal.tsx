'use client';

import { useState } from 'react';
import { Search, Truck, Store, AlertTriangle } from 'lucide-react';

interface BenefitsModalProps {
  onModalChange: (modal: 'delivery' | 'merchant' | 'rider' | 'simulator' | 'benefits' | null) => void;
}

export default function BenefitsModal({ onModalChange }: BenefitsModalProps) {
  const [activeTab, setActiveTab] = useState<'simulate' | 'rider' | 'merchant'>('simulate');
  
  // Simulate Cost Calculator State
  const [simulateData, setSimulateData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    itemType: 'Small Package',
    distance: 5
  });
  
  // Rider Earnings Calculator State
  const [riderData, setRiderData] = useState({
    deliveriesPerDay: 8,
    workingDaysPerWeek: 6
  });
  
  // Merchant Savings Calculator State
  const [merchantData, setMerchantData] = useState({
    monthlyDeliveries: 30,
    currentCostPerDelivery: 200
  });

  // Calculate delivery cost based on distance and item type
  const calculateDeliveryCost = () => {
    const baseCost = 150;
    const distanceMultiplier = simulateData.distance * 10;
    const itemMultiplier = simulateData.itemType === 'Large Package' ? 50 : 
                          simulateData.itemType === 'Medium Package' ? 25 : 0;
    return baseCost + distanceMultiplier + itemMultiplier;
  };

  // Calculate rider earnings
  const calculateRiderEarnings = () => {
    const dailyEarnings = riderData.deliveriesPerDay * 100; // 100 KES per delivery
    const weeklyEarnings = dailyEarnings * riderData.workingDaysPerWeek;
    const monthlyEarnings = weeklyEarnings * 4; // Approximate monthly
    
    return {
      daily: dailyEarnings,
      weekly: weeklyEarnings,
      monthly: monthlyEarnings
    };
  };

  // Calculate merchant savings
  const calculateMerchantSavings = () => {
    const currentTotal = merchantData.monthlyDeliveries * merchantData.currentCostPerDelivery;
    const swifttDropTotal = merchantData.monthlyDeliveries * 150; // SwifttDrop rate
    const savings = currentTotal - swifttDropTotal;
    const savingsPercentage = ((savings / currentTotal) * 100).toFixed(1);
    
    return {
      currentTotal,
      swifttDropTotal,
      savings,
      savingsPercentage
    };
  };

  const deliveryCost = calculateDeliveryCost();
  const riderEarnings = calculateRiderEarnings();
  const merchantSavings = calculateMerchantSavings();

  const tabs = [
    { 
      id: 'simulate', 
      label: 'Simulate Cost', 
      shortLabel: 'Cost',
      icon: <Search className="w-4 h-4" /> 
    },
    { 
      id: 'rider', 
      label: 'Rider Earnings', 
      shortLabel: 'Earnings',
      icon: <Truck className="w-4 h-4" /> 
    },
    { 
      id: 'merchant', 
      label: 'Merchant Savings', 
      shortLabel: 'Savings',
      icon: <Store className="w-4 h-4" /> 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Simulation Notice</p>
            <p>These are estimated calculations and are subject to change. For real prices and accurate quotes, please register with us or request a delivery.</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Improved for mobile */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'simulate' | 'rider' | 'merchant')}
            className={`flex-1 min-w-0 flex items-center justify-center py-2 sm:py-3 px-1 xs:px-2 sm:px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <span className="flex-shrink-0">{tab.icon}</span>
              <span className="hidden xs:inline text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">{tab.label}</span>
              <span className="xs:hidden text-xs whitespace-nowrap overflow-hidden text-ellipsis">{tab.shortLabel}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'simulate' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Cost Simulator</h3>
              <p className="text-gray-600">Get an estimate for your delivery cost</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={simulateData.pickupLocation}
                  onChange={(e) => setSimulateData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-600 text-gray-800"
                  placeholder="e.g. Westlands, Nairobi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  value={simulateData.dropoffLocation}
                  onChange={(e) => setSimulateData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-600 text-gray-800"
                  placeholder="e.g. Kilimani, Nairobi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="item-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type
                </label>
                <select
                  id="item-type"
                  value={simulateData.itemType}
                  onChange={(e) => setSimulateData(prev => ({ ...prev, itemType: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-gray-800"
                >
                  <option value="Small Package">Small Package</option>
                  <option value="Medium Package">Medium Package</option>
                  <option value="Large Package">Large Package</option>
                  <option value="Document">Document</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Distance (km)
                </label>
                <input
                  id="distance"
                  type="range"
                  min="1"
                  max="20"
                  value={simulateData.distance}
                  onChange={(e) => setSimulateData(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1km</span>
                  <span className="font-medium text-brand-primary">{simulateData.distance}km</span>
                  <span>20km</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-light rounded-xl p-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Estimated Cost</h4>
              <div className="text-3xl font-bold text-brand-primary">
                KSh {deliveryCost.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Base rate: KSh 150 + Distance: KSh {simulateData.distance * 10} + Item type surcharge
              </p>
              
              <button
                onClick={() => onModalChange('delivery')}
                className="mt-4 w-full bg-brand-primary hover:bg-brand-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Request This Delivery
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rider' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rider Earnings Calculator</h3>
              <p className="text-gray-600">Calculate your potential earnings as a SwifttDrop rider</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deliveries-per-day" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Deliveries Per Day
                </label>
                <input
                  id="deliveries-per-day"
                  type="range"
                  min="1"
                  max="20"
                  value={riderData.deliveriesPerDay}
                  onChange={(e) => setRiderData(prev => ({ ...prev, deliveriesPerDay: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1</span>
                  <span className="font-medium text-brand-primary">{riderData.deliveriesPerDay} deliveries</span>
                  <span>20</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="working-days-per-week" className="block text-sm font-medium text-gray-700 mb-2">
                  Working Days Per Week
                </label>
                <input
                  id="working-days-per-week"
                  type="range"
                  min="1"
                  max="7"
                  value={riderData.workingDaysPerWeek}
                  onChange={(e) => setRiderData(prev => ({ ...prev, workingDaysPerWeek: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1</span>
                  <span className="font-medium text-brand-primary">{riderData.workingDaysPerWeek} days</span>
                  <span>7</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-light rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Potential Earnings</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-brand-primary">
                    KSh {riderEarnings.daily.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Daily</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-brand-primary">
                    KSh {riderEarnings.weekly.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Weekly</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-brand-primary">
                    KSh {riderEarnings.monthly.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Monthly</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center mt-4">
                Based on KSh 100 per delivery + bonuses and incentives
              </p>
              
              <button
                onClick={() => onModalChange('rider')}
                className="mt-6 w-full bg-green-600 hover:bg-brand-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <Truck className="w-5 h-5 mr-2" />
                Join Our Delivery Network
              </button>
            </div>
          </div>
        )}

        {activeTab === 'merchant' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Merchant Savings Calculator</h3>
              <p className="text-gray-600">See how much you can save by switching to SwifttDrop</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Deliveries
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={merchantData.monthlyDeliveries}
                  onChange={(e) => setMerchantData(prev => ({ ...prev, monthlyDeliveries: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-600 text-gray-800"
                  placeholder="e.g. 30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Cost Per Delivery (KSh)
                </label>
                <input
                  type="number"
                  min="100"
                  max="1000"
                  value={merchantData.currentCostPerDelivery}
                  onChange={(e) => setMerchantData(prev => ({ ...prev, currentCostPerDelivery: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-600 text-gray-800"
                  placeholder="e.g. 200"
                />
              </div>
            </div>

            <div className="bg-brand-light rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Monthly Savings Breakdown</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Current monthly cost:</span>
                  <span className="font-semibold text-gray-900">KSh {merchantSavings.currentTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">SwifttDrop monthly cost:</span>
                  <span className="font-semibold text-green-600">KSh {merchantSavings.swifttDropTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-800 font-medium">Total Monthly Savings:</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">KSh {merchantSavings.savings.toLocaleString()}</div>
                    <div className="text-sm text-green-600">({merchantSavings.savingsPercentage}% savings)</div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 text-center mt-4">
                Based on SwifttDrop&apos;s competitive rate of KSh 150 per delivery
              </p>
              
              <button
                onClick={() => onModalChange('merchant')}
                className="mt-6 w-full bg-brand-dark hover:bg-brand-secondary text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <Store className="w-5 h-5 mr-2" />
                Start Your Business Partnership
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}