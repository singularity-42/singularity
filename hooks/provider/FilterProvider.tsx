"use client"

import { Filter } from '@/types';
import React, { createContext, useState, Dispatch, SetStateAction, useEffect, useCallback } from 'react';


// Define the context interface
interface FilterContextInterface {
  filter: Filter;
  setFilterTag: (tag: string) => void;
  setFilterName: (name: string) => void;
  setFilterDate: (date: Date) => void;
  setFilterCategory: (category: string) => void;
  setFilterConnections: (connections: string[]) => void;
}

// Create the context
const FilterContext = createContext<FilterContextInterface | undefined>(undefined);

// Define the props for the FilterProvider
interface FilterProviderProps {
  children: React.ReactNode;
}


export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filter, setFilter] = useState<Filter>({});

  const setFilterName = (name: string) => setFilter((prev) => ({ ...prev, name }));
  const setFilterDate = (date: Date) => setFilter((prev) => ({ ...prev, date }));
  const setFilterConnections = (connections: string[]) => setFilter((prev) => ({ ...prev, connections }));
  const setFilterTag = (tag: string) => {
    const newTags = [...(filter.tags || []), tag];
    setFilter((prev) => ({ ...prev, tags: newTags }));
  };
  const setFilterCategory = (category: string) => {
    setFilter((prev) => ({ ...prev, category }));
  };

  return (
    <FilterContext.Provider value={{ filter, setFilterTag, setFilterName, setFilterDate, setFilterCategory, setFilterConnections }}>
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
