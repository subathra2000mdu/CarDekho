const FilterSidebar = ({ filters, meta, onFilterChange }) => {
  const handleCheckboxChange = (category, value) => {
    const currentValues = filters[category] ? filters[category].split(',') : [];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    onFilterChange(category, newValues.join(','));
  };

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, '');
    });
  };

  const renderSection = (title, category, options) => {
    if (!options || options.length === 0) return null;
    
    const selectedValues = filters[category] ? filters[category].split(',') : [];

    return (
      <div className="mb-6 border-b border-white/5 pb-6">
        <h3 className="text-white font-semibold mb-3">{title}</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-gray-600 rounded bg-gray-900/50 
                           checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(category, option)}
                />
                <svg 
                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div className="glass-card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </h2>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs font-medium text-accent-500 hover:text-accent-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="mb-6 border-b border-white/5 pb-6">
        <h3 className="text-white font-semibold mb-4">Price Range (Lakhs)</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                min={0}
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                min={0}
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
                placeholder="100+"
              />
            </div>
          </div>
        </div>
      </div>

      {renderSection('Body Type', 'bodyType', meta?.bodyTypes)}
      {renderSection('Fuel Type', 'fuelType', meta?.fuelTypes)}
      {renderSection('Transmission', 'transmission', meta?.transmissions)}
      {renderSection('Brand', 'make', meta?.makes)}

    </div>
  );
};

export default FilterSidebar;
