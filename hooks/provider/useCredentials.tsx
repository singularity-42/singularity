"use client";

import React, { createContext, useState, useEffect } from 'react';

interface CredentialsContextInterface {
  credentials: string[];
  addCredentials: (fileName: string) => void;
  removeCredentials: (fileName: string) => void;
  visible: boolean;
  toggleOverlay: () => void;
}

const CredentialsContext = createContext<CredentialsContextInterface | undefined>(undefined);

interface CredentialsProviderProps {
  children: React.ReactNode;
}

export const CredentialsProvider: React.FC<CredentialsProviderProps> = ({ children }) => {
  const [credentials, setCredentials] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingCredentials = window.localStorage.getItem('credentials');
      const parsedCredentials = existingCredentials ? JSON.parse(existingCredentials) : [];
      const uniqueCredentials = Array.from(new Set([...parsedCredentials, ...credentials]));
      window.localStorage.setItem('credentials', JSON.stringify(uniqueCredentials));
    }
  }, [credentials]);
  
  const addCredentials = (fileName: string) => {
    setCredentials([...credentials, fileName]);
  };

  const removeCredentials = (fileName: string) => {
    setCredentials(credentials.filter((item) => item !== fileName));
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const value = {
    credentials,
    addCredentials,
    removeCredentials,
    toggleOverlay,
    visible,
  };

  return (
    <CredentialsContext.Provider value={value}>
      {children}
    </CredentialsContext.Provider>
  );
};

export const useCredentials = () => {
  const context = React.useContext(CredentialsContext);

  if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};