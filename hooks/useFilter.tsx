"use client"

import { CategoryType } from '@/app/defaults';
import { Filter } from '@/app/types';
import React, { createContext, useState, Dispatch, SetStateAction, useEffect, useCallback } from 'react';


// Define the context interface
interface FilterContextInterface {
  filter: Filter;
  setFilterTag: (tag: string) => void;
  setFilterName: (name: string) => void;
  setFilterDate: (date: Date) => void;
  setFilterCategory: (category: CategoryType) => void;
  setFilterConnection: (connections: string) => void;
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
  const setFilterConnection = (connection: string) => {
    let _connection = connection.replace(/\"/gm, '');
    setFilter((prev: Filter) => {
      if (prev.connections?.includes(_connection)) {
        return { ...prev, connections: prev.connections?.filter((c) => c !== _connection) };
      }
      return { ...prev, connections: [...(prev.connections || []), _connection] };
    });
  };
  const setFilterTag = (tag: string) => {
    setFilter((prev: Filter) => {
      if (prev.tags?.includes(tag)) {
        return { ...prev, tags: prev.tags?.filter((t) => t !== tag) };
      }
      return { ...prev, tags: [...(prev.tags || []), tag] };
    });
  };
  const setFilterCategory = (category: CategoryType) => {
    setFilter((prev: Filter) => {
      if (prev.category === category) {
        return prev;
      }
      return { ...prev, category };
    });
  };

  return (
    <FilterContext.Provider value={{ filter, setFilterTag, setFilterName, setFilterDate, setFilterCategory, setFilterConnection }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;
