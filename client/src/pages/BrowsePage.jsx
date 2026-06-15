import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCars, getFilterMeta } from '../services/api';
import CarCard from '../components/cards/CarCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize filters from URL
  const initialFilters = {
    bodyType: searchParams.get('bodyType') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    make: searchParams.get('make') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-expertRating',
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    // Fetch filter metadata only once
    const fetchMeta = async () => {
      try {
        const { data } = await getFilterMeta();
        setMeta(data.data);
      } catch (error) {
        console.error('Failed to fetch filter metadata', error);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Build API params from state
        const params = {
          page: searchParams.get('page') || 1,
          limit: 12,
        };
        
        Object.keys(filters).forEach(key => {
          if (filters[key]) params[key] = filters[key];
        });

        const { data } = await getCars(params);
        setCars(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch cars', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters, searchParams]);

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters, [category]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        newParams.set(key, newFilters[key]);
      }
    });
    // Reset to page 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      searchParams.set('page', newPage.toString());
      setSearchParams(searchParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Mobile Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Browse Cars</h1>
            <p className="text-gray-400">
              Showing {cars.length} of {pagination.total} cars
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
            
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 appearance-none pr-10 relative cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="-expertRating" className="bg-gray-900">Highest Rated</option>
              <option value="priceRange.min" className="bg-gray-900">Price: Low to High</option>
              <option value="-priceRange.min" className="bg-gray-900">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar 
              filters={filters} 
              meta={meta} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {/* Mobile Filters Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
              <div className="relative flex-1 w-full max-w-xs bg-gray-950 h-full overflow-y-auto animate-slide-in-right">
                <div className="p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-gray-950 z-10">
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar 
                    filters={filters} 
                    meta={meta} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          pagination.page === i + 1
                            ? 'bg-primary-500 text-white'
                            : 'border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-2">No cars found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't find any cars matching your selected filters. Try adjusting your search criteria or clearing some filters.
                </p>
                <button 
                  onClick={() => handleFilterChange('bodyType', '')} // Simple hack to trigger reset if they manually clear
                  className="mt-6 text-primary-400 hover:text-primary-300 font-medium"
                >
                  Adjust Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
