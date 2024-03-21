"use client"

import React, { createContext, useState } from 'react';

// Define the context interface
interface EntityContextInterface {
    name: string;
    date: string;
    
    setName: (name: string) => void;
    // also need date for filter 
    setDate: (date: string) => void;

    toggleVisibility: () => void;
    visible: boolean;
    editing: boolean;
    setEditing: (editing: boolean) => void;
}

// Create the context
const EntityContext = createContext<EntityContextInterface | undefined>(undefined);

// Define the props for the DetailsProvider
interface EntityProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the details context
export const EntityProvider: React.FC<EntityProviderProps> = ({ children }: EntityProviderProps) => {
    const [name, setName] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);
    const [editing, setEditing] = useState(false);
    const [date, setDate] = useState<string>('');

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const detailsContextValue: EntityContextInterface = {
        name,
        date,
        setName,
        setDate,
        toggleVisibility,
        visible,
        editing,
        setEditing,
    };

    return (
        <EntityContext.Provider value={detailsContextValue}>
            {children}
        </EntityContext.Provider>
    );
};


// useEntity is a custom hook to consume the Entity context

export const useEntityOverlay = () => {
    const context = React.useContext(EntityContext);

    if (context === undefined) {
        throw new Error('useEntity must be used within a EntityProvider');
    }

    return context;
};