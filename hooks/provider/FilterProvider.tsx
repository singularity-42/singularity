"use client"

import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

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

// Create a provider component for the filter context
export const FilterProvider: React.FC<FilterProviderProps> = ({ children }: FilterProviderProps) => {
    const [filter, setFilter] = useState<string[]>([]);

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
