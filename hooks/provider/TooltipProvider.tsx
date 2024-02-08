"use client";

import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

// Define the context interface
interface TooltipContextInterface {
    tooltip: string;
    setTooltip: Dispatch<SetStateAction<string>>;
}

// Create the context
const TooltipContext = createContext<TooltipContextInterface | undefined>(undefined);

// Define the props for the TooltipProvider
interface TooltipProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the tooltip context
export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }: TooltipProviderProps) => {
    const [tooltip, setTooltip] = useState("Welcome - back to the Singularity!");

    const tooltipContextValue: TooltipContextInterface = {
        tooltip,
        setTooltip,
    };

    return (
        <TooltipContext.Provider value={tooltipContextValue}>
            {children}
        </TooltipContext.Provider>
    );
};

// useTooltip is a custom hook to consume the tooltip context
export const useTooltip = () => {
    const context = React.useContext(TooltipContext);
    if (context === undefined) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};

export default TooltipContext;
