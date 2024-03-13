"use client";

import { ViewType as ViewType } from '@/app/defaults';
import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

// Define the context interface
interface VisualContextInterface {
    tooltip: string;
    setTooltip: (tooltip: string) => void;
    mode: ViewType;
    setMode: (mode: ViewType) => void;
    cycleViewMode: () => void;
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
    const [mode, setMode] = useState(ViewType.CardsColumn);

    const cylceViewMode = () => {
        let type_strings = Object.keys(ViewType);
        let type_values = Object.values(ViewType);
        let index = type_values.indexOf(mode);
        index = (index + 1) % type_values.length;
        setMode(type_values[index]);
    };

    const visualContextValue: VisualContextInterface = {
        tooltip,
        setTooltip,
        mode,
        setMode,
        cycleViewMode: cylceViewMode
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
