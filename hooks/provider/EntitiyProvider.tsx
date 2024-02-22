"use client"

import React, { createContext, useState } from 'react';

// Define the context interface
interface EntitiyContextInterface {
    name: string;
    setName: (name: string) => void;
    toggleVisibility: () => void;
    visible: boolean;
    editing: boolean;
    setEditing: (editing: boolean) => void;
}

// Create the context
const EntitiyContext = createContext<EntitiyContextInterface | undefined>(undefined);

// Define the props for the DetailsProvider
interface EntitiyProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the details context
export const EntitiyProvider: React.FC<EntitiyProviderProps> = ({ children }: EntitiyProviderProps) => {
    const [name, setName] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);
    const [editing, setEditing] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const detailsContextValue: EntitiyContextInterface = {
        name,
        setName,
        toggleVisibility,
        visible,
        editing,
        setEditing,
    };

    return (
        <EntitiyContext.Provider value={detailsContextValue}>
            {children}
        </EntitiyContext.Provider>
    );
};


// useEntitiy is a custom hook to consume the Entitiy context

export const useEntitiy = () => {
    const context = React.useContext(EntitiyContext);

    if (context === undefined) {
        throw new Error('useEntitiy must be used within a EntitiyProvider');
    }

    return context;
};
