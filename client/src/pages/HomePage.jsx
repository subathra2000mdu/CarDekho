import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../services/api';
import CarCard from '../components/cards/CarCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const { data } = await getCars({ sort: '-expertRating', limit: 4 });
        setPopularCars(data.data);
      } catch (error) {
        console.error('Failed to fetch popular cars', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-slow" />
            AI-Powered Car Research
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Find Your Perfect Car <br className="hidden md:block" />
            <span className="gradient-text">Without the Confusion.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Tell us what matters to you. Our smart recommendation engine will analyze thousands of data points to find the car that truly matches your lifestyle and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/wizard" className="w-full sm:w-auto gradient-btn text-lg py-4 px-8 flex items-center justify-center gap-2">
              Start Smart Wizard
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/browse" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors text-center">
              Browse All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 border-t border-white/5 bg-gray-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center text-white mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { name: 'SUVs', type: 'SUV', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { name: 'Sedans', type: 'Sedan', icon: 'M8 7h8M4 11h16M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z' },
              { name: 'Hatchbacks', type: 'Hatchback', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { name: 'Electric', fuel: 'Electric', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?${cat.fuel ? `fuelType=${cat.fuel}` : `bodyType=${cat.type}`}`}
                className="glass-card-hover p-6 flex flex-col items-center justify-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                  </svg>
                </div>
                <span className="font-semibold text-gray-200 group-hover:text-white">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title text-white mb-2">Highest Rated Cars</h2>
              <p className="text-gray-400">Based on expert reviews and safety scores</p>
            </div>
            <Link to="/browse" className="hidden sm:flex text-primary-400 font-medium hover:text-primary-300 items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
             <Link to="/browse" className="text-primary-400 font-medium hover:text-primary-300 flex justify-center items-center gap-1">
              View all cars
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
