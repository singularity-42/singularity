import { Filter } from '@/types';
import React, { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';


// Define the context interface
interface FilterContextInterface {
  filter: Filter;
  setFilterTags: (tags: string[]) => void;
  setFilterName: (name: string) => void;
  setFilterDate: (date: Date | null) => void;
  setFilterCategory: (category: string) => void;
  setFilterConnections: (connections: string[]) => void;

  onFilterClick(filter: Filter): void;
}

// Create the context
const FilterContext = createContext<FilterContextInterface | undefined>(undefined);

// Define the props for the FilterProvider
interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }: FilterProviderProps) => {
  const [filter, setFilter] = useState<Filter>({
    tags: [],
    name: '',
    date: null,
    category: '',
    connections: [],
  });

  const setFilterTags = (tags: string[]) => setFilter((prev) => ({ ...prev, tags }));
  const setFilterName = (name: string) => setFilter((prev) => ({ ...prev, name }));
  const setFilterDate = (date: Date | null) => setFilter((prev) => ({ ...prev, date }));
  const setFilterCategory = (category: string) => setFilter((prev) => ({ ...prev, category }));
  const setFilterConnections = (connections: string[]) => setFilter((prev) => ({ ...prev, connections }));

  const onFilterClick = (filter: Filter) => {
    setFilter(filter);
  };

  const filterContextValue: FilterContextInterface = {
    filter,
    setFilterTags,
    setFilterName,
    setFilterDate,
    setFilterCategory,
    setFilterConnections,

    onFilterClick
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
