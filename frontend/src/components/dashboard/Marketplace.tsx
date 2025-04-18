import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpDown, DollarSign, TrendingUp, Wallet, BarChart4, ExternalLink, Loader } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

// Regions with base prices
const REGIONS = [
  { name: "European Union", base: 66.85 },
  { name: "UK", base: 47.39 },
  { name: "Australia (AUD)", base: 34.05 },
  { name: "New Zealand (NZD)", base: 52.0 },
  { name: "South Korea", base: 6.17 },
  { name: "China", base: 83.5 },
];

interface PriceData {
  name: string;
  price: string;
  ethPerCredit: string;
  change: string;
}

interface LedgerEntry {
  type: string;
  txHash: string;
  region: string;
  amount: string;
  ethAmount: string;
  party: string;
}

const Marketplace: React.FC = () => {
  const { wallet } = useAuth();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [region, setRegion] = useState(REGIONS[0].name);
  const [ethAmount, setEthAmount] = useState('');
  const [address, setAddress] = useState(wallet || '');
  const [privateKey, setPrivateKey] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [estimatedCredits, setEstimatedCredits] = useState('0');
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Initialize address with wallet when component mounts
  useEffect(() => {
    if (wallet) {
      setAddress(wallet);
    }
  }, [wallet]);

  // Update prices with simulated market changes
  useEffect(() => {
    const updatePrices = () => {
      setLoadingPrices(true);
      const updated = REGIONS.map((r) => {
        const change = (Math.random() * 2 - 1).toFixed(2);
        const newPrice = (r.base * (1 + parseFloat(change) / 100)).toFixed(2);
        return {
          name: r.name,
          price: newPrice,
          ethPerCredit: (parseFloat(newPrice) / 10).toFixed(4),
          change,
        };
      });
      setPrices(updated);
      setLoadingPrices(false);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate estimated credits when inputs change
  useEffect(() => {
    const selected = prices.find((p) => p.name === region);
    if (selected && ethAmount && mode === 'buy') {
      const credits = (parseFloat(ethAmount) / parseFloat(selected.ethPerCredit)).toFixed(2);
      setEstimatedCredits(credits);
    }
  }, [region, ethAmount, prices, mode]);

  // Handle buy transaction
  const handleBuy = async () => {
    if (!ethAmount || !address || !privateKey) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const amount = parseFloat(estimatedCredits);
    
    try {
      const res = await axios.post("http://localhost:5000/api/buy", {
        from: address,
        privateKey,
        region,
        ethAmount,
        amount,
      });

      alert(`✅ Transaction successful! TX: ${res.data.txHash}`);
      setLedger((prev) => [
        {
          type: "BUY",
          txHash: res.data.txHash,
          region: res.data.ledger?.region || "N/A",
          amount: `${res.data.ledger?.credits} (Token #${res.data.ledger?.tokenId || "?"})`,
          ethAmount: res.data.ledger?.ethSpent || ethAmount,
          party: res.data.ledger?.buyer || address,
        },
        ...prev,
      ]);
      
      // Reset form
      setEthAmount('');
    } catch (err: any) {
      console.error(err);
      alert("❌ Purchase failed: " + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle sell transaction
  const handleSell = async () => {
    if (!tokenId || !ethAmount || !address || !privateKey) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5000/api/sell", {
        from: address,
        privateKey,
        tokenId,
        salePriceInEth: ethAmount,
      });

      alert(`✅ Sale successful! TX: ${res.data.txHash}`);
      setLedger((prev) => [
        {
          type: "SELL",
          txHash: res.data.txHash || "N/A",
          region: "N/A",
          amount: `1 Token (#${tokenId})`,
          ethAmount,
          party: address,
        },
        ...prev,
      ]);
      
      // Reset form
      setTokenId('');
      setEthAmount('');
    } catch (err: any) {
      console.error(err);
      alert("❌ Sale failed: " + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carbon Credit Marketplace</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Buy and sell carbon credits with real-time pricing
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Price Table */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Carbon Credit Prices
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <span className="animate-pulse mr-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
              Live updating
            </div>
          </div>
          
          {loadingPrices ? (
            <div className="h-64 flex items-center justify-center">
              <Loader className="h-8 w-8 text-emerald-600 dark:text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Region
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price (USD)
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ETH/Credit
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      24h Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {prices.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        ${p.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {p.ethPerCredit} ETH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${parseFloat(p.change) >= 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}
                        `}>
                          {parseFloat(p.change) > 0 ? '+' : ''}
                          {p.change}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* Buy/Sell Card */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'buy' ? 'Buy Carbon Credits' : 'Sell Carbon Credits'}
            </h3>
          </div>
          
          <div className="flex mb-4 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setMode('buy')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'buy'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'sell'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sell
            </button>
          </div>
          
          <div className="space-y-4">
            {mode === 'buy' && (
              <Select
                label="Region"
                options={REGIONS.map(r => ({ value: r.name, label: r.name }))}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                fullWidth
              />
            )}
            
            {mode === 'sell' && (
              <Input
                label="Token ID to Sell"
                placeholder="Enter token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                fullWidth
              />
            )}
            
            <Input
              label={mode === 'buy' ? 'ETH to Spend' : 'Expected ETH Price'}
              placeholder="0.00"
              type="number"
              step="0.01"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              fullWidth
            />
            
            <Input
              label="Wallet Address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
            />
            
            <Input
              label="Private Key"
              placeholder="Enter your private key"
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              fullWidth
            />
            
            {mode === 'buy' && ethAmount && (
              <div className="py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">Estimated Credits:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">{estimatedCredits}</span>
                </div>
              </div>
            )}
            
            <Button
              fullWidth
              variant={mode === 'buy' ? 'primary' : 'secondary'}
              onClick={mode === 'buy' ? handleBuy : handleSell}
              disabled={loading}
              className="mt-2"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {mode === 'buy' ? 'Buying...' : 'Selling...'}
                </span>
              ) : (
                <span className="flex items-center">
                  {mode === 'buy' ? <ArrowUpDown className="mr-2 h-4 w-4" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                  {mode === 'buy' ? 'Buy Now' : 'Sell Now'}
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Transaction Ledger */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blockchain Ledger</h3>
        </div>
        
        {ledger.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart4 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    TX Hash
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Credits
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ETH
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Wallet
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {ledger.map((tx, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                      <a 
                        href={`https://sepolia.etherscan.io/tx/ ${tx.txHash || "#"}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center hover:underline"
                      >
                        {tx.txHash?.slice(0, 6) || "N/A"}...
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`
                        px-2 py-1 rounded-full text-xs
                        ${tx.type === 'BUY'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}
                      `}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.region}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tx.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tx.ethAmount} ETH
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.party?.slice(0, 6) || "N/A"}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Marketplace;