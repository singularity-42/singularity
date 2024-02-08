"use client"

import Details from '@/components/layout/Details';
import React, { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';

// Define the context interface
interface DetailsContextInterface {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    toggleVisibility: () => void;
    visible: boolean;
    goBack: () => string | null;
    history: string[];
}

// Create the context
const DetailsContext = createContext<DetailsContextInterface | undefined>(undefined);

// Define the props for the DetailsProvider
interface DetailsProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the details context
export const DetailsProvider: React.FC<DetailsProviderProps> = ({ children }: DetailsProviderProps) => {
    const [name, setName] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);

    const [history, setHistory] = useState<string[]>([]);
    const addToHistory = (link: string) => {
        setHistory([...history, link]);
    };

    const goBack = () => {
        if (history.length >  0) {
            const lastLink = history.pop();
            setHistory([...history]);
            return lastLink || '';
        }
        return null;
    };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const detailsContextValue: DetailsContextInterface = {
        name,
        setName,
        toggleVisibility,
        visible,
        goBack,
        history,
    };

    return (
        <DetailsContext.Provider value={detailsContextValue}>
            <Details />
            {children}
        </DetailsContext.Provider>
    );
};


// useDetails is a custom hook to consume the details context

export const useDetails = () => {
    const context = React.useContext(DetailsContext);

    if (context === undefined) {
        throw new Error('useDetails must be used within a DetailsProvider');
    }

    return context;
};
