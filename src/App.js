import React, { useState } from 'react';
import { Sun, Moon, Calculator, RotateCcw, Users, Fuel, IndianRupee, ArrowRight, Share2, MapPin, Route } from 'lucide-react';

export default function TripTally() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [totalKm, setTotalKm] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tripName, setTripName] = useState('');
  const [result, setResult] = useState(null);

  // Refs for input fields
  const tripNameRef = React.useRef(null);
  const totalKmRef = React.useRef(null);
  const peopleCountRef = React.useRef(null);
  const mileageRef = React.useRef(null);
  const fuelPriceRef = React.useRef(null);

  // State for focused card only
  const [focusedCard, setFocusedCard] = useState(null);

  // Helper to determine if a card should be highlighted
  const isCardActive = (card) => focusedCard === card;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const calculateFuel = () => {
    if (!totalKm || !peopleCount || !mileage || !fuelPrice) {
      return;
    }

    const km = parseFloat(totalKm);
    const people = parseInt(peopleCount);
    const vehicleMileage = parseFloat(mileage);
    const pricePerLiter = parseFloat(fuelPrice);

    if (km <= 0 || people <= 0 || vehicleMileage <= 0 || pricePerLiter <= 0) {
      return;
    }

    const fuelNeeded = km / vehicleMileage;
    const totalCost = fuelNeeded * pricePerLiter;
    const costPerPerson = totalCost / people;

    setResult({
      fuelNeeded: fuelNeeded.toFixed(2),
      totalCost: totalCost.toFixed(2),
      costPerPerson: costPerPerson.toFixed(2),
      tripName: tripName || 'Trip'
    });
  };

  const resetCalculator = () => {
    setTotalKm('');
    setPeopleCount('');
    setMileage('');
    setFuelPrice('');
    setTripName('');
    setResult(null);
  };

  const shareResults = async () => {
    const shareText = `💰 ${result.tripName} Cost Breakdown
    
👥 Per Person: ₹${result.costPerPerson}
⛽ Fuel Needed: ${result.fuelNeeded}L
💵 Total Cost: ₹${result.totalCost}
📏 Distance: ${totalKm}km
👤 People: ${peopleCount}

Calculated with Trip Tally 🚗`;

    try {
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: `${result.tripName} - Trip Cost Breakdown`,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Trip breakdown copied to clipboard!');
      }
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Trip breakdown copied to clipboard!');
    }
  };

  const isFormValid = totalKm && peopleCount && mileage && fuelPrice;

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500" style={{
      backgroundColor: isDarkMode ? '#0A0A0A' : '#F8FAFC'
    }}>
      
      {/* Sticky Glassmorphic Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500" style={{
        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(248, 250, 252, 0.8)',
        borderBottomColor: isDarkMode ? '#1D1D1D' : '#E2E8F0'
      }}>
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{
                backgroundColor: isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: isDarkMode ? '1px solid rgba(29, 29, 29, 0.5)' : '1px solid rgba(226, 232, 240, 0.5)'
              }}>
                <Calculator className="h-5 w-5 text-orange-500" />
              </div>
              <button
                onClick={resetCalculator}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <h1 className={`text-3xl font-bold tracking-wide ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`} style={{
                  fontFamily: "'Dancing Script', cursive"
                }}>
                  Trip Tally<span className="text-orange-500">.</span>
                </h1>
              </button>
            </div>
            
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              style={{
                backgroundColor: isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: isDarkMode ? '1px solid rgba(29, 29, 29, 0.5)' : '1px solid rgba(226, 232, 240, 0.5)'
              }}
              onMouseEnter={(e) => {
                if (isDarkMode) {
                  e.target.style.backgroundColor = 'rgba(31, 31, 31, 0.9)';
                } else {
                  e.target.style.backgroundColor = 'rgba(241, 245, 249, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)';
              }}
            >
              {isDarkMode ? 
                <Sun className="h-4 w-4 text-amber-400" /> : 
                <Moon className="h-4 w-4 text-gray-600" />
              }
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-8 pt-6">
        
        {!result ? (
          <div className="space-y-6">
            <div className="space-y-4">
              
              {/* Trip Name Input */}
              <div 
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${isCardActive('tripName') ? (isDarkMode ? 'ring-2 ring-orange-500 bg-[#18120b]' : 'ring-2 ring-orange-500 bg-orange-50') : ''}`} 
                style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => tripNameRef.current?.focus()}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: isDarkMode ? '#1F1F1F' : '#F1F5F9'
                  }}>
                    <Route className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Trip Name
                  </span>
                </div>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Weekend Getaway"
                  className={`w-full bg-transparent text-2xl font-light placeholder-gray-400 focus:outline-none ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                  ref={tripNameRef}
                  style={{ outline: 'none' }}
                  onFocus={() => setFocusedCard('tripName')}
                  onBlur={() => setFocusedCard(null)}
                />
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  optional
                </div>
              </div>
              
              {/* Distance Input */}
              <div 
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${isCardActive('distance') ? (isDarkMode ? 'ring-2 ring-orange-500 bg-[#18120b]' : 'ring-2 ring-orange-500 bg-orange-50') : ''}`} 
                style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => totalKmRef.current?.focus()}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: isDarkMode ? '#1F1F1F' : '#F9FAFB'
                  }}>
                    <MapPin className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Distance
                  </span>
                </div>
                <input
                  type="number"
                  value={totalKm}
                  onChange={(e) => setTotalKm(e.target.value)}
                  placeholder="0"
                  className={`w-full bg-transparent text-2xl font-light placeholder-gray-400 focus:outline-none ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  ref={totalKmRef}
                  style={{ outline: 'none' }}
                  onFocus={() => setFocusedCard('distance')}
                  onBlur={() => setFocusedCard(null)}
                />
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  kilometers
                </div>
              </div>

              {/* People Count Input */}
              <div 
                className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${isCardActive('people') ? (isDarkMode ? 'ring-2 ring-orange-500 bg-[#18120b]' : 'ring-2 ring-orange-500 bg-orange-50') : ''}`} 
                style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => peopleCountRef.current?.focus()}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: isDarkMode ? '#1F1F1F' : '#F9FAFB'
                  }}>
                    <Users className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    People
                  </span>
                </div>
                <input
                  type="number"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  placeholder="0"
                  className={`w-full bg-transparent text-2xl font-light placeholder-gray-400 focus:outline-none ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  ref={peopleCountRef}
                  style={{ outline: 'none' }}
                  onFocus={() => setFocusedCard('people')}
                  onBlur={() => setFocusedCard(null)}
                />
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  passengers
                </div>
              </div>

              {/* Mileage and Fuel Price Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${isCardActive('mileage') ? (isDarkMode ? 'ring-2 ring-orange-500 bg-[#18120b]' : 'ring-2 ring-orange-500 bg-orange-50') : ''}`} 
                  style={{
                    backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                    boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => mileageRef.current?.focus()}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      backgroundColor: isDarkMode ? '#1F1F1F' : '#F9FAFB'
                    }}>
                      <Fuel className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Mileage
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="0.0"
                    className={`w-full bg-transparent text-lg font-light placeholder-gray-400 focus:outline-none ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    ref={mileageRef}
                    style={{ outline: 'none' }}
                    onFocus={() => setFocusedCard('mileage')}
                    onBlur={() => setFocusedCard(null)}
                  />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    km/L
                  </div>
                </div>

                <div 
                  className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${isCardActive('fuelPrice') ? (isDarkMode ? 'ring-2 ring-orange-500 bg-[#18120b]' : 'ring-2 ring-orange-500 bg-orange-50') : ''}`} 
                  style={{
                    backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                    boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => fuelPriceRef.current?.focus()}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      backgroundColor: isDarkMode ? '#1F1F1F' : '#F9FAFB'
                    }}>
                      <IndianRupee className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Fuel Price
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-transparent text-lg font-light placeholder-gray-400 focus:outline-none ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    ref={fuelPriceRef}
                    style={{ outline: 'none' }}
                    onFocus={() => setFocusedCard('fuelPrice')}
                    onBlur={() => setFocusedCard(null)}
                  />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    ₹/liter
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="pt-4">
              <button
                onClick={calculateFuel}
                disabled={!isFormValid}
                className={`w-full h-14 rounded-lg font-medium text-base transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isFormValid ? 'hover:bg-orange-600 active:scale-98' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: isFormValid ? '#F97315' : (isDarkMode ? '#1F1F1F' : '#F1F5F9'),
                  color: isFormValid ? '#ffffff' : (isDarkMode ? '#6b7280' : '#64748B'),
                  boxShadow: isFormValid && !isDarkMode ? '0 4px 12px rgba(249, 115, 21, 0.15)' : 'none'
                }}
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate Trip Cost</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {result.tripName} Breakdown
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Cost analysis for your journey
              </p>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              
              {/* Primary Result - Cost Per Person */}
              <div className="rounded-xl p-6 border-2" style={{
                backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                borderColor: '#F97315',
                boxShadow: isDarkMode ? 'none' : '0 8px 25px rgba(249, 115, 21, 0.1)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-orange-500" />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        Per Person
                      </span>
                    </div>
                    <div className={`text-4xl font-light tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      ₹{result.costPerPerson}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200" 
                    style={{
                      backgroundColor: 'rgba(249, 115, 21, 0.1)'
                    }}
                    onClick={shareResults}
                  >
                    <Share2 className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Secondary Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Fuel className="h-4 w-4 text-orange-500" />
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      Fuel Needed
                    </span>
                  </div>
                  <div className={`text-xl font-light ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {result.fuelNeeded}L
                  </div>
                </div>

                <div className="rounded-lg p-4" style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="h-4 w-4 text-orange-500" />
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Total Cost
                    </span>
                  </div>
                  <div className={`text-xl font-light ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ₹{result.totalCost}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4">
              <button
                onClick={resetCalculator}
                className="w-full h-12 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: isDarkMode ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#1D1D1D' : '#E2E8F0'}`,
                  color: isDarkMode ? '#cbd5e1' : '#64748B',
                  boxShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (isDarkMode) {
                    e.target.style.backgroundColor = '#1F1F1F';
                  } else {
                    e.target.style.backgroundColor = '#F1F5F9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#141414' : '#FFFFFF';
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>New Calculation</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 pb-8">
        <div className="text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            Made with ❤️ by{' '}
            <a 
              href="https://www.linkedin.com/in/anin-arafath" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-colors duration-200 font-medium"
            >
              aninarafath
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
