"use client";

import Authentication from '@/components/layout/Authentication';
// Import necessary dependencies
import React, { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';

// Define the context interface
interface AuthContextInterface {
    coveredCredentials: string[];
    addCredentials: (entityName: string) => void;
    removeCredentials: (entityName: string) => void;

    toggleOverlay: () => void;
    visible: boolean;
    loading: boolean;
    error: string;
}

// Create the context
// const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the authentication context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
    const [visible, setOverlayVisible] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<string[]>([]);
    const [coveredCredentials, setCoveredCredentials] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const addCredentials = (entityName: string) => {
        setCredentials([...credentials, entityName]);
    };

    const removeCredentials = (entityName: string) => {
        setCredentials(credentials.filter((item) => item !== entityName));
    };

    const toggleOverlay = () => {
        setOverlayVisible(!visible);
    };

    useEffect(() => {
        if (credentials.length > 3) {
            setCoveredCredentials(credentials.slice(3));
        }
    }, [credentials]); 

    const value = {
        coveredCredentials,
        addCredentials,
        removeCredentials,

        toggleOverlay,
        visible,
        loading,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            <Authentication />
            {children}
        </AuthContext.Provider>
    );

};


export default AuthProvider;