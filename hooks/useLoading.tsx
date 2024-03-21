"use client";

import { ViewType as ViewType } from '@/app/defaults';
import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

// Define the context interface
interface LoadingContextInterface {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

// Define the default context value
const loadingContextValue: LoadingContextInterface = {
    loading: false,
    setLoading: () => {}
}

// Define the context
const LoadingContext = createContext(loadingContextValue);

// Define the provider props interface
interface TooltipProviderProps {
    children: React.ReactNode;
}


// Create a provider component for the tooltip context
export const LoadingProvider: React.FC<TooltipProviderProps> = ({ children }: TooltipProviderProps) => {
    const [loading, setLoading] = useState(false);
    
    return (
        <LoadingContext.Provider value={loadingContextValue}>
            {children}
        </LoadingContext.Provider>
    );
};

// useTooltip is a custom hook to consume the tooltip context
export const useLoading = () => {
    const context = React.useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};

export default LoadingContext;
