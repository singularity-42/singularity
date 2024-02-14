"use client"

import React, { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';

// Define the context interface
interface FilterContextInterface {
    filter: string[];
    setFilter: Dispatch<SetStateAction<string[]>>;
}

// Create the context
const FilterContext = createContext<FilterContextInterface | undefined>(undefined);

// Define the props for the FilterProvider
interface FilterProviderProps {
    children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }: FilterProviderProps) => {
    const [filter, setFilter] = useState<string[]>([]);
  
    // TODO: Update the URL when the filter changes
    //  - code works for update when filter selected but is buggy
    //  - code should work when open url with filter selected, currently not working
    // useEffect(() => {
    //   const queryParams = new URLSearchParams();
  
    //   if (filter.length > 0) {
    //     queryParams.set('filter', filter.join(','));
    //   }
  
    //   const queryString = queryParams.toString();
    //   const newUrl = queryString ? `?${queryString}` : window.location.pathname;
  
    //   window.history.replaceState(null, '', newUrl);
    // }, [filter]);
  
    const filterContextValue: FilterContextInterface = {
      filter,
      setFilter,
    };
  
    return (
      <FilterContext.Provider value={filterContextValue}>
        {children}
      </FilterContext.Provider>
    );
  };
  
// useFilter is a custom hook to consume the filter context
export const useFilter = () => {
    const context = React.useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

export default FilterContext;
