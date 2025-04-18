import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import useSWR from 'swr';
import { fetchCarbonPrices, fetchVoluntaryMarkets } from '../services/api';
import type { CarbonPriceData, VoluntaryMarketData } from '../services/api';

interface PriceRowProps {
  market: string;
  price: number;
  change: number;
  ytd: number;
  isLoading?: boolean;
}

const PriceRow: React.FC<PriceRowProps> = ({ market, price, change, ytd, isLoading }) => {
  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {market}
      </span>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-semibold">${price.toFixed(2)}</span>
        <div className="flex items-center">
          {getChangeIcon(change)}
          <span className={`text-sm ${getChangeColor(change)}`}>
            {change > 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
        <span className={`text-sm ${getChangeColor(ytd)}`}>
          {ytd > 0 ? '+' : ''}{ytd.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export const CarbonPriceWidget: React.FC = () => {
  const { data: complianceMarkets, error: complianceError, isLoading: complianceLoading } = 
    useSWR<CarbonPriceData[]>('carbonPrices', fetchCarbonPrices, { 
      refreshInterval: 30000 // Refresh every 30 seconds
    });

  const { data: voluntaryMarkets, error: voluntaryError, isLoading: voluntaryLoading } = 
    useSWR<VoluntaryMarketData[]>('voluntaryMarkets', fetchVoluntaryMarkets, {
      refreshInterval: 60000 // Refresh every minute
    });

  const isError = complianceError || voluntaryError;
  
  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-red-500 text-center">
          Error loading carbon prices. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Latest Carbon Prices
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Compliance Markets
        </h3>
        {complianceLoading ? (
          Array(6).fill(0).map((_, i) => (
            <PriceRow
              key={i}
              market="Loading..."
              price={0}
              change={0}
              ytd={0}
              isLoading={true}
            />
          ))
        ) : complianceMarkets?.map((market) => {
          const marketName = market.market || 'N/A'; // Provide a default value
          return (
            <PriceRow
              key={marketName}
              market={marketName}
              price={market.price}
              change={market.change}
              ytd={market.ytd}
            />
          );
        })}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Voluntary Markets
        </h3>
        {voluntaryLoading ? (
          Array(3).fill(0).map((_, i) => (
            <PriceRow
              key={i}
              market="Loading..."
              price={0}
              change={0}
              ytd={0}
              isLoading={true}
            />
          ))
        ) : voluntaryMarkets?.map((market) => {
          const marketType = market.type || 'N/A'; // Provide a default value
          return (
            <PriceRow
              key={marketType}
              market={marketType}
              price={market.price}
              change={market.change}
              ytd={market.ytd}
            />
          );
        })}
      </div>
    </div>
  );
};