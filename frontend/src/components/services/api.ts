import axios from 'axios';
import { CarbonCredit } from '../types';

const CARBON_API = 'https://www.carboninterface.com/api/v1';
const CARBON_API_KEY = import.meta.env.VITE_CARBON_API_KEY;

export interface CarbonPriceData {
  market: string;
  price: number;
  change: number;
  ytd: number;
}

export interface VoluntaryMarketData {
  type: string;
  price: number;
  change: number;
  ytd: number;
}

const carbonAxios = axios.create({
  baseURL: CARBON_API,
  headers: {
    'Authorization': `Bearer ${CARBON_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Mock data for carbon prices since the API doesn't provide market prices directly
const mockComplianceMarkets: CarbonPriceData[] = [
  {
    market: 'EU ETS',
    price: 85.23,
    change: 0.5,
    ytd: 15.2
  },
  {
    market: 'California CaT',
    price: 41.75,
    change: -0.3,
    ytd: 8.7
  },
  {
    market: 'RGGI',
    price: 14.20,
    change: 0.2,
    ytd: 5.4
  }
];

const mockVoluntaryMarkets: VoluntaryMarketData[] = [
  {
    type: 'Renewable Energy',
    price: 25.50,
    change: 1.2,
    ytd: 12.5
  },
  {
    type: 'Forest Conservation',
    price: 18.75,
    change: -0.8,
    ytd: 6.3
  },
  {
    type: 'Direct Air Capture',
    price: 35.20,
    change: 2.1,
    ytd: 18.9
  }
];

export async function fetchCarbonPrices(): Promise<CarbonPriceData[]> {
  try {
    // For now, return mock data since the API doesn't provide market prices
    return mockComplianceMarkets;
  } catch (error) {
    console.error('Error fetching carbon prices:', error);
    return [];
  }
}

export async function fetchVoluntaryMarkets(): Promise<VoluntaryMarketData[]> {
  try {
    // For now, return mock data since the API doesn't provide market prices
    return mockVoluntaryMarkets;
  } catch (error) {
    console.error('Error fetching voluntary markets:', error);
    return [];
  }
}

export async function calculateEmissions(type: string, data: Record<string, any>) {
  try {
    const response = await carbonAxios.post('/estimates', {
      type,
      ...data
    });

    console.log('Emissions calculation response:', response.data);
    
    if (!response?.data?.data?.attributes) {
      throw new Error('Invalid API response format');
    }

    return {
      carbonGrams: response.data.data.attributes.carbon_g,
      carbonKilograms: response.data.data.attributes.carbon_kg,
      carbonPounds: response.data.data.attributes.carbon_lb,
      carbonMetricTons: response.data.data.attributes.carbon_mt,
      estimatedAt: response.data.data.attributes.estimated_at
    };
  } catch (error) {
    console.error('Error calculating emissions:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
      console.error('API Status:', error.response?.status);
    }
    throw error;
  }
}

export async function fetchCarbonCredits(): Promise<CarbonCredit[]> {
  try {
    const response = await carbonAxios.get('/carbon_credits');
    
    console.log('Carbon Credits API Response:', response.data);

    if (!response?.data) {
      console.error('No data in API response');
      return [];
    }

    const dataArray = Array.isArray(response.data) ? response.data : 
                     Array.isArray(response.data.data) ? response.data.data : 
                     [response.data];

    return dataArray.map((credit: any) => {
      const attributes = credit.attributes || credit;
      
      return {
        id: credit.id || `unknown-${Date.now()}`,
        type: attributes?.credit_type || 'Unknown',
        projectType: attributes?.project_type || 'Unknown',
        amount: parseFloat(attributes?.quantity || '0') || 0,
        price: parseFloat(attributes?.price_per_credit || '0') || 0,
        verified: Boolean(attributes?.verified)
      };
    });
  } catch (error) {
    console.error('Error fetching carbon credits:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
    }
    return [];
  }
}