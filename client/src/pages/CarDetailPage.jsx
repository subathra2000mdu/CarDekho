import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCarById } from '../services/api';
import { useCompare } from '../context/CompareContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { addToCompare, removeFromCompare, isInCompare, compareCount } = useCompare();
  const isCompared = car ? isInCompare(car._id) : false;

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const { data } = await getCarById(id);
        setCar(data.data);
      } catch (error) {
        console.error('Failed to fetch car details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCompareToggle = () => {
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

  if (loading) return <LoadingSpinner fullScreen />;
  if (!car) return <div className="pt-32 text-center text-white">Car not found.</div>;

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section */}
      <div className="w-full bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            {/* Image */}
            <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/20 group">
              <img 
                src={car.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={`${car.make} ${car.model}`}
                className="w-full h-auto object-cover aspect-video group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                  {car.bodyType}
                </span>
                <span className="bg-primary-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-primary-400">
                  {car.expertRating}/10 Rating
                </span>
              </div>
            </div>

            {/* Title & Core Details */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div>
                <Link to={`/browse?make=${car.make}`} className="text-primary-400 font-medium hover:underline">
                  {car.make}
                </Link>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mt-1 mb-2">
                  {car.model}
                </h1>
                <p className="text-2xl text-gray-300 font-light">
                  ₹{car.priceRange?.min?.toFixed(2)} - ₹{car.priceRange?.max?.toFixed(2)} <span className="text-lg text-gray-500">Lakh*</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">*Ex-showroom price</p>
              </div>

              <div className="flex flex-wrap gap-4 py-6 border-y border-white/10">
                <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
                  <span className="text-gray-500 text-sm">Fuel</span>
                  <span className="text-white font-medium">{car.fuelType}</span>
                </div>
                <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
                  <span className="text-gray-500 text-sm">Transmission</span>
                  <span className="text-white font-medium">{car.transmission}</span>
                </div>
                <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
                  <span className="text-gray-500 text-sm">Mileage</span>
                  <span className="text-white font-medium">{car.mileage?.highway} kmpl</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-sm">Seating</span>
                  <span className="text-white font-medium">{car.seatingCapacity} Adults</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={handleCompareToggle}
                  className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    isCompared 
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                    : 'gradient-btn'
                  }`}
                >
                  {isCompared ? (
                    <>
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Compare
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Compare
                    </>
                  )}
                </button>
                {isCompared && (
                  <Link to="/compare" className="px-6 py-4 rounded-xl bg-primary-500/20 text-primary-400 font-semibold border border-primary-500/30 hover:bg-primary-500/30 transition-colors">
                    View
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-white/10 mb-8 overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            {['overview', 'specs', 'variants', 'pros-cons'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${
                  activeTab === tab ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Expert Rating</h3>
                <div className="glass-card p-8 flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-black text-white mb-2">{car.expertRating}<span className="text-2xl text-gray-500 font-normal">/10</span></div>
                    <StarRating rating={car.expertRating} />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Safety Rating</p>
                    <div className="flex gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < (car.safety?.rating || 0) ? 'text-accent-500' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mt-10 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {car.tags?.map(tag => (
                    <Link key={tag} to={`/search?q=${tag}`} className="chip hover:bg-white/20">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Top Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {car.safety?.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Engine & Transmission
                </h3>
                <dl className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Displacement</dt>
                    <dd className="text-white font-medium">{car.engine?.displacement ? `${car.engine.displacement} cc` : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Max Power</dt>
                    <dd className="text-white font-medium">{car.engine?.power ? `${car.engine.power} bhp` : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Max Torque</dt>
                    <dd className="text-white font-medium">{car.engine?.torque ? `${car.engine.torque} Nm` : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between pb-2">
                    <dt className="text-gray-400">Transmission</dt>
                    <dd className="text-white font-medium">{car.transmission}</dd>
                  </div>
                </dl>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Dimensions & Capacity
                </h3>
                <dl className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Length x Width x Height</dt>
                    <dd className="text-white font-medium">{car.dimensions?.length} x {car.dimensions?.width} x {car.dimensions?.height} mm</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Wheelbase</dt>
                    <dd className="text-white font-medium">{car.dimensions?.wheelbase} mm</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <dt className="text-gray-400">Ground Clearance</dt>
                    <dd className="text-white font-medium">{car.dimensions?.groundClearance} mm</dd>
                  </div>
                  <div className="flex justify-between pb-2">
                    <dt className="text-gray-400">Boot Space</dt>
                    <dd className="text-white font-medium">{car.dimensions?.bootSpace ? `${car.dimensions.bootSpace} L` : 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-sm font-semibold text-gray-300">Variant Name</th>
                      <th className="p-4 text-sm font-semibold text-gray-300">Powertrain</th>
                      <th className="p-4 text-sm font-semibold text-gray-300 text-right">Ex-Showroom Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {car.variants?.map((v, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{v.name}</td>
                        <td className="p-4 text-gray-400">{v.fuelType} • {v.transmission}</td>
                        <td className="p-4 text-white text-right font-semibold">₹{v.price.toFixed(2)} Lakh</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pros/Cons Tab */}
          {activeTab === 'pros-cons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 border-t-4 border-t-green-500">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Things We Like
                </h3>
                <ul className="space-y-4">
                  {car.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8 border-t-4 border-t-red-500">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  Things To Consider
                </h3>
                <ul className="space-y-4">
                  {car.cons?.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
