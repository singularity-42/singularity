"use client";

import Credentials from '@/components/layout/Credentials';
// Import necessary dependencies
import React, { createContext, useState, Dispatch, SetStateAction, useEffect, useCallback } from 'react';

// Define the context interface
interface AuthContextInterface {
  addCredentials: (entityName: string) => void;
  removeCredentials: (entityName: string) => void;
  toggleOverlay: () => void;
  checkFormat: (str: string) => boolean;
  visible: boolean;

  coveredCredentials: string[];
}

// Create the context
// const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
    children: React.ReactNode;
}

// Create a provider component for the Credentials context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
    const [visible, setOverlayVisible] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<string[]>([]);
    const [coveredCredentials, setCoveredCredentials] = useState<string[]>([]);

    const removeCredentials = useCallback((credential: string) => {
        setCredentials(credentials.filter((item) => item !== credential));
    }, [credentials]);

    const addCredentials = useCallback((credential: string) => {
      setCredentials([...credentials, credential]);
    }, [credentials]);

    const toggleOverlay = () => {
        setOverlayVisible(!visible);
    };

    useEffect(() => {
      let _credentials = credentials;
      // map all credentials from 123-456-678 to 123-XXX-XXX
      _credentials = _credentials.map((item) => {
        return item.replace(/\d(?=\d{4})/g, "*");
      });
      setCoveredCredentials(_credentials);
    }, [credentials]); 

    const value = {
      addCredentials,
      removeCredentials,
      toggleOverlay,
      visible,

      coveredCredentials,
    };

    return (
        <AuthContext.Provider value={value}>
            <Credentials />
            {children}
        </AuthContext.Provider>
    );

};


export default AuthProvider;