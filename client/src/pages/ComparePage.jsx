import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import CarCard from '../components/cards/CarCard';

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">No Cars to Compare</h2>
          <p className="text-gray-400 mb-8">
            You haven't added any cars to your compare list yet. Add up to 3 cars to see them side-by-side.
          </p>
          <Link to="/browse" className="gradient-btn inline-block">
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  // Highlight better values Helper
  const getBetterValueClass = (currentValue, allValues, type = 'high') => {
    if (!currentValue || allValues.length < 2) return '';
    const numericValues = allValues.map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (numericValues.length !== allValues.length) return ''; // If some aren't numbers

    const currentNum = parseFloat(currentValue);
    const bestValue = type === 'high' ? Math.max(...numericValues) : Math.min(...numericValues);
    
    if (currentNum === bestValue && numericValues.length > 1) {
      return 'text-green-400 font-bold bg-green-400/10 rounded px-2 py-0.5 inline-block';
    }
    return '';
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Compare Cars</h1>
            <p className="text-gray-400">Comparing {compareList.length} of 3 possible cars</p>
          </div>
          <button 
            onClick={clearCompare}
            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden lg:block glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 p-6 border-r border-b border-white/5 bg-white/5">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Features & Specs</div>
                  </th>
                  {compareList.map(car => (
                    <th key={car._id} className="w-1/4 p-6 border-b border-white/5 align-top relative">
                      <button 
                        onClick={() => removeFromCompare(car._id)}
                        className="absolute top-4 right-4 p-1.5 bg-black/40 text-gray-400 hover:text-white hover:bg-red-500/80 rounded-full transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <img src={car.image} alt={car.model} className="w-full h-32 object-cover rounded-xl mb-4" />
                      <div className="text-sm text-primary-400">{car.make}</div>
                      <div className="text-xl font-bold text-white">{car.model}</div>
                      <div className="text-lg text-gray-300 mt-1">₹{car.priceRange?.min?.toFixed(2)} - ₹{car.priceRange?.max?.toFixed(2)}L</div>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="w-1/4 p-6 border-b border-white/5 align-top">
                      <div className="h-32 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center mb-4">
                        <Link to="/browse" className="text-primary-400 hover:underline flex flex-col items-center gap-2">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Car
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Basic Info */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="p-4 font-bold text-white">Basic Information</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Body Type</td>
                  {compareList.map(car => <td key={car._id} className="p-4 text-gray-200">{car.bodyType}</td>)}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Fuel Type</td>
                  {compareList.map(car => <td key={car._id} className="p-4 text-gray-200">{car.fuelType}</td>)}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Expert Rating</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4">
                      <span className={getBetterValueClass(car.expertRating, compareList.map(c => c.expertRating), 'high')}>
                        {car.expertRating}/10
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>

                {/* Engine */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="p-4 font-bold text-white">Engine & Performance</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Max Power (bhp)</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.engine?.power, compareList.map(c => c.engine?.power), 'high')}>
                        {car.engine?.power || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Max Torque (Nm)</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.engine?.torque, compareList.map(c => c.engine?.torque), 'high')}>
                        {car.engine?.torque || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Highway Mileage (kmpl)</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.mileage?.highway, compareList.map(c => c.mileage?.highway), 'high')}>
                        {car.mileage?.highway || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>

                {/* Dimensions */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="p-4 font-bold text-white">Dimensions & Capacity</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Seating Capacity</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.seatingCapacity, compareList.map(c => c.seatingCapacity), 'high')}>
                        {car.seatingCapacity}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Boot Space (Litres)</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.dimensions?.bootSpace, compareList.map(c => c.dimensions?.bootSpace), 'high')}>
                        {car.dimensions?.bootSpace || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Ground Clearance (mm)</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.dimensions?.groundClearance, compareList.map(c => c.dimensions?.groundClearance), 'high')}>
                        {car.dimensions?.groundClearance || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>

                {/* Safety */}
                <tr className="bg-white/[0.02]">
                  <td colSpan={4} className="p-4 font-bold text-white">Safety</td>
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">NCAP Rating</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.safety?.rating, compareList.map(c => c.safety?.rating), 'high')}>
                        {car.safety?.rating ? `${car.safety.rating} Stars` : 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
                <tr>
                  <td className="p-4 border-r border-white/5 text-gray-400 font-medium">Airbags</td>
                  {compareList.map(car => (
                    <td key={car._id} className="p-4 text-gray-200">
                      <span className={getBetterValueClass(car.safety?.airbags, compareList.map(c => c.safety?.airbags), 'high')}>
                        {car.safety?.airbags || 'N/A'}
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => <td key={i} className="p-4"></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View (Cards stacked) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {compareList.map(car => (
            <div key={car._id} className="relative">
               <button 
                  onClick={() => removeFromCompare(car._id)}
                  className="absolute top-4 right-4 p-2 bg-black/60 text-white hover:bg-red-500 rounded-full transition-colors z-20"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              <CarCard car={car} />
            </div>
          ))}
          {compareList.length < 3 && (
            <Link to="/browse" className="glass-card border-dashed border-2 flex flex-col items-center justify-center p-12 min-h-[400px] text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-colors">
              <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-semibold text-lg">Add another car</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default ComparePage;
