import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import StarRating from '../common/StarRating';

const CarCard = ({ car }) => {
  const { addToCompare, removeFromCompare, isInCompare, compareCount } = useCompare();
  const isCompared = isInCompare(car._id);

  const handleCompareClick = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (isCompared) {
      removeFromCompare(car._id);
    } else {
      if (compareCount >= 3) {
        alert('You can only compare up to 3 cars at a time.');
        return;
      }
      addToCompare(car);
    }
  };

  return (
    <Link to={`/car/${car._id}`} className="group block h-full">
      <div className="glass-card-hover h-full flex flex-col overflow-hidden relative">
        {/* Match Badge for Recommendations */}
        {car.matchPercentage && (
          <div className="absolute top-4 left-4 z-10 bg-accent-500 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {car.matchPercentage}% Match
          </div>
        )}

        {/* Compare Button */}
        <button
          onClick={handleCompareClick}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-200
            ${isCompared 
              ? 'bg-primary-500/80 border-primary-400 text-white shadow-lg shadow-primary-500/40' 
              : 'bg-black/40 border-white/20 text-gray-300 hover:bg-black/60 hover:text-white'
            }`}
          title={isCompared ? "Remove from compare" : "Add to compare"}
        >
          <svg className="w-4 h-4" fill={isCompared ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-900">
          <img
            src={car.image || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white truncate">
              {car.make} <span className="text-primary-400">{car.model}</span>
            </h3>
            <p className="text-gray-300 text-sm mt-1 font-medium">
              ₹{car.priceRange?.min?.toFixed(2)} - ₹{car.priceRange?.max?.toFixed(2)} Lakh
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <StarRating rating={car.expertRating} />
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-primary-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {car.fuelType}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-primary-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                {car.transmission}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-primary-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {car.bodyType}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-primary-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {car.seatingCapacity} Seats
              </div>
            </div>
          </div>

          {/* Reasoning (for recommendations) */}
          {car.reasons && car.reasons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-primary-300 font-medium mb-1">Why this car?</p>
              <ul className="space-y-1">
                {car.reasons.slice(0, 2).map((reason, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
