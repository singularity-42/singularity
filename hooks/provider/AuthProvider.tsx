"use client";

import React, { createContext, useState, useEffect } from 'react';

interface AuthContextInterface {
  credentials: string[];
  addCredentials: (fileName: string) => void;
  removeCredentials: (fileName: string) => void;
  visible: boolean;
  toggleOverlay: () => void;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
