"use client";

import { ViewMode as ViewMode } from '@/types';
import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

// Define the context interface
interface VisualContextInterface {
    tooltip: string;
    setTooltip: (tooltip: string) => void;
    mode: ViewMode;
    setMode: (mode: ViewMode) => void;
}

// Create the context
const VisualContext = createContext<VisualContextInterface | undefined>(undefined);

// Define the props for the TooltipProvider
interface TooltipProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the tooltip context
export const VisualProvider: React.FC<TooltipProviderProps> = ({ children }: TooltipProviderProps) => {
    const [tooltip, setTooltip] = useState("Welcome - back to the Singularity!");
    const [mode, setMode] = useState(ViewMode.CardsColumn);

    const visualContextValue: VisualContextInterface = {
        tooltip,
        setTooltip,
        mode,
        setMode
    };

    return (
        <VisualContext.Provider value={visualContextValue}>
            {children}
        </VisualContext.Provider>
    );
};

// useTooltip is a custom hook to consume the tooltip context
export const useVisual = () => {
    const context = React.useContext(VisualContext);
    if (context === undefined) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};

export default VisualContext;
