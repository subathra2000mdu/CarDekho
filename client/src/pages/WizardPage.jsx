import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations } from '../services/api';
import CarCard from '../components/cards/CarCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WizardPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [preferences, setPreferences] = useState({
    budget: { min: 5, max: 20 },
    bodyTypes: [],
    fuelTypes: [],
    seating: 5,
    priorities: {
      mileage: 3,
      safety: 3,
      performance: 3,
      features: 3,
      budget: 3,
    },
  });

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await getRecommendations(preferences);
      setResults(data);
      setStep(6); // Results step
    } catch (error) {
      console.error('Recommendation failed', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setPreferences((prev) => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  // Step 1: Budget
  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">What's your budget?</h2>
      <p className="text-gray-400 mb-8">We'll show you the best options within your price range.</p>
      
      <div className="glass-card p-8 mb-8">
        <div className="flex justify-between items-end mb-6 text-2xl font-bold text-primary-400">
          <span>₹{preferences.budget.min}L</span>
          <span className="text-gray-500 text-lg">to</span>
          <span>₹{preferences.budget.max}L</span>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Minimum Budget (Lakhs)</label>
            <input 
              type="range" 
              min="3" 
              max="50" 
              step="1"
              value={preferences.budget.min}
              onChange={(e) => setPreferences(prev => ({ ...prev, budget: { ...prev.budget, min: parseInt(e.target.value) } }))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Maximum Budget (Lakhs)</label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="1"
              value={preferences.budget.max}
              onChange={(e) => setPreferences(prev => ({ ...prev, budget: { ...prev.budget, max: parseInt(e.target.value) } }))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Body Type
  const renderStep2 = () => {
    const types = [
      { id: 'Hatchback', label: 'Hatchback', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Compact & City friendly' },
      { id: 'Sedan', label: 'Sedan', icon: 'M8 7h8M4 11h16M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z', desc: 'Comfort & Boot space' },
      { id: 'SUV', label: 'SUV', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', desc: 'High ground clearance' },
      { id: 'MPV', label: 'MPV', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', desc: 'Maximum seating' },
    ];

    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">Preferred body types?</h2>
        <p className="text-gray-400 mb-8">Select one or more. Leave empty if you have no preference.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {types.map((type) => {
            const isSelected = preferences.bodyTypes.includes(type.id);
            return (
              <div 
                key={type.id}
                onClick={() => toggleArrayItem('bodyTypes', type.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-primary-500/10 border-primary-500 shadow-lg shadow-primary-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-300'}`}>{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 3: Fuel Type
  const renderStep3 = () => {
    const types = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];

    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">Fuel preferences?</h2>
        <p className="text-gray-400 mb-8">What kind of fuel options are you open to?</p>
        
        <div className="flex flex-wrap gap-4">
          {types.map((type) => {
            const isSelected = preferences.fuelTypes.includes(type);
            return (
              <button 
                key={type}
                onClick={() => toggleArrayItem('fuelTypes', type)}
                className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all ${
                  isSelected 
                    ? 'bg-primary-500/20 border-primary-500 text-primary-300' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 4: Seating
  const renderStep4 = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">How many seats?</h2>
      <p className="text-gray-400 mb-8">Minimum seating capacity required.</p>
      
      <div className="flex gap-4">
        {[4, 5, 6, 7].map((num) => (
          <button 
            key={num}
            onClick={() => setPreferences(prev => ({ ...prev, seating: num }))}
            className={`flex-1 py-8 rounded-2xl font-bold text-2xl border-2 transition-all ${
              preferences.seating === num 
                ? 'bg-primary-500/20 border-primary-500 text-primary-300' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            {num} {num === 7 ? '+' : ''}
          </button>
        ))}
      </div>
    </div>
  );

  // Step 5: Priorities
  const renderStep5 = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">What's most important?</h2>
      <p className="text-gray-400 mb-8">Rate these factors from 1 (Not important) to 5 (Dealbreaker).</p>
      
      <div className="space-y-6">
        {[
          { id: 'mileage', label: 'Fuel Efficiency / Mileage' },
          { id: 'safety', label: 'Safety Ratings & Features' },
          { id: 'performance', label: 'Engine Performance / Power' },
          { id: 'features', label: 'Interior Features & Tech' },
          { id: 'budget', label: 'Low Price / Value for Money' }
        ].map((priority) => (
          <div key={priority.id} className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-white">{priority.label}</label>
              <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-bold">
                Level {preferences.priorities[priority.id]}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setPreferences(prev => ({ 
                    ...prev, 
                    priorities: { ...prev.priorities, [priority.id]: val } 
                  }))}
                  className={`flex-1 h-12 rounded-lg transition-all ${
                    preferences.priorities[priority.id] === val
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : preferences.priorities[priority.id] > val
                        ? 'bg-primary-500/50 text-white/80'
                        : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Results
  const renderResults = () => {
    if (!results || !results.data) return null;

    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-green-500/20 text-green-400 mb-4">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Your Perfect Matches</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {results.message} We've ranked them based on how well they align with your priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.data.map((car, index) => (
            <div key={car._id} className="relative group">
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-accent-400 to-accent-600 text-gray-900 text-sm font-bold px-6 py-1.5 rounded-full shadow-lg shadow-accent-500/30">
                  #1 Top Match
                </div>
              )}
              <CarCard car={car} />
            </div>
          ))}
        </div>
        
        {results.data.length === 0 && (
          <div className="text-center mt-8">
            <button onClick={() => setStep(1)} className="gradient-btn-accent">
              Adjust Preferences
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar (hide on results) */}
        {step < 6 && (
          <div className="mb-12">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-primary-400">Step {step} of 5</span>
              <span className="text-sm font-medium text-gray-500">{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="min-h-[400px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderResults()}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 6 && !loading && (
          <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl font-medium text-gray-400 disabled:opacity-0 hover:text-white hover:bg-white/5 transition-colors"
            >
              Back
            </button>
            
            {step < 5 ? (
              <button
                onClick={handleNext}
                className="gradient-btn px-10"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="gradient-btn px-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                Find My Perfect Car
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardPage;
