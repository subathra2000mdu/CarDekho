import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('cardekho_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cardekho_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (car) => {
    if (compareList.length >= 3) return false;
    if (compareList.find((c) => c._id === car._id)) return false;
    setCompareList((prev) => [...prev, car]);
    return true;
  };

  const removeFromCompare = (carId) => {
    setCompareList((prev) => prev.filter((c) => c._id !== carId));
  };

  const isInCompare = (carId) => {
    return compareList.some((c) => c._id === carId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
