import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  wallet: string;
  setWallet: (wallet: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<string>('');

  const logout = () => {
    setWallet('');
  };

  const isLoggedIn = wallet !== '';

  return (
    <AuthContext.Provider value={{ wallet, setWallet, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};