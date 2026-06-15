import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchCars } from '../services/api';
import CarCard from '../components/cards/CarCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data } = await searchCars(query);
        setResults(data.data || []);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
          {query ? (
            <p className="text-gray-400">
              Showing {results.length} results for "<span className="text-primary-400 font-medium">{query}</span>"
            </p>
          ) : (
            <p className="text-gray-400">Please enter a search query.</p>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : query ? (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
             <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any cars matching "{query}". Try searching for a different brand, model, or body type.
            </p>
            <Link to="/browse" className="gradient-btn">
              Browse All Cars
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResultsPage;
