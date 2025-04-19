// CarbonPriceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of the carbon price data
export interface CarbonPriceData {
  region: string;
  price: number;
  ethPerCredit: number;
  change: number;
}

// Define the shape of the context value
interface CarbonPriceContextType {
  carbonPrices: CarbonPriceData[];
}

// Create the context with a default value
const CarbonPriceContext = createContext<CarbonPriceContextType>({
  carbonPrices: [],
});

// Define the props for the provider
interface CarbonPriceProviderProps {
  children: React.ReactNode;
}

export const CarbonPriceProvider: React.FC<CarbonPriceProviderProps> = ({ children }) => {
  const [carbonPrices, setCarbonPrices] = useState<CarbonPriceData[]>([]);

  useEffect(() => {
    const fetchCarbonPrices = async () => {
      try {
        const response = await axios.get<CarbonPriceData[]>('http://localhost:5000/api/prices');
        setCarbonPrices(response.data);
      } catch (error) {
        console.error('Error fetching carbon prices:', error);
      }
    };

    fetchCarbonPrices();
  }, []);

  return (
    <CarbonPriceContext.Provider value={{ carbonPrices }}>
      {children}
    </CarbonPriceContext.Provider>
  );
};

export const useCarbonPrice = () => useContext(CarbonPriceContext);